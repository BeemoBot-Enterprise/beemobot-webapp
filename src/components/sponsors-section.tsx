const SponsorsSection = () => {
  return (
    <section className="bg-[#2a2e3b] rounded-xl overflow-hidden shadow-lg p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6">3. Sponsors</h2>
        <div className="mb-4">
          <span className="text-gray-400 text-sm font-medium">
            1. Installation
          </span>
        </div>
        <div className="mb-4">
          <span className="text-gray-400 text-sm font-medium">
            2. Installation
          </span>
        </div>
        <div className="mb-4">
          <span className="text-white text-sm font-medium">3. Sponsors</span>
        </div>
      </div>

      <div className="mb-12">
        <div className="flex flex-wrap items-center gap-8">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="/src/assets/github-logo.png"
              alt="GitHub"
              className="h-10"
            />
          </a>
          <a href="https://op.gg" target="_blank" rel="noopener noreferrer">
            <img
              src="/src/assets/opgg-logo.png"
              alt="OP.GG"
              className="h-8"
            />
          </a>
          <a
            href="https://riotgames.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="/src/assets/riot-games-logo.png"
              alt="Riot Games"
              className="h-8"
            />
          </a>
        </div>
      </div>
    </section>
  );
};

export default SponsorsSection;
