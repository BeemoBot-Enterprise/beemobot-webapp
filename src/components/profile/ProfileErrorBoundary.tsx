/**
 * Copyright (c) 2024-2026 BeemoBot Enterprise
 * All rights reserved.
 */

"use client";

import * as React from "react";
import { Card } from "@/components/_design/Card";
import { Button } from "@/components/_design/Button";

interface State {
  error: Error | null;
}

interface Props {
  children: React.ReactNode;
}

/**
 * Empêche un crash de la sous-arborescence ProfileView de descendre tout le
 * site (sinon Next renvoie "Application error: a client-side exception"
 * sans aucun détail utile). Affiche un message lisible + bouton recharger,
 * et logge l'erreur côté console pour debug.
 */
export class ProfileErrorBoundary extends React.Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("ProfileView crashed:", error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <main className="max-w-[600px] mx-auto px-6 py-16">
          <Card variant="accent" className="text-center">
            <h1 className="font-display text-hf-display-3 text-hf-navy mb-2">
              Affichage du profil indisponible
            </h1>
            <p className="text-hf-body text-hf-navy-soft mb-4">
              Une erreur s&apos;est produite côté affichage. Réessaie dans
              quelques instants. Si ça persiste, recharge la page.
            </p>
            <p className="text-hf-body-sm text-hf-navy-soft mb-6 font-mono break-all">
              {this.state.error.message}
            </p>
            <Button
              variant="primary"
              onClick={() => {
                if (typeof window !== "undefined") window.location.reload();
              }}
            >
              Recharger la page
            </Button>
          </Card>
        </main>
      );
    }
    return this.props.children;
  }
}
