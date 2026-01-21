"use client";

import { Suspense } from "react";
import ProfileContent from "./ProfileContent";

export default function ProfilePage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#0f1117] py-20 px-4">
          <div className="max-w-5xl mx-auto text-center">
            <div className="text-white text-2xl">Chargement...</div>
          </div>
        </main>
      }
    >
      <ProfileContent />
    </Suspense>
  );
}
