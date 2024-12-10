import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

const ProfileSection = () => {
  return (
    <Card className="bg-[#2a2e3b] border-0 shadow-lg overflow-hidden">
      <CardHeader className="bg-[#232631] text-gray-400 px-6 py-4">
        <CardTitle className="text-xl">
          Données personnelles{" "}
          <span className="text-xs bg-purple-700 px-2 py-1 rounded-full ml-2">
            Beta
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-gray-400">ID?</div>
            <div className="col-span-2 font-medium">@lolpip</div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="text-gray-400">Email</div>
            <div className="col-span-2 font-medium">lol@teamotroll.com</div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="text-gray-400">Password</div>
            <div className="col-span-2 font-medium">••••••••••</div>
          </div>
        </div>
      </CardContent>

      <div className="p-6 border-t border-[#3a3f4b]">
        <div className="flex items-center">
          <div className="mr-4">
            <img
              src="/src/assets/images/discord-logo.png"
              alt="Discord Logo"
              className="w-10 h-10"
            />
          </div>
          <div>
            <h3 className="text-purple-400 text-lg font-medium">Discord</h3>
            <p className="text-sm text-gray-400">Version 9.29.0</p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ProfileSection;
