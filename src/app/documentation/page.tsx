"use client";
import { useState } from "react";

export default function Documentation() {
  const [activeSection, setActiveSection] = useState("mastery");

  const commands = [
    {
      id: "mastery",
      name: "/mastery",
      syntax: "/mastery ?{nom_d_utilisateur#tag} ?{region}",
      description:
        "Affiche les informations de maîtrise de champion pour un joueur",
      details:
        "Cette commande permet de consulter le niveau de maîtrise de champion d'un joueur, montrant ses points de maîtrise totaux, ses champions les plus joués, et ses niveaux de maîtrise par champion.",
      examples: ["/mastery JoueurTest#EUW", "/mastery JoueurTest#EUW EUW"],
      params: [
        {
          name: "nom_d_utilisateur#tag",
          desc: "Nom d'utilisateur avec son tag (optionnel)",
          example: "Pseudo#EUW",
        },
        {
          name: "region",
          desc: "Région du joueur (optionnel)",
          example: "EUW, NA, KR",
        },
      ],
    },
    {
      id: "runes",
      name: "/runes",
      syntax: "/runes ?{role} ?{nom_du_champion}",
      description: "Affiche les runes recommandées pour un champion et un rôle",
      details:
        "Fournit les meilleures configurations de runes pour un champion dans un rôle spécifique, basées sur les statistiques et meta actuelles.",
      examples: ["/runes mid Ahri", "/runes jungle Graves"],
      params: [
        {
          name: "role",
          desc: "Rôle du champion (optionnel)",
          example: "top, jungle, mid, adc, support",
        },
        {
          name: "nom_du_champion",
          desc: "Nom du champion (optionnel)",
          example: "Ahri, Yasuo, Jinx",
        },
      ],
    },
    {
      id: "items",
      name: "/items",
      syntax: "/items ?{role} ?{nom_du_champion}",
      description: "Affiche les objets recommandés pour un champion et un rôle",
      details:
        "Présente les builds d'objets recommandés pour un champion dans un rôle spécifique, incluant les objets de départ, les objets principaux et les choix situationnels.",
      examples: ["/items top Darius", "/items support Thresh"],
      params: [
        {
          name: "role",
          desc: "Rôle du champion (optionnel)",
          example: "top, jungle, mid, adc, support",
        },
        {
          name: "nom_du_champion",
          desc: "Nom du champion (optionnel)",
          example: "Darius, Thresh, Lux",
        },
      ],
    },
    {
      id: "wr",
      name: "/wr",
      syntax: "/wr ?{nom_d_utilisateur#tag} ?{region} {queueType}",
      description: "Affiche le winrate d'un joueur dans une file spécifique",
      details:
        "Calcule et affiche le pourcentage de victoires d'un joueur dans un type de file spécifique, basé sur ses parties récentes.",
      examples: [
        "/wr JoueurTest#EUW RANKED_SOLO_5x5",
        "/wr JoueurTest#EUW EUW RANKED_FLEX_SR",
      ],
      params: [
        {
          name: "nom_d_utilisateur#tag",
          desc: "Nom d'utilisateur avec son tag (optionnel)",
          example: "Pseudo#EUW",
        },
        {
          name: "region",
          desc: "Région du joueur (optionnel)",
          example: "EUW, NA, KR",
        },
        {
          name: "queueType",
          desc: "Type de file (requis)",
          example: "RANKED_SOLO_5x5, RANKED_FLEX_SR",
        },
      ],
    },
    {
      id: "rank",
      name: "/rank",
      syntax: "/rank ?{nom_d_utilisateur#tag} ?{region} {queueType}",
      description: "Affiche le rang d'un joueur dans une file spécifique",
      details:
        "Montre le rang actuel d'un joueur dans une file de classement spécifique, avec des informations sur sa division, ses LP et son historique récent.",
      examples: [
        "/rank JoueurTest#EUW RANKED_SOLO_5x5",
        "/rank JoueurTest#EUW EUW RANKED_FLEX_SR",
      ],
      params: [
        {
          name: "nom_d_utilisateur#tag",
          desc: "Nom d'utilisateur avec son tag (optionnel)",
          example: "Pseudo#EUW",
        },
        {
          name: "region",
          desc: "Région du joueur (optionnel)",
          example: "EUW, NA, KR",
        },
        {
          name: "queueType",
          desc: "Type de file (requis)",
          example: "RANKED_SOLO_5x5, RANKED_FLEX_SR",
        },
      ],
    },
    {
      id: "user",
      name: "/user",
      syntax: "/user ?{nom_d_utilisateur#tag} ?{region}",
      description: "Affiche les informations générales d'un utilisateur",
      details:
        "Fournit un aperçu complet du profil d'un joueur, incluant son niveau de compte, ses champions les plus joués, et ses statistiques générales.",
      examples: ["/user JoueurTest#EUW", "/user JoueurTest#EUW EUW"],
      params: [
        {
          name: "nom_d_utilisateur#tag",
          desc: "Nom d'utilisateur avec son tag (optionnel)",
          example: "Pseudo#EUW",
        },
        {
          name: "region",
          desc: "Région du joueur (optionnel)",
          example: "EUW, NA, KR",
        },
      ],
    },
    {
      id: "twitch",
      name: "/twitch",
      syntax: "/twitch {TwitchLink} ?{nom_d_utilisateur#tag} ?{region}",
      description: "Lie un compte Twitch au profil d'un joueur",
      details:
        "Permet d'associer un compte Twitch à un profil de joueur League of Legends, facilitant le partage et le suivi des streams.",
      examples: [
        "/twitch https://twitch.tv/streamer JoueurTest#EUW",
        "/twitch https://twitch.tv/streamer JoueurTest#EUW EUW",
      ],
      params: [
        {
          name: "TwitchLink",
          desc: "Lien vers le compte Twitch (requis)",
          example: "https://twitch.tv/streamer",
        },
        {
          name: "nom_d_utilisateur#tag",
          desc: "Nom d'utilisateur avec son tag (optionnel)",
          example: "Pseudo#EUW",
        },
        {
          name: "region",
          desc: "Région du joueur (optionnel)",
          example: "EUW, NA, KR",
        },
      ],
    },
    {
      id: "report",
      name: "/report",
      syntax: "/report {nom_d_utilisateur#tag} ?{region} {tags|enum}",
      description: "Signale un joueur pour un comportement spécifique",
      details:
        "Permet de signaler un joueur pour différents types de comportement problématique, en utilisant un système de tags prédéfinis.",
      examples: [
        "/report JoueurToxic#EUW flaming",
        "/report JoueurToxic#EUW EUW afk",
      ],
      params: [
        {
          name: "nom_d_utilisateur#tag",
          desc: "Nom d'utilisateur avec son tag (requis)",
          example: "Pseudo#EUW",
        },
        {
          name: "region",
          desc: "Région du joueur (optionnel)",
          example: "EUW, NA, KR",
        },
        {
          name: "tags|enum",
          desc: "Type de comportement à signaler (requis)",
          example: "flaming, afk, feeding, cheating",
        },
      ],
    },
    {
      id: "toxic",
      name: "/toxic",
      syntax: "/toxic ?{nom_d_utilisateur#tag} ?{region}",
      description: "Vérifie le niveau de toxicité d'un joueur",
      details:
        "Analyse le comportement passé d'un joueur pour estimer son niveau de toxicité, basé sur les rapports reçus et autres indicateurs.",
      examples: ["/toxic JoueurTest#EUW", "/toxic JoueurTest#EUW EUW"],
      params: [
        {
          name: "nom_d_utilisateur#tag",
          desc: "Nom d'utilisateur avec son tag (optionnel)",
          example: "Pseudo#EUW",
        },
        {
          name: "region",
          desc: "Région du joueur (optionnel)",
          example: "EUW, NA, KR",
        },
      ],
    },
    {
      id: "shroom",
      name: "/shroom",
      syntax: "/shroom {nom_d_utilisateur#tag} ?{region}",
      description:
        "Attribue un point négatif à un joueur pour mauvais comportement",
      details:
        "Enregistre un point négatif pour un joueur qui a eu un comportement non respectueux ou qui a trollé. Accumule les infractions pour établir une réputation négative.",
      examples: ["/shroom JoueurTroll#EUW", "/shroom JoueurTroll#EUW EUW"],
      params: [
        {
          name: "nom_d_utilisateur#tag",
          desc: "Nom d'utilisateur avec son tag (requis)",
          example: "Pseudo#EUW",
        },
        {
          name: "region",
          desc: "Région du joueur (optionnel)",
          example: "EUW, NA, KR",
        },
      ],
    },
    {
      id: "respect",
      name: "/respect",
      syntax: "/respect ?{nom_d_utilisateur#tag} ?{region}",
      description:
        "Attribue un point positif à un joueur pour bon comportement",
      details:
        "Enregistre un point positif pour un joueur qui a démontré un comportement exemplaire, de l'esprit sportif ou de l'entraide. Contribue à établir une réputation positive dans la communauté.",
      examples: [
        "/respect JoueurRespectueux#EUW",
        "/respect JoueurRespectueux#EUW EUW",
      ],
      params: [
        {
          name: "nom_d_utilisateur#tag",
          desc: "Nom d'utilisateur avec son tag (optionnel)",
          example: "Pseudo#EUW",
        },
        {
          name: "region",
          desc: "Région du joueur (optionnel)",
          example: "EUW, NA, KR",
        },
      ],
    },
  ];

  const handleSetActiveSection = (id: any) => {
    setActiveSection(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="flex min-h-screen bg-[#0f1117]">
      {/* Sidebar */}
      <div className="w-72 bg-[#1a1d28] border-r border-gray-700/50 p-6 sticky top-0 h-screen overflow-y-auto">
        <h2 className="text-2xl font-bold mb-8 text-white border-b border-gray-700 pb-4">
          Commandes
        </h2>
        <nav>
          <ul className="space-y-1">
            {commands.map((cmd) => (
              <li key={cmd.id}>
                <button
                  onClick={() => handleSetActiveSection(cmd.id)}
                  className={`w-full text-left px-4 py-3 rounded-md transition-colors text-sm font-medium ${
                    activeSection === cmd.id
                      ? "bg-[#5865F2] text-white"
                      : "text-gray-300 hover:bg-[#2a2e3b] hover:text-white"
                  }`}
                >
                  {cmd.name}
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

        {commands.map((cmd) => (
          <section
            key={cmd.id}
            id={cmd.id}
            className={`mb-16 bg-[#1a1d28] p-8 rounded-xl border transition-all ${
              activeSection === cmd.id
                ? "border-[#5865F2] shadow-lg"
                : "border-gray-700/30"
            }`}
          >
            <h2 className="text-3xl font-bold mb-6 text-white">{cmd.name}</h2>

            <div className="mb-8 bg-[#0f1117] p-5 rounded-lg border border-gray-700/30">
              <h3 className="text-base font-semibold mb-3 text-gray-200 uppercase tracking-wide">
                Syntaxe
              </h3>
              <code className="block p-4 bg-[#0a0a0f] rounded-md text-emerald-400 font-mono text-sm leading-relaxed border border-gray-800">
                {cmd.syntax}
              </code>
            </div>

            <div className="mb-8 leading-relaxed">
              <h3 className="text-base font-semibold mb-3 text-gray-200 uppercase tracking-wide">
                Description
              </h3>
              <p className="text-white text-base mb-3">{cmd.description}</p>
              <p className="text-gray-300 text-base">{cmd.details}</p>
            </div>

            <div className="mb-8">
              <h3 className="text-base font-semibold mb-4 text-gray-200 uppercase tracking-wide">
                Paramètres
              </h3>
              <div className="bg-[#0f1117] rounded-lg overflow-hidden border border-gray-700/30">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#0a0a0f] border-b border-gray-700">
                      <th className="py-4 px-5 text-left text-gray-200 font-semibold text-sm">
                        Paramètre
                      </th>
                      <th className="py-4 px-5 text-left text-gray-200 font-semibold text-sm">
                        Description
                      </th>
                      <th className="py-4 px-5 text-left text-gray-200 font-semibold text-sm">
                        Exemple
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {cmd.params.map((param, idx) => (
                      <tr
                        key={idx}
                        className={`border-b border-gray-800/50 last:border-b-0 ${
                          idx % 2 === 0 ? "bg-[#12141c]/50" : "bg-transparent"
                        }`}
                      >
                        <td className="py-4 px-5 font-mono text-blue-400 text-sm">
                          {param.name}
                        </td>
                        <td className="py-4 px-5 text-gray-200 text-sm">
                          {param.desc}
                        </td>
                        <td className="py-4 px-5 text-gray-400 font-mono text-sm">
                          {param.example}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h3 className="text-base font-semibold mb-4 text-gray-200 uppercase tracking-wide">
                Exemples
              </h3>
              <ul className="space-y-3">
                {cmd.examples.map((example, idx) => (
                  <li
                    key={idx}
                    className="bg-[#0f1117] p-4 rounded-lg text-amber-400 font-mono text-sm border border-gray-700/30"
                  >
                    {example}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
