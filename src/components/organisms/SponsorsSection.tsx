import { LOGO } from "@/assets/images";
import Image from "next/image";

const SponsorsSection = () => {
  return (
    <section className="bg-[#2a2e3b] rounded-xl overflow-hidden shadow-lg p-8">
      <div className="mb-8">
        <div className="mb-6">
          <span className="text-white text-2xl font-medium">
            1. Installation
          </span>

          <div className="space-y-6 mt-4">
            <p className="font-medium text-lg">
              Intégrez BeemoBot à votre serveur Discord en quelques étapes
              simples :
            </p>

            <div className="bg-[#363a49] p-5 rounded-lg">
              <h3 className="font-semibold text-lg text-white mb-3">
                Avant de commencer
              </h3>
              <ul className="space-y-3">
                <li>
                  <span className="font-medium text-white">
                    Permissions administrateur
                  </span>{" "}
                  - Assurez-vous d'avoir les permissions nécessaires pour
                  ajouter un bot à votre serveur
                </li>
                <li>
                  <span className="font-medium text-white">
                    Serveur Discord actif
                  </span>{" "}
                  - Vérifiez que votre serveur est en ligne et fonctionnel
                </li>
              </ul>
            </div>

            <div className="bg-[#363a49] p-5 rounded-lg">
              <h3 className="font-semibold text-lg text-white mb-3">
                Étapes d'installation
              </h3>
              <ol className="space-y-4 list-decimal pl-6">
                <li>
                  <div>
                    <span className="font-medium text-white text-lg">
                      Invitez le bot
                    </span>
                    <p className="mt-1 text-gray-300">
                      Cliquez sur le bouton ci-dessous pour ouvrir la page
                      d'invitation officielle de Discord
                    </p>
                    <div className="mt-3">
                      <a
                        href={
                          process.env.NEXT_PUBLIC_BOT_INVITE_URL ||
                          process.env.BOT_INVITE_URL
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
                      >
                        Inviter BeemoBot sur votre serveur
                      </a>
                    </div>
                  </div>
                </li>
                <li>
                  <div>
                    <span className="font-medium text-white text-lg">
                      Sélectionnez votre serveur
                    </span>
                    <p className="mt-1 text-gray-300">
                      Dans le menu déroulant, choisissez le serveur où vous
                      souhaitez ajouter BeemoBot, puis cliquez sur "Continuer"
                    </p>
                    <div className="mt-2 bg-[#2a2e3b] p-2 rounded text-gray-400 text-sm">
                      <span className="text-yellow-400">Note:</span> Vous ne
                      verrez que les serveurs où vous avez les permissions
                      d'administrateur
                    </div>
                  </div>
                </li>
                <li>
                  <div>
                    <span className="font-medium text-white text-lg">
                      Vérifiez et autorisez les permissions
                    </span>
                    <p className="mt-1 text-gray-300">
                      Consultez les permissions demandées par le bot. Pour un
                      fonctionnement optimal, nous recommandons d'accorder
                      toutes les permissions suggérées
                    </p>
                    <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                      <div className="bg-[#2a2e3b] p-2 rounded">
                        <span className="text-green-400">✓</span> Lire les
                        messages
                      </div>
                      <div className="bg-[#2a2e3b] p-2 rounded">
                        <span className="text-green-400">✓</span> Envoyer des
                        messages
                      </div>
                      <div className="bg-[#2a2e3b] p-2 rounded">
                        <span className="text-green-400">✓</span> Joindre des
                        fichiers
                      </div>
                      <div className="bg-[#2a2e3b] p-2 rounded">
                        <span className="text-green-400">✓</span> Utiliser les
                        commandes slash
                      </div>
                    </div>
                  </div>
                </li>
                <li>
                  <div>
                    <span className="font-medium text-white text-lg">
                      C'est terminé !
                    </span>
                    <p className="mt-1 text-gray-300">
                      BeemoBot est maintenant installé sur votre serveur. Pour
                      commencer à l'utiliser, tapez simplement "/" dans
                      n'importe quel canal et sélectionnez une commande BeemoBot
                    </p>
                    <div className="mt-3 bg-[#2d3748] border-l-4 border-blue-500 p-3 rounded">
                      <p className="text-blue-300 font-medium">Conseil :</p>
                      <p className="text-gray-300">
                        Créez un canal dédié nommé "#beemobot" pour garder vos
                        discussions organisées et faciliter l'utilisation du bot
                      </p>
                    </div>
                  </div>
                </li>
              </ol>
            </div>

            <div className="bg-[#363a49] p-5 rounded-lg">
              <h3 className="font-semibold text-lg text-white mb-3">
                Résolution des problèmes
              </h3>
              <ul className="space-y-3">
                <li>
                  <span className="font-medium text-white">
                    Le bot n'apparaît pas en ligne
                  </span>{" "}
                  - Attendez quelques minutes et vérifiez votre connexion
                  internet. Si le problème persiste, réessayez l'installation
                </li>
                <li>
                  <span className="font-medium text-white">
                    Les commandes ne fonctionnent pas
                  </span>{" "}
                  - Vérifiez que le bot dispose des permissions appropriées dans
                  les paramètres du serveur
                </li>
                <li>
                  <span className="font-medium text-white">
                    Besoin d'aide ?
                  </span>{" "}
                  -
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

        <div className="mb-6">
          <span className="text-white text-2xl font-medium">
            2. Utilisation
          </span>

          <div className="space-y-6 mt-4">
            <p className="font-medium text-lg">
              BeemoBot est un bot Discord conçu pour vous aider avec League of
              Legends. Voici comment l'utiliser :
            </p>

            <div className="bg-[#363a49] p-5 rounded-lg">
              <h3 className="font-semibold text-lg text-white mb-3">
                Où et comment utiliser le bot
              </h3>
              <ul className="space-y-3">
                <li>
                  <span className="font-medium text-white">
                    Dans les canaux Discord
                  </span>{" "}
                  - Utilisez les commandes dans n'importe quel canal où le bot a
                  accès
                </li>
                <li>
                  <span className="font-medium text-white">
                    Commandes avec préfixe
                  </span>{" "}
                  - Toutes les commandes commencent par le caractère "/"
                </li>
                <li>
                  <span className="font-medium text-white">Autocomplétion</span>{" "}
                  - Discord vous suggérera les commandes disponibles après avoir
                  tapé "/"
                </li>
                <li>
                  <span className="font-medium text-white">Arguments</span> -
                  Certaines commandes nécessitent des informations
                  supplémentaires comme un nom d'utilisateur ou une région
                </li>
              </ul>
            </div>

            <div className="bg-[#363a49] p-5 rounded-lg">
              <h3 className="font-semibold text-lg text-white mb-3">
                Permissions et utilisation
              </h3>
              <ul className="space-y-3">
                <li>
                  <span className="font-medium text-white">Permissions</span> -
                  Assurez-vous que le bot a les permissions appropriées dans vos
                  canaux
                </li>
                <li>
                  <span className="font-medium text-white">Disponibilité</span>{" "}
                  - Le bot sera en ligne 24/7, mais des périodes de maintenance
                  peuvent avoir lieu
                </li>
                <li>
                  <span className="font-medium text-white">Limites</span> - Pour
                  éviter le spam, certaines commandes peuvent avoir un temps de
                  recharge
                </li>
              </ul>
            </div>

            <div className="bg-[#363a49] p-5 rounded-lg">
              <h3 className="font-semibold text-lg text-white mb-3">
                Aide et documentation
              </h3>
              <ul className="space-y-3">
                <li>
                  <span className="font-medium text-white">
                    Liste des commandes
                  </span>{" "}
                  - Consultez notre{" "}
                  <a
                    href="/documentation"
                    className="text-blue-400 hover:text-blue-300 underline transition-colors"
                  >
                    page de documentation
                  </a>{" "}
                  pour la liste complète des commandes
                </li>
                <li>
                  <span className="font-medium text-white">Aide intégrée</span>{" "}
                  - Utilisez la commande "/help" dans Discord pour obtenir de
                  l'aide directement dans votre serveur
                </li>
                <li>
                  <span className="font-medium text-white">Support</span> - Pour
                  toute question ou problème, rejoignez notre{" "}
                  <a
                    href="#"
                    className="text-blue-400 hover:text-blue-300 underline transition-colors"
                  >
                    serveur Discord de support
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <span className="text-white text-2xl font-medium">3. Sponsors</span>
        </div>
      </div>

      <div className="mb-12">
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
