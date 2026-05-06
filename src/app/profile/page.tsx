"use client";

import { Suspense } from "react";
import ProfileContent from "./ProfileContent";

export default function ProfilePage() {
  return (
    <Suspense
      fallback={
        <main className="max-w-[1200px] mx-auto px-6 py-12">
          <p className="text-text-muted">Chargement…</p>
        </main>
      }
    >
      <ProfileContent />
    </Suspense>
  );
}
