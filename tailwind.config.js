/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        charcoal: '#020617', // Slate 950 - polished dark
        'charcoal-light': '#0f172a', // Slate 900
        black: '#000000',
        offwhite: '#f8fafc', // Slate 50
        cyan: '#38bdf8',     // Sky 400 - Classy tech blue
        violet: '#6366f1',   // Indigo 500 - Professional depth
        'cyan-soft': 'rgba(56, 189, 248, 0.1)',
        'violet-soft': 'rgba(99, 102, 241, 0.1)',
      },
      fontFamily: {
        sans: ['Inter', 'Satoshi', 'system-ui', 'sans-serif'],
        display: ['Syne', 'Orbitron', 'sans-serif'], // Added Orbitron for tech headers
        mono: ['Space Mono', 'JetBrains Mono', 'monospace'], // Added tech mono font
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-subtle': 'linear-gradient(to right bottom, rgba(255, 255, 255, 0.03), rgba(0, 0, 0, 0))',
        'tech-grid': "radial-gradient(circle, rgba(0, 243, 255, 0.1) 1px, transparent 1px)",
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'scanline': 'scanline 8s linear infinite',
        'spin-slow': 'spin 12s linear infinite',
        'marquee': 'marquee 25s linear infinite',
      },
      boxShadow: {
        'glow-cyan': '0 0 20px rgba(0, 243, 255, 0.5), 0 0 10px rgba(0, 243, 255, 0.3)',
        'glow-violet': '0 0 20px rgba(188, 19, 254, 0.5), 0 0 10px rgba(188, 19, 254, 0.3)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(0, 243, 255, 0.2), 0 0 10px rgba(0, 243, 255, 0.1)' },
          '100%': { boxShadow: '0 0 20px rgba(0, 243, 255, 0.6), 0 0 30px rgba(0, 243, 255, 0.4)' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
      },
    },
  },
  plugins: [],
}
