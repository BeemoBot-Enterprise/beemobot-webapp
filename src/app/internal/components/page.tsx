/**
 * Copyright (c) 2024-2026 BeemoBot Enterprise
 * All rights reserved.
 *
 * Internal demo page for the Honey Friendly design system (Phase 1).
 * Each section validates one component visually. Not linked from main nav.
 */
import { Button } from "@/components/_design/Button";
import { RiDiscordFill, RiArrowRightLine } from "@remixicon/react";

export default function ComponentsDemoPage() {
  return (
    <main className="min-h-screen bg-hf-bg font-body text-hf-navy">
      <div className="mx-auto max-w-[1100px] px-6 py-16">
        <header className="mb-16">
          <p className="font-display text-hf-eyebrow uppercase tracking-[0.15em] text-hf-honey mb-2">
            Honey Friendly · Phase 1
          </p>
          <h1 className="font-display text-hf-display-1 text-hf-navy">
            Design system demo
          </h1>
          <p className="mt-4 text-hf-body-lg text-hf-navy-soft max-w-2xl">
            Page interne de validation visuelle. Chaque section ci-dessous montre un composant
            atomique du nouveau design system, dans toutes ses variantes.
          </p>
        </header>

        <Section id="tokens" title="1 · Tokens (palette + typo)">
          <TokensPreview />
        </Section>

        <Section id="button" title="2 · Button">
          <div className="space-y-6">
            <div className="flex flex-wrap gap-3">
              <Button variant="primary"><RiDiscordFill className="size-5" />Ajouter à Discord</Button>
              <Button variant="outline">Voir la démo<RiArrowRightLine className="size-4" /></Button>
              <Button variant="ghost">Annuler</Button>
              <Button variant="danger">Supprimer</Button>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button variant="primary" disabled>Disabled primary</Button>
              <Button variant="outline" disabled>Disabled outline</Button>
            </div>
          </div>
        </Section>

        {/* Sections 2-12 added incrementally as components are built */}
      </div>
    </main>
  );
}

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mb-16 border-t border-hf-line pt-10">
      <h2 className="font-display text-hf-display-3 mb-6">{title}</h2>
      {children}
    </section>
  );
}

function TokensPreview() {
  const colors: Array<[string, string]> = [
    ["bg", "var(--hf-bg)"],
    ["surface", "var(--hf-surface)"],
    ["surface-alt", "var(--hf-surface-alt)"],
    ["navy", "var(--hf-navy)"],
    ["navy-soft", "var(--hf-navy-soft)"],
    ["line", "var(--hf-line)"],
    ["honey", "var(--hf-honey)"],
    ["honey-soft", "var(--hf-honey-soft)"],
    ["discord", "var(--hf-discord)"],
    ["win", "var(--hf-win)"],
    ["loss", "var(--hf-loss)"],
  ];
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {colors.map(([name, value]) => (
          <div key={name} className="rounded-hf-card border border-hf-line bg-hf-surface p-3">
            <div className="h-12 w-full rounded-md mb-2" style={{ background: value }} />
            <div className="text-hf-body-sm font-medium">{name}</div>
            <div className="text-hf-body-sm text-hf-navy-soft font-mono">{value}</div>
          </div>
        ))}
      </div>
      <div className="rounded-hf-card-lg border border-hf-line bg-hf-surface p-6 space-y-4">
        <div className="font-display text-hf-display-1">Display 1 — Bricolage</div>
        <div className="font-display text-hf-display-2">Display 2 — Bricolage</div>
        <div className="font-display text-hf-display-3">Display 3 — Bricolage</div>
        <div className="text-hf-body-lg">Body lg — Onest 17px</div>
        <div className="text-hf-body">Body — Onest 15px</div>
        <div className="text-hf-body-sm text-hf-navy-soft">Body sm — Onest 13px</div>
        <div className="text-hf-eyebrow uppercase text-hf-honey">Eyebrow — Onest 11px</div>
      </div>
    </div>
  );
}
