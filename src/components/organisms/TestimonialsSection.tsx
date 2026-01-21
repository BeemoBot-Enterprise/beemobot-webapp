"use client";

import React, { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import { TestimonialCard } from "@/components/molecules/TestimonialCard";
import { cn } from "@/lib/utils";

const testimonials = [
  {
    quote:
      "BeemoBot has completely transformed our server. The champion stats feature is incredibly detailed and the minigames keep everyone engaged!",
    author: "ShadowMaster",
    role: "Server Owner",
    serverName: "LoL Legends",
  },
  {
    quote:
      "The build recommendations are always on point. My team's win rate has improved since we started using BeemoBot for our clash practices.",
    author: "NightFury",
    role: "Clash Captain",
    serverName: "Diamond Warriors",
  },
  {
    quote:
      "Love the player tracking feature! I can finally keep tabs on my ranked progress and compare with friends. The UI is beautiful too.",
    author: "StarGazer",
    role: "Community Manager",
    serverName: "Summoner's Hub",
  },
  {
    quote:
      "The trivia game is a hit in our server. We run weekly tournaments and BeemoBot handles everything perfectly. Highly recommend!",
    author: "CrimsonBlade",
    role: "Event Organizer",
    serverName: "Rift Academy",
  },
  {
    quote:
      "Finally a bot that actually understands League players. The meme commands and Teemo references are chef's kiss!",
    author: "MoonLighter",
    role: "Moderator",
    serverName: "Teemo Mains",
  },
  {
    quote:
      "99.9% uptime is no joke. BeemoBot has never let us down, even during peak hours. Best LoL bot we've ever used.",
    author: "ThunderStrike",
    role: "Admin",
    serverName: "Pro Gaming",
  },
];

export function TestimonialsSection() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    skipSnaps: false,
  });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  // Auto-scroll
  useEffect(() => {
    if (!emblaApi) return;
    const interval = setInterval(() => {
      emblaApi.scrollNext();
    }, 5000);
    return () => clearInterval(interval);
  }, [emblaApi]);

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 honeycomb-bg opacity-20" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1 rounded-full glass-hextech text-sm text-[var(--hextech-blue)] mb-4">
            Testimonials
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Loved by{" "}
            <span className="gradient-text-hextech">Summoners</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            See what server owners and players are saying about BeemoBot
          </p>
        </motion.div>

        {/* Carousel */}
        <div className="relative">
          {/* Navigation buttons */}
          <button
            onClick={scrollPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-[var(--hextech-blue)]/20 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <button
            onClick={scrollNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-[var(--hextech-blue)]/20 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>

          {/* Carousel viewport */}
          <div className="overflow-hidden mx-12" ref={emblaRef}>
            <div className="flex gap-6">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="flex-[0_0_auto]">
                  <TestimonialCard
                    quote={testimonial.quote}
                    author={testimonial.author}
                    role={testimonial.role}
                    serverName={testimonial.serverName}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Dots indicator */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => emblaApi?.scrollTo(index)}
                className={cn(
                  "w-2 h-2 rounded-full transition-all duration-300",
                  index === selectedIndex
                    ? "w-8 bg-[var(--hextech-blue)]"
                    : "bg-muted hover:bg-muted-foreground"
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
