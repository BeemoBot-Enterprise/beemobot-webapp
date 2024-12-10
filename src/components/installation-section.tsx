import { Button } from "./ui/button";

const InstallationSection = () => {
  return (
    <section className="bg-[#2a2e3b] rounded-xl overflow-hidden shadow-lg">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/2 p-8">
          <div className="mb-6">
            <span className="text-gray-400 text-sm font-medium">
              1. Installation
            </span>
          </div>

          <h2 className="text-3xl font-bold mb-4">
            Créé ton propre
            <br />
            bot Discord
          </h2>

          <p className="text-gray-300 mb-6">
            Créer et personnaliser ton bot discord Teemo le personnage, Teemo
            n'est pas si démon qu'on le pense, tout est dans sa tasse sur les
            plaines.
          </p>

          <Button className="bg-blue-600 hover:bg-blue-700">
            Ajouter le bot
          </Button>

          <div className="mt-8 text-gray-400 text-sm">teemobot</div>
        </div>

        <div className="md:w-1/2 flex items-center justify-center bg-[#232631] p-8">
          <img
            src="/src/assets/images/teemo-character.png"
            alt="Teemo Character"
            className="w-40 h-40"
          />
        </div>
      </div>
    </section>
  );
};

export default InstallationSection;
