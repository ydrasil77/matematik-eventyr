import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      animation: {
        "bounce-in": "bounceIn 0.45s cubic-bezier(0.17,0.89,0.32,1.28)",
        "shake": "shake 0.45s ease-in-out",
        "pop": "pop 0.3s ease-out",
        "float": "float 3s ease-in-out infinite",
        "slide-up": "slideUp 0.35s ease-out",
        "wiggle": "wiggle 0.6s ease-in-out",
        "xp-flash": "xpFlash 0.8s ease-out forwards",
        "star-spin": "starSpin 0.6s ease-out",
        "confetti-1": "confettiFall1 1.5s ease-in forwards",
        "confetti-2": "confettiFall2 1.8s ease-in forwards",
        "confetti-3": "confettiFall3 1.6s ease-in forwards",
        "level-glow": "levelGlow 1.5s ease-in-out infinite alternate",
      },
      keyframes: {
        bounceIn: {
          "0%": { transform: "scale(0.3)", opacity: "0" },
          "60%": { transform: "scale(1.15)", opacity: "1" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        shake: {
          "0%,100%": { transform: "translateX(0)" },
          "20%": { transform: "translateX(-10px)" },
          "40%": { transform: "translateX(10px)" },
          "60%": { transform: "translateX(-6px)" },
          "80%": { transform: "translateX(6px)" },
        },
        pop: {
          "0%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.12)" },
          "100%": { transform: "scale(1)" },
        },
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        slideUp: {
          "0%": { transform: "translateY(30px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        wiggle: {
          "0%,100%": { transform: "rotate(0deg)" },
          "25%": { transform: "rotate(-8deg)" },
          "75%": { transform: "rotate(8deg)" },
        },
        xpFlash: {
          "0%": { opacity: "1", transform: "translateY(0) scale(1)" },
          "100%": { opacity: "0", transform: "translateY(-60px) scale(1.4)" },
        },
        starSpin: {
          "0%": { transform: "scale(0) rotate(-180deg)", opacity: "0" },
          "70%": { transform: "scale(1.3) rotate(10deg)", opacity: "1" },
          "100%": { transform: "scale(1) rotate(0deg)", opacity: "1" },
        },
        confettiFall1: {
          "0%": { transform: "translateY(-20px) rotate(0deg)", opacity: "1" },
          "100%": { transform: "translateY(100vh) rotate(720deg)", opacity: "0" },
        },
        confettiFall2: {
          "0%": { transform: "translateY(-20px) rotate(0deg)", opacity: "1" },
          "100%": { transform: "translateY(100vh) rotate(-540deg)", opacity: "0" },
        },
        confettiFall3: {
          "0%": { transform: "translateY(-20px) rotate(0deg)", opacity: "1" },
          "100%": { transform: "translateY(100vh) rotate(360deg)", opacity: "0" },
        },
        levelGlow: {
          "0%": { boxShadow: "0 0 10px rgba(255,215,0,0.3)" },
          "100%": { boxShadow: "0 0 30px rgba(255,215,0,0.9)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
