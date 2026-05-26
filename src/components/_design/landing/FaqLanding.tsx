/**
 * Copyright (c) 2024-2026 BeemoBot Enterprise
 * All rights reserved.
 */
"use client";
import * as Accordion from "@radix-ui/react-accordion";
import { RiAddLine } from "@remixicon/react";
import * as React from "react";
import { SectionShell } from "../SectionShell";

const FAQ = [
  {
    id: "link-riot",
    question: "Comment je lie mon compte Riot ?",
    answer:
      "Connecte-toi via Discord, va sur /auth/link, entre ton Riot ID (GameName#Tag), choisis ta région. On te demande de changer ton icône d'invocateur pour celle qu'on affiche — c'est la vérif anti-usurpation. Tu remets ton ancienne icône après.",
  },
  {
    id: "free",
    question: "C'est gratuit ?",
    answer:
      "Oui. Le bot et toutes les fonctionnalités sont gratuits. Le shop te demande du honey gagné en jouant, jamais d'euros.",
  },
  {
    id: "regions",
    question: "Quelles régions Riot sont supportées ?",
    answer:
      "Toutes : EUW, EUNE, NA, BR, JP, KR, LA, LAS, OC, TR, RU. La Riot API est requêtée avec le bon routing à chaque fois.",
  },
  {
    id: "shroom-respect",
    question: "C'est quoi un shroom et un respect ?",
    answer:
      "Un respect = un autre joueur lié reconnaît une bonne game à toi. Un shroom = l'inverse, façon Teemo. Les deux remontent ton profil et alimentent les leaderboards. Le honey est la monnaie globale qui en découle.",
  },
  {
    id: "permissions",
    question: "Pourquoi le bot demande la permission Administrateur ?",
    answer:
      "Parce qu'il gère ses propres rôles (top shrooms, top respects), envoie dans les channels que tu choisis, et écoute les events pour les commandes slash. Tu peux affiner les permissions après l'invitation si tu veux.",
  },
  {
    id: "data",
    question: "Quelles données vous stockez sur moi ?",
    answer:
      "Ton ID Discord, ton avatar, ton Riot PUUID, ton GameName#Tag, et l'historique de tes shrooms/respects/honey. Pas d'email sauf si tu le donnes explicitement. Suppression sur demande dans /settings.",
  },
];

export function FaqLanding() {
  return (
    <SectionShell eyebrow="— FAQ" title="Questions fréquentes." lead="Les trucs qu'on nous demande le plus souvent.">
      <Accordion.Root type="single" collapsible className="flex flex-col gap-3 max-w-3xl">
        {FAQ.map((item) => (
          <Accordion.Item
            key={item.id}
            value={item.id}
            className="rounded-hf-card-lg border border-hf-line bg-hf-surface overflow-hidden"
          >
            <Accordion.Header>
              <Accordion.Trigger className="group flex items-center justify-between w-full px-5 py-4 text-left text-hf-body-lg font-semibold text-hf-navy hover:bg-hf-surface-alt transition-colors">
                <span>{item.question}</span>
                <RiAddLine
                  aria-hidden
                  className="size-5 text-hf-honey-text shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-45"
                />
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content className="overflow-hidden data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
              <div className="px-5 pb-4 text-hf-body-sm text-hf-navy-soft leading-relaxed">{item.answer}</div>
            </Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion.Root>
    </SectionShell>
  );
}
