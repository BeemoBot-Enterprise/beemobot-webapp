/**
 * Copyright (c) 2024-2026 BeemoBot Enterprise
 * All rights reserved.
 */

"use client";

import * as React from "react";
import { FaEnvelopeOpen } from "react-icons/fa";
import Button from "@/components/atoms/Button";
import AuthCard from "@/components/molecules/AuthCard";
import OtpInput from "@/components/molecules/OtpInput";

const TARGET_EMAIL = "hello@beemobot.fr";

export default function OtpPage() {
  const [code, setCode] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [resentAt, setResentAt] = React.useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 4) return;
    setSubmitting(true);
    setTimeout(() => setSubmitting(false), 800);
  };

  const handleResend = () => {
    setCode("");
    setResentAt(Date.now());
  };

  return (
    <main className="min-h-[calc(100vh-64px)] flex items-center justify-center px-6 py-12 bg-bg">
      <AuthCard
        icon={FaEnvelopeOpen}
        title="Code de vérification"
        subtitle={
          <>
            On t'a envoyé un code à{" "}
            <span className="font-medium text-text">{TARGET_EMAIL}</span>
          </>
        }
      >
        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          <OtpInput
            numInputs={4}
            value={code}
            onChange={setCode}
            onComplete={() => {}}
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={code.length !== 4 || submitting}
          >
            {submitting ? "Vérification…" : "Valider le code"}
          </Button>
        </form>

        <div className="flex flex-col items-center gap-1 text-center text-sm text-text-muted">
          {resentAt ? (
            <span className="text-text">
              Nouveau code envoyé. Vérifie tes spams.
            </span>
          ) : (
            <>
              <span>Tu n'as pas reçu le code ?</span>
              <button
                type="button"
                onClick={handleResend}
                className="text-text underline-offset-4 hover:underline transition-colors"
              >
                Renvoyer un code
              </button>
            </>
          )}
        </div>
      </AuthCard>
    </main>
  );
}
