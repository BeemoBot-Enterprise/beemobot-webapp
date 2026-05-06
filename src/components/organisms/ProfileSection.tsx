import { LOGO } from "@/assets/images";
import { Card } from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Image from "next/image";

const ProfileSection = () => {
  return (
    <Card className="overflow-hidden">
      <div className="px-6 py-4 border-b border-border flex items-center gap-2">
        <h2 className="text-base font-semibold text-text">
          Données personnelles
        </h2>
        <Badge variant="accent">Beta</Badge>
      </div>

      <div className="p-6 space-y-3">
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="text-text-muted">ID</div>
          <div className="col-span-2 text-text">@lolpip</div>
        </div>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="text-text-muted">Email</div>
          <div className="col-span-2 text-text">lol@teamotroll.com</div>
        </div>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="text-text-muted">Mot de passe</div>
          <div className="col-span-2 text-text">••••••••••</div>
        </div>
      </div>

      <div className="p-6 border-t border-border flex items-center gap-3">
        <Image
          height={40}
          width={40}
          src={LOGO.discord}
          alt="Discord"
          className="h-10 w-10"
        />
        <div>
          <div className="text-sm font-medium text-text">Discord</div>
          <p className="text-xs text-text-muted">Version 9.29.0</p>
        </div>
      </div>
    </Card>
  );
};

export default ProfileSection;
