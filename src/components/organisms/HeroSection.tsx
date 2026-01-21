"use client";

import { BEEMO } from "@/assets/images";
import Button from "@/components/atoms/Button";
import Image from "next/image";
import { FaDiscord } from "react-icons/fa";

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
              <Button
                className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2 px-8 py-4 rounded-md text-lg shadow-lg transition-all duration-300 hover:scale-105"
                onClick={() =>
                  window.open(
                    process.env.NEXT_PUBLIC_BOT_INVITE_URL ||
                      process.env.BOT_INVITE_URL,
                    "_blank",
                  )
                }
              >
                <FaDiscord className="w-6 h-6" />
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
            <Image
              src={BEEMO.character}
              alt="Teemo Character"
              width={400}
              height={400}
              className="w-full max-w-md"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
