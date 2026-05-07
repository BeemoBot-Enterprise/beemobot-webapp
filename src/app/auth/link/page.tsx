/**
 * Copyright (c) 2024-2026 BeemoBot Enterprise
 * All rights reserved.
 */

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Button from "@/components/atoms/Button";
import { Card } from "@/components/atoms/Card";
import Input from "@/components/atoms/Input";
import Label from "@/components/atoms/Label";
import Badge from "@/components/atoms/Badge";
import { API_URL } from "@/lib/env";

const REGIONS = [
  "euw1",
  "eun1",
  "na1",
  "br1",
  "jp1",
  "kr",
  "la1",
  "la2",
  "oc1",
  "tr1",
  "ru",
];
const TOKEN_KEY = "beemobot_token";
const RETURN_TO_KEY = "beemobot_return_to";
const DDRAGON_VERSION = "14.1.1";

interface PreviewData {
  puuid: string;
  gameName: string;
  tagLine: string;
  profileIconId: number;
  summonerLevel: number;
  region: string;
  alreadyLinkedByOther: boolean;
  alreadyLinkedByMe: boolean;
  phantomEvents: number;
}

interface ChallengeData {
  expectedIconId: number;
  previousIconId: number;
  gameName: string;
  tagLine: string;
  region: string;
  expiresAt: string;
  ttlSeconds: number;
}

type Step =
  | "loading"
  | "search"
  | "preview"
  | "challenge"
  | "done"
  | "already-linked";

interface LinkedProfile {
  gameName: string;
  tagLine: string;
}

const iconUrl = (id: number) =>
  `https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VERSION}/img/profileicon/${id}.png`;

export default function LinkPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("loading");
  const [linkedProfile, setLinkedProfile] = useState<LinkedProfile | null>(null);
  const [unlinking, setUnlinking] = useState(false);
  const [gameName, setGameName] = useState("");
  const [tagLine, setTagLine] = useState("");
  const [region, setRegion] = useState("euw1");
  const [preview, setPreview] = useState<PreviewData | null>(null);
  const [challenge, setChallenge] = useState<ChallengeData | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [verifyMessage, setVerifyMessage] = useState<string | null>(null);
  const [secondsLeft, setSecondsLeft] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [doneData, setDoneData] = useState<{
    gameName: string;
    tagLine: string;
    previousIconId: number | null;
    phantomEvents: number;
  } | null>(null);

  const getToken = () =>
    typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null;

  // Bootstrap au mount: décide où l'utilisateur doit être.
  // - pas de token → login Discord (avec return_to pour revenir ici)
  // - token + linked: true → écran "déjà lié"
  // - token + linked: false → formulaire de recherche (état actuel)
  useEffect(() => {
    const token = getToken();
    if (!token) {
      localStorage.setItem(RETURN_TO_KEY, "/auth/link");
      window.location.href = `${API_URL}/auth/discord/redirect`;
      return;
    }

    fetch(`${API_URL}/profile/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (r) => {
        if (r.status === 401) {
          localStorage.removeItem(TOKEN_KEY);
          localStorage.setItem(RETURN_TO_KEY, "/auth/link");
          window.location.href = `${API_URL}/auth/discord/redirect`;
          return;
        }
        if (!r.ok) {
          setError("Impossible de récupérer ton profil. Réessaie.");
          setStep("search");
          return;
        }
        const profile = await r.json();
        if (profile?.linked && profile.gameName && profile.tagLine) {
          setLinkedProfile({
            gameName: profile.gameName,
            tagLine: profile.tagLine,
          });
          setStep("already-linked");
        } else {
          setStep("search");
        }
      })
      .catch(() => {
        setError("Réseau indisponible. Réessaie.");
        setStep("search");
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Compte à rebours du challenge
  useEffect(() => {
    if (!challenge) return;
    const tick = () => {
      const remaining = Math.max(
        0,
        Math.floor(
          (new Date(challenge.expiresAt).getTime() - Date.now()) / 1000,
        ),
      );
      setSecondsLeft(remaining);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [challenge]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const token = getToken();
      if (!token) throw new Error("Token Discord manquant. Reconnecte-toi.");

      const res = await fetch(`${API_URL}/auth/link/preview`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ gameName, tagLine, region }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(body.message ?? "Recherche impossible.");
      }
      setPreview(body);
      setStep("preview");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  };

  const handleStartChallenge = async () => {
    if (!preview) return;
    setLoading(true);
    setError(null);
    try {
      const token = getToken();
      if (!token) throw new Error("Token Discord manquant. Reconnecte-toi.");

      const res = await fetch(`${API_URL}/auth/link/challenge`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          gameName: preview.gameName,
          tagLine: preview.tagLine,
          region: preview.region,
        }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(body.message ?? "Impossible de démarrer le challenge.");
      }
      setChallenge(body);
      setStep("challenge");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    setVerifying(true);
    setVerifyMessage(null);
    try {
      const token = getToken();
      if (!token) throw new Error("Token Discord manquant. Reconnecte-toi.");

      const res = await fetch(`${API_URL}/auth/link/verify`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (res.status === 409 && body.error === "icon_mismatch") {
          setVerifyMessage(body.message ?? "Icône pas encore détectée.");
          return;
        }
        if (res.status === 410 || res.status === 404) {
          setError(body.message ?? "Challenge expiré.");
          setStep("search");
          setChallenge(null);
          return;
        }
        throw new Error(body.message ?? "Vérification impossible.");
      }
      setDoneData({
        gameName: body.gameName,
        tagLine: body.tagLine,
        previousIconId: body.previousIconId ?? null,
        phantomEvents: body.phantomEvents ?? 0,
      });
      setStep("done");
    } catch (err) {
      setVerifyMessage(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setVerifying(false);
    }
  };

  const handleBack = () => {
    setStep("search");
    setPreview(null);
    setChallenge(null);
    setVerifyMessage(null);
    setError(null);
  };

  const handleUnlink = async () => {
    setUnlinking(true);
    setError(null);
    try {
      const token = getToken();
      if (!token) throw new Error("Token manquant. Reconnecte-toi.");
      const res = await fetch(`${API_URL}/auth/unlink`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message ?? "Impossible de délier le compte.");
      }
      setLinkedProfile(null);
      setStep("search");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setUnlinking(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-64px)] flex items-center justify-center px-6 py-12">
      <Card className="max-w-md w-full p-8 rounded-20 border-stroke-soft-200 bg-bg-weak-50">
        {step !== "loading" && step !== "already-linked" && (
          <div className="flex items-center gap-2 mb-6 text-subheading-2xs uppercase tracking-widest">
            <span
              className={
                step === "search"
                  ? "text-text-strong-950"
                  : "text-text-soft-400"
              }
            >
              01 · Recherche
            </span>
            <span className="text-text-soft-400">›</span>
            <span
              className={
                step === "preview"
                  ? "text-text-strong-950"
                  : "text-text-soft-400"
              }
            >
              02 · Confirmation
            </span>
            <span className="text-text-soft-400">›</span>
            <span
              className={
                step === "challenge" || step === "done"
                  ? "text-text-strong-950"
                  : "text-text-soft-400"
              }
            >
              03 · Vérification
            </span>
          </div>
        )}

        {step === "loading" && (
          <div className="flex flex-col items-center gap-4 py-12">
            <svg
              className="animate-spin h-8 w-8 text-text-sub-600"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="2"
                opacity="0.2"
              />
              <path
                d="M12 2a10 10 0 0 1 10 10"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            <p className="text-text-sub-600 text-sm">Chargement…</p>
          </div>
        )}

        {step === "already-linked" && linkedProfile && (
          <>
            <h1 className="text-title-h5 text-text-strong-950 !font-[600] mb-2">
              Déjà lié ✓
            </h1>
            <p className="text-text-sub-600 mb-6 text-sm">
              Ton compte Discord est lié à{" "}
              <strong className="text-text-strong-950">
                {linkedProfile.gameName}#{linkedProfile.tagLine}
              </strong>
              . Tu peux donner des shrooms et des respects.
            </p>

            {error && (
              <p className="text-sm text-error-base mb-3" role="alert">
                {error}
              </p>
            )}

            <div className="flex flex-col gap-3">
              <Button
                variant="primary"
                onClick={() =>
                  router.push(
                    `/u/${encodeURIComponent(`${linkedProfile.gameName}-${linkedProfile.tagLine}`)}`,
                  )
                }
              >
                Voir mon profil public
              </Button>
              <Button
                onClick={handleUnlink}
                variant="ghost"
                disabled={unlinking}
              >
                {unlinking ? "Déliage…" : "Délier ce compte"}
              </Button>
            </div>

            <p className="text-xs text-text-sub-600 mt-4">
              Pour changer de compte Riot, délie d&apos;abord celui-ci.
            </p>
          </>
        )}

        {step === "search" && (
          <>
            <h1 className="text-title-h5 text-text-strong-950 !font-[600] mb-2">
              Lie ton compte Riot
            </h1>
            <p className="text-text-sub-600 mb-6 text-sm">
              On va d&apos;abord chercher ton compte, puis vérifier qu&apos;il
              t&apos;appartient via une icône.
            </p>

            <form onSubmit={handleSearch} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="gameName">Game name</Label>
                <Input
                  id="gameName"
                  value={gameName}
                  onChange={(e) => setGameName(e.target.value)}
                  placeholder="Nunch"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="tagLine">Tag line</Label>
                <Input
                  id="tagLine"
                  value={tagLine}
                  onChange={(e) => setTagLine(e.target.value)}
                  placeholder="N7789"
                  required
                />
                <p className="text-xs text-text-sub-600">
                  Le tag complet, sans le #.
                </p>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="region">Région</Label>
                <select
                  id="region"
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="h-10 rounded-md border border-stroke-soft-200 bg-bg-weak-50 px-3 text-sm text-text-strong-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
                >
                  {REGIONS.map((r) => (
                    <option key={r} value={r}>
                      {r.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>

              {error && (
                <p className="text-sm text-error-base" role="alert">
                  {error}
                </p>
              )}

              <div className="flex items-center gap-3 mt-2">
                <Button type="submit" variant="primary" disabled={loading}>
                  {loading ? "Recherche…" : "Rechercher"}
                </Button>
                <Link
                  href="/"
                  className="text-sm text-text-sub-600 hover:text-text-strong-950 transition-colors"
                >
                  Retour
                </Link>
              </div>
            </form>
          </>
        )}

        {step === "preview" && preview && (
          <>
            <h1 className="text-title-h5 text-text-strong-950 !font-[600] mb-2">
              Est-ce bien toi ?
            </h1>
            <p className="text-text-sub-600 mb-6 text-sm">
              Vérifie le compte avant de lancer la vérification.
            </p>

            <div className="flex items-center gap-4 mb-6 p-4 rounded-md border border-stroke-soft-200 bg-bg-weak-50">
              <Image
                src={iconUrl(preview.profileIconId)}
                alt="Icône d'invocateur"
                width={64}
                height={64}
                className="rounded-md"
              />
              <div className="flex-1 min-w-0">
                <div className="text-label-md text-text-strong-950 truncate">
                  {preview.gameName}
                  <span className="text-text-sub-600">#{preview.tagLine}</span>
                </div>
                <div className="text-xs text-text-sub-600 mt-0.5">
                  Niveau {preview.summonerLevel} ·{" "}
                  {preview.region.toUpperCase()}
                </div>
                {preview.phantomEvents > 0 && (
                  <div className="text-xs text-primary-base mt-1">
                    {preview.phantomEvents} évènements en attente
                  </div>
                )}
              </div>
            </div>

            {preview.alreadyLinkedByMe && (
              <Card className="p-4 mb-4 border-accent/40">
                <p className="text-sm text-text-strong-950">
                  Ce compte est <strong>déjà lié à ton profil</strong>.
                </p>
              </Card>
            )}

            {preview.alreadyLinkedByOther && (
              <Card className="p-4 mb-4 border-danger/40 bg-error-base/5">
                <p className="text-sm text-text-strong-950 mb-2">
                  <strong>Ce compte Riot est déjà pris.</strong>
                </p>
                <p className="text-xs text-text-sub-600">
                  Quelqu&apos;un l&apos;a déjà associé à son profil BeemoBot. Si
                  tu penses qu&apos;il a été usurpé, contacte le support sur{" "}
                  <a
                    href="https://discord.gg/beemobot"
                    className="text-primary-base hover:underline"
                    target="_blank"
                    rel="noreferrer"
                  >
                    notre Discord
                  </a>
                  .
                </p>
              </Card>
            )}

            {error && (
              <p className="text-sm text-error-base mb-3" role="alert">
                {error}
              </p>
            )}

            <div className="flex items-center gap-3">
              {!preview.alreadyLinkedByOther && !preview.alreadyLinkedByMe && (
                <Button
                  onClick={handleStartChallenge}
                  variant="primary"
                  disabled={loading}
                >
                  {loading ? "…" : "Oui, lancer la vérification"}
                </Button>
              )}
              {preview.alreadyLinkedByMe && (
                <Link href="/profile">
                  <Button variant="primary">Retour au profil</Button>
                </Link>
              )}
              <Button
                onClick={handleBack}
                variant="ghost"
                disabled={loading}
              >
                {preview.alreadyLinkedByOther ? "Réessayer" : "Modifier"}
              </Button>
            </div>
          </>
        )}

        {step === "challenge" && challenge && (
          <>
            <h1 className="text-title-h5 text-text-strong-950 !font-[600] mb-2">
              Prouve que c&apos;est ton compte
            </h1>
            <p className="text-text-sub-600 mb-6 text-sm">
              Change l&apos;icône d&apos;invocateur sur{" "}
              <strong className="text-text-strong-950">
                {challenge.gameName}#{challenge.tagLine}
              </strong>{" "}
              pour celle ci-dessous, puis clique sur{" "}
              <strong className="text-text-strong-950">J&apos;ai changé</strong>.
            </p>

            <div className="flex flex-col items-center gap-3 mb-6 p-6 rounded-md border border-accent/40 bg-primary-base/5">
              <Image
                src={iconUrl(challenge.expectedIconId)}
                alt={`Icône ${challenge.expectedIconId}`}
                width={96}
                height={96}
                className="rounded-md"
              />
              <div className="text-xs text-text-sub-600">
                Icône #{challenge.expectedIconId}
              </div>
              <div className="text-xs text-text-sub-600">
                Expire dans{" "}
                <span className="text-text-strong-950 font-mono">
                  {Math.floor(secondsLeft / 60)}:
                  {String(secondsLeft % 60).padStart(2, "0")}
                </span>
              </div>
            </div>

            <ol className="text-sm text-text-sub-600 mb-6 flex flex-col gap-1.5 list-decimal list-inside">
              <li>Ouvre le client League of Legends.</li>
              <li>Va sur ton profil → clique sur ton icône.</li>
              <li>Sélectionne l&apos;icône ci-dessus.</li>
              <li>Reviens ici et clique &quot;J&apos;ai changé&quot;.</li>
            </ol>

            {verifyMessage && (
              <Card className="p-3 mb-4 border-accent-gold/40 bg-primary-base-gold/5">
                <p className="text-sm text-text-strong-950">{verifyMessage}</p>
              </Card>
            )}

            <div className="flex items-center gap-3">
              <Button
                onClick={handleVerify}
                variant="primary"
                disabled={verifying || secondsLeft <= 0}
              >
                {verifying
                  ? "Vérification…"
                  : secondsLeft <= 0
                    ? "Expiré"
                    : "J'ai changé l'icône"}
              </Button>
              <Button
                onClick={handleBack}
                variant="ghost"
                disabled={verifying}
              >
                Annuler
              </Button>
            </div>

            <p className="text-xs text-text-sub-600 mt-4">
              <Badge variant="default">Astuce</Badge>{" "}
              <span className="ml-1">
                Si Riot met du temps à propager le changement, attends 30s puis
                réessaie. Pas besoin de relancer le challenge.
              </span>
            </p>
          </>
        )}

        {step === "done" && doneData && (
          <>
            <h1 className="text-title-h5 text-text-strong-950 !font-[600] mb-2">
              Compte lié ✓
            </h1>
            <p className="text-text-sub-600 mb-6 text-sm">
              <strong className="text-text-strong-950">
                {doneData.gameName}#{doneData.tagLine}
              </strong>{" "}
              est maintenant associé à ton profil.
            </p>

            {doneData.phantomEvents > 0 && (
              <Card className="p-4 mb-4 border-accent/40">
                <p className="text-sm text-text-strong-950">
                  Tu avais{" "}
                  <strong>{doneData.phantomEvents} évènements</strong> de
                  réputation en attente — ils sont maintenant à toi.
                </p>
              </Card>
            )}

            {doneData.previousIconId !== null && (
              <Card className="p-4 mb-6">
                <p className="text-xs text-text-sub-600 mb-2">
                  Tu peux remettre ton ancienne icône :
                </p>
                <div className="flex items-center gap-3">
                  <Image
                    src={iconUrl(doneData.previousIconId)}
                    alt="Ancienne icône"
                    width={48}
                    height={48}
                    className="rounded-md"
                  />
                  <span className="text-xs text-text-sub-600">
                    Icône #{doneData.previousIconId}
                  </span>
                </div>
              </Card>
            )}

            <div className="flex items-center gap-3">
              <Button
                variant="primary"
                onClick={() =>
                  router.push(
                    `/u/${encodeURIComponent(`${doneData.gameName}-${doneData.tagLine}`)}`,
                  )
                }
              >
                Voir mon profil public
              </Button>
              <Link href="/profile">
                <Button variant="ghost">Mon profil</Button>
              </Link>
            </div>
          </>
        )}
      </Card>
    </main>
  );
}
