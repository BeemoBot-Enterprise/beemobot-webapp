/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Hextech Colors
        hextech: {
          blue: "var(--hextech-blue)",
          "blue-glow": "var(--hextech-blue-glow)",
          "blue-dark": "var(--hextech-blue-dark)",
          gold: "var(--hextech-gold)",
          "gold-light": "var(--hextech-gold-light)",
          "gold-dark": "var(--hextech-gold-dark)",
        },
        // Beemo Colors
        beemo: {
          honey: "var(--beemo-honey)",
          "honey-light": "var(--beemo-honey-light)",
          "honey-dark": "var(--beemo-honey-dark)",
        },
        // Void Backgrounds
        void: {
          DEFAULT: "var(--bg-void)",
          deep: "var(--bg-deep)",
          surface: "var(--bg-surface)",
          elevated: "var(--bg-elevated)",
        },
        // Runeterra Accents
        rune: {
          cyan: "var(--rune-cyan)",
          purple: "var(--rune-purple)",
          pink: "var(--rune-pink)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        pulse: {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0.5 },
        },
        "pulse-glow": {
          "0%, 100%": {
            boxShadow: "0 0 20px var(--hextech-blue), 0 0 40px rgba(0, 160, 255, 0.3)"
          },
          "50%": {
            boxShadow: "0 0 30px var(--hextech-blue), 0 0 60px rgba(0, 160, 255, 0.5)"
          },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "spin-slow": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "bounce-subtle": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-5px)" },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
        "fade-in": {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        "fade-in-up": {
          "0%": { opacity: 0, transform: "translateY(20px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        "fade-in-down": {
          "0%": { opacity: 0, transform: "translateY(-20px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        "slide-in-left": {
          "0%": { opacity: 0, transform: "translateX(-50px)" },
          "100%": { opacity: 1, transform: "translateX(0)" },
        },
        "slide-in-right": {
          "0%": { opacity: 0, transform: "translateX(50px)" },
          "100%": { opacity: 1, transform: "translateX(0)" },
        },
        "scale-in": {
          "0%": { opacity: 0, transform: "scale(0.9)" },
          "100%": { opacity: 1, transform: "scale(1)" },
        },
        "honeycomb-pulse": {
          "0%, 100%": { opacity: 0.3 },
          "50%": { opacity: 0.6 },
        },
        "bee-fly": {
          "0%": { transform: "translate(0, 0) rotate(0deg)" },
          "25%": { transform: "translate(5px, -5px) rotate(5deg)" },
          "50%": { transform: "translate(0, -10px) rotate(0deg)" },
          "75%": { transform: "translate(-5px, -5px) rotate(-5deg)" },
          "100%": { transform: "translate(0, 0) rotate(0deg)" },
        },
        typewriter: {
          "0%": { width: "0%" },
          "100%": { width: "100%" },
        },
        blink: {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0 },
        },
        "particle-float": {
          "0%": { transform: "translateY(100vh) rotate(0deg)", opacity: 0 },
          "10%": { opacity: 1 },
          "90%": { opacity: 1 },
          "100%": { transform: "translateY(-100vh) rotate(360deg)", opacity: 0 },
        },
        "glow-pulse": {
          "0%, 100%": { filter: "brightness(1)" },
          "50%": { filter: "brightness(1.3)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        float: "float 3s ease-in-out infinite",
        pulse: "pulse 2s ease-in-out infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        shimmer: "shimmer 2s linear infinite",
        "spin-slow": "spin-slow 8s linear infinite",
        "bounce-subtle": "bounce-subtle 2s ease-in-out infinite",
        wiggle: "wiggle 1s ease-in-out infinite",
        "fade-in": "fade-in 0.5s ease-out",
        "fade-in-up": "fade-in-up 0.5s ease-out",
        "fade-in-down": "fade-in-down 0.5s ease-out",
        "slide-in-left": "slide-in-left 0.5s ease-out",
        "slide-in-right": "slide-in-right 0.5s ease-out",
        "scale-in": "scale-in 0.3s ease-out",
        "honeycomb-pulse": "honeycomb-pulse 4s ease-in-out infinite",
        "bee-fly": "bee-fly 2s ease-in-out infinite",
        typewriter: "typewriter 2s steps(40) forwards",
        blink: "blink 1s step-end infinite",
        "particle-float": "particle-float 10s linear infinite",
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-hextech": "linear-gradient(135deg, var(--hextech-blue) 0%, var(--hextech-gold) 100%)",
        "gradient-beemo": "linear-gradient(135deg, var(--beemo-honey) 0%, var(--hextech-gold) 100%)",
        "gradient-void": "linear-gradient(180deg, var(--bg-void) 0%, var(--bg-deep) 50%, var(--bg-surface) 100%)",
      },
      boxShadow: {
        "hextech": "0 0 20px var(--hextech-blue), 0 0 40px rgba(0, 160, 255, 0.3)",
        "hextech-lg": "0 0 30px var(--hextech-blue), 0 0 60px rgba(0, 160, 255, 0.4)",
        "gold": "0 0 20px var(--hextech-gold), 0 0 40px rgba(255, 215, 0, 0.3)",
        "gold-lg": "0 0 30px var(--hextech-gold), 0 0 60px rgba(255, 215, 0, 0.4)",
        "honey": "0 0 20px var(--beemo-honey), 0 0 40px rgba(245, 166, 35, 0.3)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
