"use client";

import Link from "next/link";
import Image from "next/image";
import { LOGO } from "@/assets/images";

const Footer = () => {
  return (
    <footer className="relative bg-[#050508] border-t border-white/5 pt-20 pb-10 overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50 blur-[2px]" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[100px] bg-blue-500/5 blur-[50px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-16">
          {/* Brand Column */}
          <div className="lg:col-span-4">
            <Link href="/" className="flex items-center gap-3 mb-6">
              <Image
                src={LOGO.teemo}
                alt="Beemo Logo"
                width={40}
                height={40}
                className="rounded-full grayscale hover:grayscale-0 transition-all duration-300"
              />
              <span className="font-bold text-xl text-white">
                Beemo<span className="text-blue-500">Bot</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed mb-6 max-w-sm">
              The ultimate League of Legends companion for your Discord server.
              Level up your community with real-time stats, builds, and minigames.
            </p>
            <div className="flex gap-4">
              {/* Social Icons placeholders */}
              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-blue-500/20 hover:text-blue-400 transition-colors cursor-pointer">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
              </div>
              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-indigo-500/20 hover:text-indigo-400 transition-colors cursor-pointer">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              </div>
            </div>
          </div>

          {/* Links Columns */}
          <div className="lg:col-span-2 md:col-span-1">
            <h3 className="font-semibold text-white mb-6">Product</h3>
            <ul className="space-y-4">
              <li><Link href="/features" className="text-sm text-slate-400 hover:text-blue-400 transition-colors">Features</Link></li>
              <li><Link href="/premium" className="text-sm text-slate-400 hover:text-blue-400 transition-colors">Premium</Link></li>
              <li><Link href="/commands" className="text-sm text-slate-400 hover:text-blue-400 transition-colors">Commands</Link></li>
              <li><Link href="/changelog" className="text-sm text-slate-400 hover:text-blue-400 transition-colors">Changelog</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-2 md:col-span-1">
            <h3 className="font-semibold text-white mb-6">Resources</h3>
            <ul className="space-y-4">
              <li><Link href="/documentation" className="text-sm text-slate-400 hover:text-blue-400 transition-colors">Documentation</Link></li>
              <li><Link href="/api" className="text-sm text-slate-400 hover:text-blue-400 transition-colors">API Reference</Link></li>
              <li><Link href="/guides" className="text-sm text-slate-400 hover:text-blue-400 transition-colors">Guides</Link></li>
              <li><Link href="/blog" className="text-sm text-slate-400 hover:text-blue-400 transition-colors">Blog</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-2 md:col-span-1">
            <h3 className="font-semibold text-white mb-6">Company</h3>
            <ul className="space-y-4">
              <li><Link href="/about" className="text-sm text-slate-400 hover:text-blue-400 transition-colors">About Us</Link></li>
              <li><Link href="/careers" className="text-sm text-slate-400 hover:text-blue-400 transition-colors">Careers</Link></li>
              <li><Link href="/legal" className="text-sm text-slate-400 hover:text-blue-400 transition-colors">Legal</Link></li>
              <li><Link href="/contact" className="text-sm text-slate-400 hover:text-blue-400 transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-2 md:col-span-1">
            <h3 className="font-semibold text-white mb-6">Legal</h3>
            <ul className="space-y-4">
              <li><Link href="/privacy" className="text-sm text-slate-400 hover:text-blue-400 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-sm text-slate-400 hover:text-blue-400 transition-colors">Terms of Service</Link></li>
              <li><Link href="/cookies" className="text-sm text-slate-400 hover:text-blue-400 transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} BeemoBot. Not endorsed by Riot Games.
          </p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-xs text-slate-400">All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
