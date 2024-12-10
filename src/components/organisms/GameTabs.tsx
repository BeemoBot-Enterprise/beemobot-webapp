import React, { useState } from "react";
import TeemoMinesweeper from "./TeemoMinesweeper";
// import TeemoDash from './teemo-dash';

const GameTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState("minesweeper");

  const tabs = [
    {
      id: "minesweeper",
      title: "Démineur Beemo",
      icon: "🍄",
      description: "Find all the mushrooms without stepping on them!",
    },
  ];

  return (
    <div className="p-4">
      <div className="flex justify-center mb-6">
        <div className="flex gap-2 bg-gray-800/60 p-1 rounded-xl backdrop-blur-sm">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`px-6 py-3 rounded-lg flex items-center gap-2 transition-all duration-300 ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                  : "text-gray-300 hover:bg-gray-700/50"
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="text-xl">{tab.icon}</span>
              <span className="font-medium">{tab.title}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="p-4">
        {activeTab === "minesweeper" && <TeemoMinesweeper />}

        {/* {activeTab === 'dash' && (
          <TeemoDash />
        )} */}

        {/* {activeTab === 'breakout' && (
          <TeemoBreakout />
        )} */}

        {activeTab === "coming-soon" && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="text-center max-w-2xl">
              <h2 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                Plus de jeux à venir
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Nous travaillons sur de nouveaux mini-jeux avec Teemo. Revenez
                bientôt pour découvrir de nouvelles façons de vous amuser!
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                <div className="glassmorphism-dark rounded-xl p-6 border border-purple-500/20 transform transition-transform hover:scale-105">
                  <div className="text-yellow-400 text-2xl mb-3">⚔️</div>
                  <h3 className="text-xl font-bold mb-2">Combat de Teemo</h3>
                  <p className="text-gray-400">
                    Affrontez d'autres champions dans ce jeu de combat arcade.
                  </p>
                </div>

                <div className="glassmorphism-dark rounded-xl p-6 border border-blue-500/20 transform transition-transform hover:scale-105">
                  <div className="text-blue-400 text-2xl mb-3">🛡️</div>
                  <h3 className="text-xl font-bold mb-2">
                    Défense de Champignons
                  </h3>
                  <p className="text-gray-400">
                    Défendez votre territoire en plaçant stratégiquement des
                    champignons toxiques.
                  </p>
                </div>

                <div className="glassmorphism-dark rounded-xl p-6 border border-green-500/20 transform transition-transform hover:scale-105">
                  <div className="text-green-400 text-2xl mb-3">❓</div>
                  <h3 className="text-xl font-bold mb-2">Quiz League</h3>
                  <p className="text-gray-400">
                    Testez vos connaissances sur League of Legends avec ce quiz
                    interactif.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .glassmorphism-dark {
          background: rgba(25, 28, 40, 0.7);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
        }
      `}</style>
    </div>
  );
};

export default GameTabs;
