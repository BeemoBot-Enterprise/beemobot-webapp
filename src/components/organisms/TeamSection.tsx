/**
 * Copyright (c) 2024-2026 BeemoBot Enterprise
 * All rights reserved.
 */

"use client";

import { useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import {
  FaArrowLeft,
  FaArrowRight,
  FaGithub,
  FaInstagram,
  FaTwitter,
} from "react-icons/fa";
import Eyebrow from "@/components/atoms/Eyebrow";

type Member = {
  id: string;
  name: string;
  role: string;
  initials: string;
  gradient: string;
  socials: {
    instagram?: string;
    github?: string;
    twitter?: string;
  };
};

const teamData: Member[] = [
  {
    id: "member1",
    name: "Jérémy Dura",
    role: "Lead Backend · API",
    initials: "JD",
    gradient: "from-blue-500 to-indigo-700",
    socials: { instagram: "#", github: "#", twitter: "#" },
  },
  {
    id: "member2",
    name: "Alex Martin",
    role: "Discord Bot · Python",
    initials: "AM",
    gradient: "from-amber-500 to-rose-600",
    socials: { instagram: "#", github: "#", twitter: "#" },
  },
  {
    id: "member3",
    name: "Lina Chen",
    role: "Frontend · Next.js",
    initials: "LC",
    gradient: "from-emerald-400 to-teal-700",
    socials: { instagram: "#", github: "#", twitter: "#" },
  },
  {
    id: "member4",
    name: "Tom Rivera",
    role: "UI/UX Designer",
    initials: "TR",
    gradient: "from-fuchsia-500 to-purple-700",
    socials: { instagram: "#", github: "#", twitter: "#" },
  },
  {
    id: "member5",
    name: "Sara Bennett",
    role: "Riot API · Data",
    initials: "SB",
    gradient: "from-cyan-400 to-blue-700",
    socials: { instagram: "#", github: "#", twitter: "#" },
  },
  {
    id: "member6",
    name: "Daniel Kim",
    role: "DevOps · Infra",
    initials: "DK",
    gradient: "from-orange-500 to-red-700",
    socials: { instagram: "#", github: "#", twitter: "#" },
  },
  {
    id: "member7",
    name: "Sophia Williams",
    role: "Community Manager",
    initials: "SW",
    gradient: "from-violet-500 to-pink-600",
    socials: { instagram: "#", github: "#", twitter: "#" },
  },
];

const DESKTOP_SLOTS = [
  { offset: -3, size: 48, radius: "rounded-xl" },
  { offset: -2, size: 112, radius: "rounded-2xl" },
  { offset: -1, size: 176, radius: "rounded-[24px]" },
  { offset: 0, size: 240, radius: "rounded-[28px]" },
  { offset: 1, size: 176, radius: "rounded-[24px]" },
  { offset: 2, size: 112, radius: "rounded-2xl" },
  { offset: 3, size: 48, radius: "rounded-xl" },
];

const MOBILE_SLOTS = [
  { offset: -3, size: 80, radius: "rounded-xl" },
  { offset: -2, size: 80, radius: "rounded-xl" },
  { offset: -1, size: 80, radius: "rounded-xl" },
  { offset: 0, size: 152, radius: "rounded-2xl" },
  { offset: 1, size: 80, radius: "rounded-xl" },
  { offset: 2, size: 80, radius: "rounded-xl" },
  { offset: 3, size: 80, radius: "rounded-xl" },
];

export const TeamSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const prevActiveIndexRef = useRef(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1023px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    prevActiveIndexRef.current = activeIndex;
  }, [activeIndex]);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + teamData.length) % teamData.length);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % teamData.length);
  };

  const activeMember = teamData[activeIndex];
  const SLOTS = isMobile ? MOBILE_SLOTS : DESKTOP_SLOTS;
  const activeSize = isMobile ? 152 : 240;
  const GAP = isMobile ? 12 : 20;

  return (
    <section className="border-b border-stroke-soft-200">
      <div className="max-w-[1200px] mx-auto px-6 py-20">
        <style>{`
          @keyframes team-fade-in {
            from { opacity: 0; transform: translateY(6px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>

        <div className="flex flex-col items-center gap-10">
          <div className="flex flex-col items-start lg:items-center text-left lg:text-center gap-4">
            <Eyebrow>
              Driven by passion
            </Eyebrow>
            <h2 className="text-title-h4 md:text-title-h3 text-text-strong-950 max-w-2xl !font-[600]">
              L'équipe derrière BeemoBot
            </h2>
            <p className="text-paragraph-md text-text-sub-600 max-w-xl">
              Étudiants Ynov, passionnés de League — on code la nuit pour
              mieux vous shroomer le jour.
            </p>
          </div>

          <div className="flex w-full items-center gap-2 lg:w-auto">
            <button
              onClick={handlePrev}
              aria-label="Précédent"
              className="group flex flex-1 cursor-pointer items-center justify-center rounded-full border border-stroke-soft-200 bg-bg-weak-50 px-5 py-2 transition-colors hover:bg-bg-soft-200 lg:flex-none"
            >
              <FaArrowLeft className="h-4 w-4 text-text-soft-400 transition-colors group-hover:text-text-strong-950" />
            </button>
            <button
              onClick={handleNext}
              aria-label="Suivant"
              className="group flex flex-1 cursor-pointer items-center justify-center rounded-full border border-stroke-soft-200 bg-bg-weak-50 px-5 py-2 transition-colors hover:bg-bg-soft-200 lg:flex-none"
            >
              <FaArrowRight className="h-4 w-4 text-text-soft-400 transition-colors group-hover:text-text-strong-950" />
            </button>
          </div>

          <div
            className="relative w-full overflow-hidden"
            style={{ height: activeSize }}
          >
            {teamData.map((member, idx) => {
              const total = teamData.length;
              let offset = idx - activeIndex;
              if (offset > total / 2) offset -= total;
              if (offset < -total / 2) offset += total;

              let prevOffset = idx - prevActiveIndexRef.current;
              if (prevOffset > total / 2) prevOffset -= total;
              if (prevOffset < -total / 2) prevOffset += total;
              const isWrapping = Math.abs(offset - prevOffset) > 1;

              const slot = SLOTS.find((s) => s.offset === offset);
              const isVisible = Math.abs(offset) <= 3;
              const isActive = offset === 0;

              const size = slot?.size ?? (isMobile ? 80 : 48);
              const radius =
                slot?.radius ?? (isMobile ? "rounded-xl" : "rounded-xl");
              const zIndex = isVisible ? 4 - Math.abs(offset) : 0;

              const centerSlotIdx = SLOTS.findIndex((s) => s.offset === 0);

              let xOffset = 0;
              if (offset !== 0) {
                const dir = offset > 0 ? 1 : -1;
                const absOff = Math.abs(offset);
                xOffset = SLOTS[centerSlotIdx].size / 2 + GAP;
                for (let i = 1; i < absOff; i++) {
                  const s = SLOTS.find((s) => s.offset === i);
                  xOffset += (s?.size ?? (isMobile ? 80 : 48)) + GAP;
                }
                xOffset += size / 2;
                xOffset *= dir;
              }

              return (
                <div
                  key={member.id}
                  className={twMerge(
                    radius,
                    "absolute top-1/2 left-1/2 shrink-0 overflow-hidden border border-stroke-soft-200",
                    !isWrapping && "transition-all duration-500 ease-in-out",
                    !isVisible && "pointer-events-none opacity-0",
                  )}
                  style={{
                    width: size,
                    height: size,
                    zIndex,
                    transform: `translate(calc(-50% + ${xOffset}px), -50%)`,
                  }}
                >
                  <div
                    className={twMerge(
                      "size-full bg-gradient-to-br flex items-center justify-center",
                      member.gradient,
                      !isWrapping && "transition-all duration-500 ease-in-out",
                      !isActive && "grayscale opacity-60",
                    )}
                  >
                    <span
                      className="font-semibold text-white/90 tracking-tight select-none"
                      style={{ fontSize: Math.max(24, size * 0.28) }}
                    >
                      {member.initials}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex flex-col items-center gap-5">
            <div
              key={activeMember.id}
              className="flex flex-col items-center gap-1 lg:gap-2"
              style={{ animation: "team-fade-in 0.4s ease-out" }}
            >
              <div className="text-title-h6 text-text-strong-950">
                {activeMember.name}
              </div>
              <div className="text-paragraph-sm text-text-sub-600">
                {activeMember.role}
              </div>
            </div>
            <div className="flex items-center gap-5">
              {activeMember.socials.instagram && (
                <a
                  href={activeMember.socials.instagram}
                  aria-label={`Instagram de ${activeMember.name}`}
                  className="group"
                >
                  <FaInstagram className="h-5 w-5 text-text-soft-400 transition-colors group-hover:text-[#E4405F]" />
                </a>
              )}
              {activeMember.socials.github && (
                <a
                  href={activeMember.socials.github}
                  aria-label={`GitHub de ${activeMember.name}`}
                  className="group"
                >
                  <FaGithub className="h-5 w-5 text-text-soft-400 transition-colors group-hover:text-text-strong-950" />
                </a>
              )}
              {activeMember.socials.twitter && (
                <a
                  href={activeMember.socials.twitter}
                  aria-label={`Twitter de ${activeMember.name}`}
                  className="group"
                >
                  <FaTwitter className="h-5 w-5 text-text-soft-400 transition-colors group-hover:text-text-strong-950" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
