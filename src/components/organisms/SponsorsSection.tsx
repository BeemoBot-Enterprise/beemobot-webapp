import { LOGO } from "@/assets/images";
import Image from "next/image";

const SponsorsSection = () => {
  return (
    <section className="space-y-8">
      {/* Installation Section */}
      <div className="bg-[#1a1d28] p-8 rounded-xl border border-gray-700/30">
        <h2 className="text-white text-3xl font-bold mb-6 border-b border-gray-700 pb-4">
          1. Installation
        </h2>

        <div className="space-y-6">
          <p className="font-medium text-lg">
            Intégrez BeemoBot à votre serveur Discord en quelques étapes simples
            :
          </p>

          <div className="bg-[#0f1117] p-6 rounded-lg border border-gray-700/30">
            <h3 className="font-semibold text-xl text-gray-200 mb-4 uppercase tracking-wide">
              Avant de commencer
            </h3>
            <ul className="space-y-4 text-base">
              <li className="leading-relaxed">
                <span className="font-semibold text-white">
                  Permissions administrateur
                </span>{" "}
                <span className="text-gray-300">
                  - Assurez-vous d'avoir les permissions nécessaires pour
                  ajouter un bot à votre serveur
                </span>
              </li>
              <li className="leading-relaxed">
                <span className="font-semibold text-white">
                  Serveur Discord actif
                </span>{" "}
                <span className="text-gray-300">
                  - Vérifiez que votre serveur est en ligne et fonctionnel
                </span>
              </li>
            </ul>
          </div>

          <div className="bg-[#0f1117] p-6 rounded-lg border border-gray-700/30">
            <h3 className="font-semibold text-xl text-gray-200 mb-5 uppercase tracking-wide">
              Étapes d'installation
            </h3>
            <ol className="space-y-6 list-decimal pl-6">
              <li>
                <div>
                  <span className="font-semibold text-white text-lg block mb-2">
                    Invitez le bot
                  </span>
                  <p className="mt-1 text-gray-300 leading-relaxed text-base">
                    Cliquez sur le bouton ci-dessous pour ouvrir la page
                    d'invitation officielle de Discord
                  </p>
                  <div className="mt-4">
                    <a
                      href={
                        process.env.NEXT_PUBLIC_BOT_INVITE_URL ||
                        process.env.BOT_INVITE_URL
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block bg-[#5865F2] hover:bg-[#4752C4] text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 hover:scale-[1.02] shadow-md"
                    >
                      Inviter BeemoBot sur votre serveur
                    </a>
                  </div>
                </div>
              </li>
              <li>
                <div>
                  <span className="font-semibold text-white text-lg block mb-2">
                    Sélectionnez votre serveur
                  </span>
                  <p className="mt-1 text-gray-300 leading-relaxed text-base">
                    Dans le menu déroulant, choisissez le serveur où vous
                    souhaitez ajouter BeemoBot, puis cliquez sur "Continuer"
                  </p>
                  <div className="mt-3 bg-[#0a0a0f] p-3 rounded border border-gray-700/30 text-gray-300 text-sm leading-relaxed">
                    <span className="text-amber-400 font-semibold">Note:</span>{" "}
                    Vous ne verrez que les serveurs où vous avez les permissions
                    d'administrateur
                  </div>
                </div>
              </li>
              <li>
                <div>
                  <span className="font-semibold text-white text-lg block mb-2">
                    Vérifiez et autorisez les permissions
                  </span>
                  <p className="mt-1 text-gray-300 leading-relaxed text-base">
                    Consultez les permissions demandées par le bot. Pour un
                    fonctionnement optimal, nous recommandons d'accorder toutes
                    les permissions suggérées
                  </p>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                    <div className="bg-[#0a0a0f] p-3 rounded border border-gray-700/30 text-gray-200">
                      <span className="text-emerald-400 font-bold">✓</span> Lire
                      les messages
                    </div>
                    <div className="bg-[#0a0a0f] p-3 rounded border border-gray-700/30 text-gray-200">
                      <span className="text-emerald-400 font-bold">✓</span>{" "}
                      Envoyer des messages
                    </div>
                    <div className="bg-[#0a0a0f] p-3 rounded border border-gray-700/30 text-gray-200">
                      <span className="text-emerald-400 font-bold">✓</span>{" "}
                      Joindre des fichiers
                    </div>
                    <div className="bg-[#0a0a0f] p-3 rounded border border-gray-700/30 text-gray-200">
                      <span className="text-emerald-400 font-bold">✓</span>{" "}
                      Utiliser les commandes slash
                    </div>
                  </div>
                </div>
              </li>
              <li>
                <div>
                  <span className="font-semibold text-white text-lg block mb-2">
                    C'est terminé !
                  </span>
                  <p className="mt-1 text-gray-300 leading-relaxed text-base">
                    BeemoBot est maintenant installé sur votre serveur. Pour
                    commencer à l'utiliser, tapez simplement "/" dans n'importe
                    quel canal et sélectionnez une commande BeemoBot
                  </p>
                  <div className="mt-4 bg-[#1e3a5f] border-l-4 border-[#5865F2] p-4 rounded">
                    <p className="text-blue-300 font-semibold mb-1">
                      Conseil :
                    </p>
                    <p className="text-gray-200 text-base leading-relaxed">
                      Créez un canal dédié nommé "#beemobot" pour garder vos
                      discussions organisées et faciliter l'utilisation du bot
                    </p>
                  </div>
                </div>
              </li>
            </ol>
          </div>

          <div className="bg-[#0f1117] p-6 rounded-lg border border-gray-700/30">
            <h3 className="font-semibold text-xl text-gray-200 mb-4 uppercase tracking-wide">
              Résolution des problèmes
            </h3>
            <ul className="space-y-4 text-base">
              <li className="leading-relaxed">
                <span className="font-semibold text-white">
                  Le bot n'apparaît pas en ligne
                </span>{" "}
                <span className="text-gray-300">
                  - Attendez quelques minutes et vérifiez votre connexion
                  internet. Si le problème persiste, réessayez l'installation
                </span>
              </li>
              <li className="leading-relaxed">
                <span className="font-semibold text-white">
                  Les commandes ne fonctionnent pas
                </span>{" "}
                <span className="text-gray-300">
                  - Vérifiez que le bot dispose des permissions appropriées dans
                  les paramètres du serveur
                </span>
              </li>
              <li className="leading-relaxed">
                <span className="font-semibold text-white">
                  Besoin d'aide ?
                </span>{" "}
                <span className="text-gray-300">-</span>
                <a
                  href="#"
                  className="text-blue-400 hover:text-blue-300 ml-2 underline transition-colors"
                >
                  Contactez notre support
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Utilisation Section */}
      <div className="bg-[#1a1d28] p-8 rounded-xl border border-gray-700/30">
        <h2 className="text-white text-3xl font-bold mb-6 border-b border-gray-700 pb-4">
          2. Utilisation
        </h2>

        <div className="space-y-6">
          <p className="font-semibold text-lg text-gray-200 mb-6">
            BeemoBot est un bot Discord conçu pour vous aider avec League of
            Legends. Voici comment l'utiliser :
          </p>

          <div className="bg-[#0f1117] p-6 rounded-lg border border-gray-700/30">
            <h3 className="font-semibold text-xl text-gray-200 mb-4 uppercase tracking-wide">
              Où et comment utiliser le bot
            </h3>
            <ul className="space-y-4 text-base">
              <li className="leading-relaxed">
                <span className="font-semibold text-white">
                  Dans les canaux Discord
                </span>{" "}
                <span className="text-gray-300">
                  - Utilisez les commandes dans n'importe quel canal où le bot a
                  accès
                </span>
              </li>
              <li className="leading-relaxed">
                <span className="font-semibold text-white">
                  Commandes avec préfixe
                </span>{" "}
                <span className="text-gray-300">
                  - Toutes les commandes commencent par le caractère "/"
                </span>
              </li>
              <li className="leading-relaxed">
                <span className="font-semibold text-white">Autocomplétion</span>{" "}
                <span className="text-gray-300">
                  - Discord vous suggérera les commandes disponibles après avoir
                  tapé "/"
                </span>
              </li>
              <li className="leading-relaxed">
                <span className="font-semibold text-white">Arguments</span>
                <span className="text-gray-300">
                  {" "}
                  - Certaines commandes nécessitent des informations
                  supplémentaires comme un nom d'utilisateur ou une région
                </span>
              </li>
            </ul>
          </div>

          <div className="bg-[#0f1117] p-6 rounded-lg border border-gray-700/30">
            <h3 className="font-semibold text-xl text-gray-200 mb-4 uppercase tracking-wide">
              Permissions et utilisation
            </h3>
            <ul className="space-y-4 text-base">
              <li className="leading-relaxed">
                <span className="font-semibold text-white">Permissions</span>
                <span className="text-gray-300">
                  {" "}
                  - Assurez-vous que le bot a les permissions appropriées dans
                  vos canaux
                </span>
              </li>
              <li className="leading-relaxed">
                <span className="font-semibold text-white">Disponibilité</span>{" "}
                <span className="text-gray-300">
                  - Le bot sera en ligne 24/7, mais des périodes de maintenance
                  peuvent avoir lieu
                </span>
              </li>
              <li className="leading-relaxed">
                <span className="font-semibold text-white">Limites</span>
                <span className="text-gray-300">
                  {" "}
                  - Pour éviter le spam, certaines commandes peuvent avoir un
                  temps de recharge
                </span>
              </li>
            </ul>
          </div>

          <div className="bg-[#0f1117] p-6 rounded-lg border border-gray-700/30">
            <h3 className="font-semibold text-xl text-gray-200 mb-4 uppercase tracking-wide">
              Aide et documentation
            </h3>
            <ul className="space-y-4 text-base">
              <li className="leading-relaxed">
                <span className="font-semibold text-white">
                  Liste des commandes
                </span>{" "}
                <span className="text-gray-300">
                  - Consultez notre{" "}
                  <a
                    href="/documentation"
                    className="text-blue-400 hover:text-blue-300 underline transition-colors"
                  >
                    page de documentation
                  </a>{" "}
                  pour la liste complète des commandes
                </span>
              </li>
              <li className="leading-relaxed">
                <span className="font-semibold text-white">Aide intégrée</span>{" "}
                <span className="text-gray-300">
                  - Utilisez la commande "/help" dans Discord pour obtenir de
                  l'aide directement dans votre serveur
                </span>
              </li>
              <li className="leading-relaxed">
                <span className="font-semibold text-white">Support</span>
                <span className="text-gray-300">
                  {" "}
                  - Pour toute question ou problème, rejoignez notre{" "}
                  <a
                    href="#"
                    className="text-blue-400 hover:text-blue-300 underline transition-colors"
                  >
                    serveur Discord de support
                  </a>
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Sponsors Section */}
      <div className="bg-[#1a1d28] p-8 rounded-xl border border-gray-700/30">
        <h2 className="text-white text-3xl font-bold mb-6 border-b border-gray-700 pb-4">
          3. Sponsors
        </h2>

        <div className="flex flex-wrap items-center gap-8">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src={LOGO.github}
              height={400}
              width={400}
              alt="GitHub"
              className="h-8 w-8"
            />
          </a>
          <a href="https://op.gg" target="_blank" rel="noopener noreferrer">
            <Image
              src={LOGO.opgg}
              height={400}
              width={400}
              alt="OP.GG"
              className="h-8 w-32"
            />
          </a>
          <a
            href="https://riotgames.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src={LOGO.riotGames}
              height={400}
              width={400}
              alt="Riot Games"
              className="h-8 w-24"
            />
          </a>
        </div>
      </div>
    </section>
  );
};

export default SponsorsSection;
