"use client";

import GameTabs from "@/components/organisms/GameTabs";

export default function Game() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl"></div>
      <div className="absolute top-1/3 -left-32 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-blue-400 to-purple-500">
            Mini-Jeux Beemo
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Relevez le défi avec nos mini-jeux à thème League of Legends et
            prouvez vos compétences !
          </p>
        </div>

        <div className="glassmorphism rounded-2xl overflow-hidden shadow-xl mb-12 border border-white/10">
          <GameTabs />
        </div>
      </div>

      <style jsx>{`
        .glassmorphism {
          background: rgba(30, 33, 48, 0.6);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }
      `}</style>
    </div>
  );
}
