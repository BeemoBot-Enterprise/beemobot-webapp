/**
 * Copyright (c) 2024-2026 BeemoBot Enterprise
 * All rights reserved.
 */

"use client";

import * as React from "react";
import Link from "next/link";
import {
  FaUser,
  FaLock,
  FaEnvelope,
  FaEye,
  FaEyeSlash,
  FaDiscord,
} from "react-icons/fa";
import type { IconType } from "react-icons";
import Button from "@/components/atoms/Button";
import Label from "@/components/atoms/Label";
import AuthCard from "@/components/molecules/AuthCard";
import { useAuth } from "@/hooks/useAuth";

const InputField = ({
  icon: Icon,
  rightSlot,
  ...props
}: {
  icon: IconType;
  rightSlot?: React.ReactNode;
} & React.InputHTMLAttributes<HTMLInputElement>) => (
  <div className="group flex h-11 items-center gap-2 rounded-md border border-border bg-bg px-3 transition-colors focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/30">
    <Icon className="h-4 w-4 shrink-0 text-text-muted" />
    <input
      className="flex-1 bg-transparent text-sm text-text placeholder:text-text-muted/70 focus:outline-none"
      {...props}
    />
    {rightSlot}
  </div>
);

export default function LoginPage() {
  const [showPassword, setShowPassword] = React.useState(false);
  const [keepLoggedIn, setKeepLoggedIn] = React.useState(true);
  const { login } = useAuth();

  return (
    <main className="min-h-[calc(100vh-64px)] flex items-center justify-center px-6 py-12 bg-bg">
      <AuthCard
        icon={FaUser}
        title="Connecte-toi à ton compte"
        subtitle="Entre tes identifiants pour continuer."
      >
        <form
          className="flex flex-col gap-3"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email">
              Adresse email <span className="text-danger">*</span>
            </Label>
            <InputField
              id="email"
              type="email"
              icon={FaEnvelope}
              placeholder="hello@beemobot.fr"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="password">
              Mot de passe <span className="text-danger">*</span>
            </Label>
            <InputField
              id="password"
              type={showPassword ? "text" : "password"}
              icon={FaLock}
              placeholder="••••••••••"
              required
              rightSlot={
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={
                    showPassword
                      ? "Masquer le mot de passe"
                      : "Afficher le mot de passe"
                  }
                  className="text-text-muted hover:text-text transition-colors"
                >
                  {showPassword ? (
                    <FaEyeSlash className="h-4 w-4" />
                  ) : (
                    <FaEye className="h-4 w-4" />
                  )}
                </button>
              }
            />
          </div>

          <div className="mt-1 flex items-center justify-between gap-4">
            <label className="flex cursor-pointer items-center gap-2 text-sm text-text-muted hover:text-text transition-colors">
              <input
                type="checkbox"
                checked={keepLoggedIn}
                onChange={(e) => setKeepLoggedIn(e.target.checked)}
                className="size-4 rounded border-border bg-bg accent-accent"
              />
              Rester connecté
            </label>
            <Link
              href="/auth/forgot"
              className="text-sm text-text-muted underline-offset-4 hover:text-text hover:underline transition-colors"
            >
              Mot de passe oublié ?
            </Link>
          </div>

          <Button type="submit" variant="primary" size="lg" className="mt-3">
            Se connecter
          </Button>
        </form>

        <div className="flex items-center gap-3 text-xs text-text-muted">
          <span className="h-px flex-1 bg-border" />
          ou
          <span className="h-px flex-1 bg-border" />
        </div>

        <button
          type="button"
          onClick={login}
          className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-border bg-bg px-4 py-2.5 text-sm font-medium text-text hover:bg-surface-hover transition-colors"
        >
          <FaDiscord className="h-4 w-4 text-[#5865F2]" />
          Continuer avec Discord
        </button>

        <p className="text-center text-sm text-text-muted">
          Pas encore de compte ?{" "}
          <Link
            href="/auth/register"
            className="text-accent hover:text-accent-hover transition-colors"
          >
            Créer un compte
          </Link>
        </p>
      </AuthCard>
    </main>
  );
}
