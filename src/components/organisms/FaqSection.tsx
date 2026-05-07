/**
 * Copyright (c) 2024-2026 BeemoBot Enterprise
 * All rights reserved.
 */

"use client";

import * as React from "react";
import { RiCustomerServiceFill, RiCloseLine } from "@remixicon/react";
import * as Accordion from "@/components/ui/accordion";
import Eyebrow from "@/components/atoms/Eyebrow";
import * as Divider from "@/components/ui/divider";

type FaqItem = { id: string; question: string; answer: string };

type FaqSection = {
  title: string;
  description: string;
  items: FaqItem[];
  action?: { text: string; email: string };
};

const faqSections: FaqSection[] = [
  {
    title: "Compte",
    description: "Gère ton compte BeemoBot facilement.",
    items: [
      {
        id: "account-1",
        question: "Comment lier mon compte Riot ?",
        answer:
          "Connecte-toi via Discord, va dans /auth/link, entre ton Riot ID (GameName#Tag), choisis ta région, puis change ton icône d'invocateur pour celle qu'on te demande. C'est ça notre vérif anti-usurpation.",
      },
      {
        id: "account-2",
        question: "Puis-je changer le compte Riot lié ?",
        answer:
          "Oui, depuis ton profil — détache l'ancien compte, puis relance la procédure de vérification avec le nouveau Riot ID.",
      },
      {
        id: "account-3",
        question: "Que faire si j'ai perdu l'accès à Discord ?",
        answer:
          "Comme l'auth passe uniquement par Discord OAuth, tu dois d'abord récupérer ton compte Discord auprès de leur support. Une fois reconnecté, ton profil BeemoBot est intact.",
      },
    ],
  },
  {
    title: "Bot Discord",
    description: "Tout sur l'invitation et l'utilisation du bot.",
    items: [
      {
        id: "bot-1",
        question: "Comment inviter le bot sur mon serveur ?",
        answer:
          "Clique sur 'Ajouter à Discord' dans le header ou en bas de page. Tu auras besoin de la permission Gérer le serveur. Le setup prend moins de 2 minutes.",
      },
      {
        id: "bot-2",
        question: "Quelles sont les commandes disponibles ?",
        answer:
          "Les principales : /user, /shroom, /respect, /lastgame, /runes, /top_shrooms, /top_respects, /help_orion. Liste complète dans la documentation.",
      },
      {
        id: "bot-3",
        question: "Le bot ne répond plus, que faire ?",
        answer:
          "Vérifie d'abord son statut sur notre Discord communautaire. Si tout est vert côté infra, retire le bot puis re-invite-le — un re-sync des slash commands résout 90% des cas.",
      },
    ],
  },
  {
    title: "Support",
    description: "On est là pour t'aider, n'importe quand.",
    items: [
      {
        id: "support-1",
        question: "Comment contacter l'équipe ?",
        answer:
          "Le plus rapide : notre Discord communautaire (salon #support). Sinon par mail à hello@beemobot.fr.",
      },
      {
        id: "support-2",
        question: "Mes données sont-elles en sécurité ?",
        answer:
          "On stocke uniquement ton ID Discord, ton PUUID Riot et tes statistiques de jeu. Pas de mot de passe (on utilise OAuth), pas de revente, et tu peux demander la suppression complète à tout moment.\n\nLes communications avec l'API sont chiffrées en HTTPS, et les tokens sont rotatifs.",
      },
      {
        id: "support-3",
        question: "Le support est-il disponible le week-end ?",
        answer:
          "Oui — la communauté répond 7j/7 sur Discord. L'équipe core répond en jour ouvré dans la journée.",
      },
      {
        id: "support-4",
        question: "Où trouver de la documentation détaillée ?",
        answer:
          "Tout est sur /documentation : commandes, intégration Riot, leaderboards, et les API endpoints pour les développeurs qui veulent étendre le bot.",
      },
    ],
    action: {
      text: "Une autre question en tête ?",
      email: "hello@beemobot.fr",
    },
  },
];

export const FaqSection = () => (
  <section id="faq" className="border-b border-stroke-soft-200 w-full">
    <div className="max-w-[1200px] mx-auto px-6 pt-20 pb-10 lg:pb-0">
      <div className="max-w-[1016px] mx-auto flex flex-col gap-4">
        <Eyebrow>
          FAQ
        </Eyebrow>
        <h2 className="text-title-h4 md:text-title-h3 text-text-strong-950 !font-[600]">
          Réponses rapides aux questions fréquentes
        </h2>
        <p className="text-paragraph-md text-text-sub-600 max-w-2xl">
          Setup, intégrations Riot, données et support — tout ce qu'on
          nous demande le plus souvent.
        </p>
      </div>
    </div>

    <div className="max-w-[1200px] mx-auto px-6 lg:px-7">
      <div className="max-w-[1016px] mx-auto flex flex-col lg:gap-8 lg:py-12">
        {faqSections.map((section, sectionIndex) => {
          const isLast = sectionIndex === faqSections.length - 1;
          return (
            <React.Fragment key={section.title}>
              <Divider.Root className="hidden lg:flex" />
              <div
                className={`flex flex-col gap-6 pt-6 lg:flex-row lg:gap-16 lg:pt-0 lg:pb-0 ${
                  isLast ? "pb-10" : "border-b border-stroke-soft-200 pb-8 lg:border-0"
                }`}
              >
                <div className="flex flex-col gap-1 lg:w-[260px] lg:shrink-0">
                  <h3 className="text-label-md text-text-strong-950">
                    {section.title}
                  </h3>
                  <p className="text-paragraph-sm text-text-sub-600">
                    {section.description}
                  </p>
                </div>

                <div className="flex flex-1 flex-col gap-4 lg:gap-5">
                  <Accordion.Root
                    type="single"
                    collapsible
                    className="flex flex-col gap-4 lg:gap-5"
                  >
                    {section.items.map((item, index) => (
                      <React.Fragment key={item.id}>
                        {index === 0 ? (
                          <Divider.Root className="lg:hidden" />
                        ) : (
                          <Divider.Root />
                        )}
                        <Accordion.Item
                          value={item.id}
                          className="rounded-none bg-transparent p-0 ring-0 hover:bg-transparent has-[:focus-visible]:bg-transparent data-[state=open]:bg-transparent data-[state=open]:ring-transparent"
                        >
                          <Accordion.Trigger className="text-label-sm lg:text-label-md text-text-sub-600 group-data-[state=open]/accordion:text-text-strong-950 m-0 flex w-full items-center gap-4 p-0 text-left">
                            <span className="flex-1">{item.question}</span>
                            <Accordion.Arrow
                              closeIcon={RiCloseLine}
                              className="size-5 shrink-0 lg:size-6"
                            />
                          </Accordion.Trigger>
                          <Accordion.Content className="text-paragraph-xs lg:text-paragraph-sm pt-3 lg:pt-4">
                            {item.answer.split("\n\n").map((paragraph, i) => (
                              <p key={i} className={i > 0 ? "mt-3 lg:mt-4" : ""}>
                                {paragraph}
                              </p>
                            ))}
                          </Accordion.Content>
                        </Accordion.Item>
                      </React.Fragment>
                    ))}
                  </Accordion.Root>

                  {section.action && (
                    <>
                      <Divider.Root />
                      <div className="mt-2 flex items-start gap-3 rounded-xl border border-stroke-soft-200 bg-bg-weak-50 p-4 lg:items-center lg:gap-3">
                        <RiCustomerServiceFill className="text-primary-base size-5 shrink-0 mt-0.5 lg:mt-0" />
                        <div className="flex flex-1 flex-col gap-1 lg:flex-row lg:items-center lg:gap-2">
                          <span className="text-paragraph-sm text-text-sub-600 lg:flex-1">
                            {section.action.text}
                          </span>
                          <a
                            href={`mailto:${section.action.email}`}
                            className="text-label-sm text-text-strong-950 hover:text-primary-base transition-colors"
                          >
                            {section.action.email}
                          </a>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  </section>
);

export default FaqSection;
