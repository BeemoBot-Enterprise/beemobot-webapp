"use client";

import ProfileSection from "@/components/organisms/ProfileSection";

export default function Profile() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Profil</h1>
      <div className="max-w-4xl mx-auto">
        <ProfileSection />
      </div>
    </div>
  );
}
