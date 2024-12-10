import teemoImage from "../assets/teemo-character.png";
import { Button } from "./ui/button";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      <div className="container mx-auto px-6 py-12 md:py-24 relative z-10">
        <div className="flex flex-col md:flex-row items-start justify-between">
          <div className="md:w-3/5 lg:w-3/5 bg-[#2d313e]/40 backdrop-filter backdrop-blur-xl rounded-xl p-10 border border-blue-500/20 shadow-lg">
            <h1 className="text-6xl md:text-7xl font-bold mb-8 leading-tight drop-shadow-md">
              Le meilleur bot
              <br />
              discord Teemo
              <br />
              tout-en-un
            </h1>
            <p className="text-gray-200 mb-12 max-w-xl text-xl">
              Beemo bot est un bot discord complet, mettant en relation notre
              savoir faire et ton niveau catastrophique pour que tu puisses
              passer gold
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2 px-8 py-4 rounded-md text-lg shadow-lg transition-all duration-300 hover:scale-105">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-6"
                >
                  <path d="M19.27 5.33C17.94 4.71 16.5 4.26 15 4a.09.09 0 0 0-.07.03c-.18.33-.39.76-.53 1.09a16.09 16.09 0 0 0-4.8 0c-.14-.34-.35-.76-.54-1.09-.01-.02-.04-.03-.07-.03-1.5.26-2.93.71-4.27 1.33-.01 0-.02.01-.03.02-2.72 4.07-3.47 8.03-3.1 11.95 0 .02.01.04.03.05 1.8 1.32 3.53 2.12 5.24 2.65.03.01.06 0 .07-.02.4-.55.76-1.13 1.07-1.74.02-.04 0-.08-.04-.09-.57-.22-1.11-.48-1.64-.78-.04-.02-.04-.08-.01-.11.11-.08.22-.17.33-.25.02-.02.05-.02.07-.01 3.44 1.57 7.15 1.57 10.55 0 .02-.01.05-.01.07.01.11.09.22.17.33.26.04.03.04.09-.01.11-.52.31-1.07.56-1.64.78-.04.01-.05.06-.04.09.32.61.68 1.19 1.07 1.74.03.02.06.02.09.01 1.72-.53 3.45-1.33 5.25-2.65.02-.01.03-.03.03-.05.44-4.53-.73-8.46-3.1-11.95-.01-.01-.02-.02-.04-.02z" />
                </svg>
                Ajouter le bot
              </Button>
              <Button
                variant="outline"
                className="border-gray-500/20 bg-[#2d313e]/30 backdrop-filter backdrop-blur-xl hover:bg-[#353a4a]/40 px-8 py-4 rounded-md text-lg shadow-md transition-all duration-300 hover:scale-105"
              >
                Documentation
              </Button>
            </div>
          </div>

          <div className="md:w-2/5 mt-12 md:mt-0 flex justify-center">
            <img
              src={teemoImage.src}
              alt="Teemo Character"
              className="w-full max-w-md"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
