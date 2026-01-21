"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { setToken } from "@/lib/store/token";

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [message, setMessage] = useState("Authentification en cours...");

  useEffect(() => {
    const token = searchParams.get("token");
    const error = searchParams.get("error");

    if (error) {
      setStatus("error");
      setMessage(getErrorMessage(error));
      setTimeout(() => router.push("/"), 3000);
      return;
    }

    if (token) {
      // Sauvegarder le token dans localStorage
      setToken(token);
      setStatus("success");
      setMessage("Connexion réussie ! Redirection...");

      // Rediriger vers la page de profil
      setTimeout(() => router.push("/profil"), 1500);
    } else {
      setStatus("error");
      setMessage("Token manquant");
      setTimeout(() => router.push("/"), 3000);
    }
  }, [searchParams, router]);

  const getErrorMessage = (error: string): string => {
    switch (error) {
      case "access_denied":
        return "Vous avez refusé l'autorisation Discord";
      case "state_mismatch":
        return "Erreur de sécurité OAuth";
      case "authentication_error":
        return "Erreur d'authentification";
      case "server_error":
        return "Erreur serveur";
      default:
        return "Une erreur est survenue";
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0a0e1a] via-[#1a1f2e] to-[#0a0e1a] flex items-center justify-center px-4">
      <div className="text-center">
        {status === "loading" && (
          <>
            <div className="w-20 h-20 mx-auto mb-6 border-4 border-[#00A0FF] border-t-transparent rounded-full animate-spin" />
            <h1 className="text-3xl font-bold text-white mb-4">{message}</h1>
          </>
        )}

        {status === "success" && (
          <>
            <div className="w-20 h-20 mx-auto mb-6 bg-green-500 rounded-full flex items-center justify-center">
              <svg
                className="w-12 h-12 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-green-400 mb-4">
              {message}
            </h1>
          </>
        )}

        {status === "error" && (
          <>
            <div className="w-20 h-20 mx-auto mb-6 bg-red-500 rounded-full flex items-center justify-center">
              <svg
                className="w-12 h-12 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-red-400 mb-4">{message}</h1>
            <p className="text-gray-400">Redirection vers l'accueil...</p>
          </>
        )}
      </div>
    </main>
  );
}
