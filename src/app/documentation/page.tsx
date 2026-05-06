"use client";
import { useState } from "react";

export default function Documentation() {
  const [activeSection, setActiveSection] = useState("quickstart");

  const sections = [
    { id: "quickstart", title: "🚀 Quick start" },
    { id: "reputation", title: "🍄⭐ Le système de réputation" },
    { id: "honey", title: "🍯 Honey & shop" },
    { id: "faq", title: "❓ FAQ" },
  ];

  const handleSetActiveSection = (id: string) => {
    setActiveSection(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="flex min-h-screen bg-[#0f1117]">
      {/* Sidebar */}
      <div className="w-72 bg-[#1a1d28] border-r border-gray-700/50 p-6 sticky top-0 h-screen overflow-y-auto">
        <h2 className="text-2xl font-bold mb-8 text-white border-b border-gray-700 pb-4">
          Documentation
        </h2>
        <nav>
          <ul className="space-y-1">
            {sections.map((s) => (
              <li key={s.id}>
                <button
                  onClick={() => handleSetActiveSection(s.id)}
                  className={`w-full text-left px-4 py-3 rounded-md transition-colors text-sm font-medium ${
                    activeSection === s.id
                      ? "bg-[#5865F2] text-white"
                      : "text-gray-300 hover:bg-[#2a2e3b] hover:text-white"
                  }`}
                >
                  {s.title}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 p-10 max-w-5xl">
        <h1 className="text-5xl font-bold mb-12 text-white">
          Documentation BeemoBot
        </h1>

        {/* Quick start */}
        <section
          id="quickstart"
          className={`mb-16 bg-[#1a1d28] p-8 rounded-xl border transition-all ${
            activeSection === "quickstart"
              ? "border-[#5865F2] shadow-lg"
              : "border-gray-700/30"
          }`}
        >
          <h2 className="text-3xl font-bold mb-6 text-white">🚀 Quick start</h2>
          <p className="text-gray-300 mb-6 text-base leading-relaxed">
            Prends en main BeemoBot en 5 étapes.
          </p>
          <ol className="space-y-4">
            {[
              {
                step: "1",
                title: "Connecte-toi avec Discord",
                desc: 'Clique sur le bouton "Login" en haut à droite. Tu seras redirigé vers Discord pour autoriser BeemoBot à accéder à ton profil.',
              },
              {
                step: "2",
                title: "Lie ton compte Riot",
                desc: 'Rends-toi sur /auth/link et renseigne ton gameName, tagLine et ta région (ex : Pseudo + EUW1 + EUW). Le bot va vérifier ton identité via l\'API Riot.',
              },
              {
                step: "3",
                title: "Joue une game LoL",
                desc: "Joue une partie avec des gens qui utilisent aussi BeemoBot. Le worker détecte automatiquement les parties communes dans tes 20 dernières games.",
              },
              {
                step: "4",
                title: "Donne une réputation",
                desc: "Tape /judge Riot-Tag sur Discord pour juger un joueur présent dans une de tes parties récentes. Choisis 🍄 (shroom) ou ⭐ (respect) via les boutons interactifs.",
              },
              {
                step: "5",
                title: "Ou attends le DM automatique",
                desc: "Le worker proactif t'envoie un DM après chaque game pour te proposer de juger tes coéquipiers et adversaires. Pas besoin de taper une commande.",
              },
            ].map((item) => (
              <li
                key={item.step}
                className="flex gap-4 bg-[#0f1117] p-5 rounded-lg border border-gray-700/30"
              >
                <span className="flex-shrink-0 w-8 h-8 bg-[#5865F2] rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {item.step}
                </span>
                <div>
                  <p className="text-white font-semibold mb-1">{item.title}</p>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* Reputation system */}
        <section
          id="reputation"
          className={`mb-16 bg-[#1a1d28] p-8 rounded-xl border transition-all ${
            activeSection === "reputation"
              ? "border-[#5865F2] shadow-lg"
              : "border-gray-700/30"
          }`}
        >
          <h2 className="text-3xl font-bold mb-6 text-white">
            🍄⭐ Le système de réputation
          </h2>
          <p className="text-gray-300 mb-8 text-base leading-relaxed">
            La réputation BeemoBot est un reflet communautaire de ton comportement en jeu. Elle repose sur une preuve par match : tu ne peux juger que des gens avec qui tu as vraiment joué.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-[#0f1117] p-6 rounded-lg border border-gray-700/30">
              <h3 className="text-xl font-bold text-amber-400 mb-3">
                🍄 Shroom
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                "Tu as joué comme une chèvre" ou "tu as été toxique". Un shroom
                signale un comportement problématique : troll, AFK, insultes,
                int intentionnel.
              </p>
            </div>
            <div className="bg-[#0f1117] p-6 rounded-lg border border-gray-700/30">
              <h3 className="text-xl font-bold text-emerald-400 mb-3">
                ⭐ Respect
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                "GG bien joué". Un respect salue un bon comportement, de
                l'entraide, du fair-play ou simplement un bon game.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {[
              {
                icon: "🔒",
                title: "Preuve par match obligatoire",
                desc: "Tu ne peux juger que les joueurs présents dans tes vraies parties Riot (allié OU adverse). Le système vérifie via l'API Riot.",
              },
              {
                icon: "1️⃣",
                title: "Maximum 1 shroom + 1 respect par paire par match",
                desc: "Pour chaque match commun, tu peux donner au plus 1 shroom et 1 respect à chaque joueur. Le système trace tout pour éviter le spam.",
              },
              {
                icon: "📈",
                title: "Score immuable",
                desc: "Ton score ne baisse jamais. Ce que les gens pensent de toi reste gravé — c'est leur jugement, pas une note fluctuante.",
              },
              {
                icon: "⚖️",
                title: "Poids de la réputation",
                desc: "Le vote d'un joueur respecté pèse davantage. Ton influence dépend de ton propre score de réputation.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="flex gap-4 bg-[#0f1117] p-5 rounded-lg border border-gray-700/30"
              >
                <span className="text-2xl flex-shrink-0">{item.icon}</span>
                <div>
                  <p className="text-white font-semibold mb-1">{item.title}</p>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Honey & shop */}
        <section
          id="honey"
          className={`mb-16 bg-[#1a1d28] p-8 rounded-xl border transition-all ${
            activeSection === "honey"
              ? "border-[#5865F2] shadow-lg"
              : "border-gray-700/30"
          }`}
        >
          <h2 className="text-3xl font-bold mb-6 text-white">
            🍯 Honey & shop
          </h2>
          <p className="text-gray-300 mb-8 text-base leading-relaxed">
            Le honey est la monnaie de BeemoBot. Il s'accumule avec ta réputation et ton activité. Dépense-le dans le shop pour personnaliser ton profil.
          </p>

          <div className="mb-8">
            <h3 className="text-base font-semibold mb-4 text-gray-200 uppercase tracking-wide">
              Gagner du honey
            </h3>
            <div className="bg-[#0f1117] rounded-lg overflow-hidden border border-gray-700/30">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#0a0a0f] border-b border-gray-700">
                    <th className="py-4 px-5 text-left text-gray-200 font-semibold text-sm">
                      Action
                    </th>
                    <th className="py-4 px-5 text-left text-gray-200 font-semibold text-sm">
                      Honey gagné
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { action: "Recevoir un ⭐ Respect", honey: "+10 🍯" },
                    {
                      action: "Recevoir un 🍄 Shroom",
                      honey: '+5 🍯 ("rage compensation")',
                    },
                    { action: "Daily login", honey: "+20 🍯" },
                    { action: "Mini-jeu : victoire", honey: "×2 mise" },
                    { action: "Mini-jeu : défaite", honey: "Mise perdue" },
                  ].map((row, idx) => (
                    <tr
                      key={idx}
                      className={`border-b border-gray-800/50 last:border-b-0 ${
                        idx % 2 === 0 ? "bg-[#12141c]/50" : "bg-transparent"
                      }`}
                    >
                      <td className="py-4 px-5 text-gray-200 text-sm">
                        {row.action}
                      </td>
                      <td className="py-4 px-5 text-amber-400 font-mono text-sm font-semibold">
                        {row.honey}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h3 className="text-base font-semibold mb-4 text-gray-200 uppercase tracking-wide">
              Shop — ce qu'on peut acheter
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { name: "Badges", price: "100–500 🍯", desc: "Icônes de profil exclusives" },
                { name: "Borders", price: "500–1000 🍯", desc: "Cadres animés sur ton avatar" },
                { name: "Glow effects", price: "1000–2000 🍯", desc: "Effets lumineux sur ton profil" },
              ].map((item) => (
                <div
                  key={item.name}
                  className="bg-[#0f1117] p-5 rounded-lg border border-gray-700/30"
                >
                  <p className="text-white font-semibold mb-1">{item.name}</p>
                  <p className="text-amber-400 font-mono text-sm mb-2">
                    {item.price}
                  </p>
                  <p className="text-gray-400 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
            <p className="mt-4 text-gray-400 text-sm">
              Le honey est dépensable — ta réputation, elle, ne l'est pas. Les deux évoluent indépendamment.
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section
          id="faq"
          className={`mb-16 bg-[#1a1d28] p-8 rounded-xl border transition-all ${
            activeSection === "faq"
              ? "border-[#5865F2] shadow-lg"
              : "border-gray-700/30"
          }`}
        >
          <h2 className="text-3xl font-bold mb-6 text-white">❓ FAQ</h2>
          <div className="space-y-4">
            {[
              {
                q: "Je n'ai pas reçu de DM du bot",
                a: "Vérifie que les DMs serveur sont activés dans les paramètres Discord du serveur BeemoBot. Le worker tourne toutes les 5 minutes — attends un peu après ta game.",
              },
              {
                q: "Je ne peux pas juger ce joueur",
                a: "Vous devez avoir une match commune dans tes 20 dernières games. Si la partie est plus ancienne, elle n'est plus dans la fenêtre de vérification.",
              },
              {
                q: "Mon score n'a pas bougé",
                a: "La réputation est immuable — elle ne baisse jamais. Le honey aussi est append-only. Si tu viens de jouer, il faut attendre le poll worker (environ 5 minutes).",
              },
              {
                q: "Comment changer de Riot ID",
                a: "Contacte un admin du serveur. Le multi-link est désactivé pour la Phase 1. Un seul compte Riot par Discord.",
              },
              {
                q: "Ma clé Riot n'est pas reconnue",
                a: "Assure-toi que ton gameName et tagLine sont exacts (respecte la casse). La région doit correspondre à celle de ton compte (EUW1, NA1, KR, etc.).",
              },
              {
                q: "Conflit de match — le bot dit que je n'étais pas dans la partie",
                a: "L'API Riot peut avoir un délai. Réessaie 10 minutes après la fin de la game. Si le problème persiste, contacte un admin avec l'ID du match.",
              },
            ].map((item, idx) => (
              <details
                key={idx}
                className="bg-[#0f1117] rounded-lg border border-gray-700/30 group"
              >
                <summary className="flex items-center justify-between p-5 cursor-pointer text-white font-semibold text-sm list-none">
                  <span>{item.q}</span>
                  <span className="text-gray-400 group-open:rotate-180 transition-transform">
                    ▼
                  </span>
                </summary>
                <p className="px-5 pb-5 text-gray-300 text-sm leading-relaxed">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
