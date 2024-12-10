import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

const DashboardSection = () => {
  return (
    <Card className="bg-[#2a2e3b] border-0 shadow-lg overflow-hidden">
      <CardHeader className="bg-[#232631] text-gray-400 px-6 py-4">
        <CardTitle className="text-xl">Tableau de bord</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          <div>
            <div className="text-gray-400 mb-2">% RAM</div>
            <div className="w-full bg-gray-700 rounded-full h-2.5">
              <div className="bg-red-600 h-2.5 rounded-full w-3/4"></div>
            </div>
          </div>

          <div>
            <div className="text-gray-400 mb-2">CS</div>
            <div className="w-full bg-gray-700 rounded-full h-2.5">
              <div className="bg-red-600 h-2.5 rounded-full w-1/2"></div>
            </div>
          </div>
        </div>
      </CardContent>

      <div className="p-6 border-t border-[#3a3f4b]">
        <div className="flex items-center">
          <div className="mr-4">
            <img
              src="/src/assets/images/riot-games-logo.png"
              alt="Riot Games Logo"
              className="w-10 h-10"
            />
          </div>
          <div>
            <h3 className="text-red-500 text-lg font-medium">Infos Lolapi</h3>
            <p className="text-sm text-gray-400">Version 12.6.425.5123</p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default DashboardSection;
