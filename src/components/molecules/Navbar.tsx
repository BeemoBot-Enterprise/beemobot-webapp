"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

export interface NavItem {
  label: string;
  href: string;
}

export interface NavbarProps {
  items: NavItem[];
  onMobileNavigate?: () => void;
}

const Navbar = ({ items, onMobileNavigate }: NavbarProps) => {
  const pathname = usePathname();
  return (
    <ul className="flex flex-col md:flex-row md:items-center gap-1 md:gap-2">
      {items.map((item) => {
        const active = pathname === item.href;
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              onClick={onMobileNavigate}
              className={twMerge(
                "block px-3 py-2 text-sm rounded-md transition-colors",
                active
                  ? "text-text"
                  : "text-text-muted hover:text-text hover:bg-surface",
              )}
            >
              {item.label}
              {active && (
                <span className="hidden md:block h-0.5 bg-accent mt-1.5 -mx-3" />
              )}
            </Link>
          </li>
        );
      })}
    </ul>
  );
};

export default Navbar;
