export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        neonBlue: '#00f2fe',
        neonPurple: '#4facfe',
        darkBG: '#0a0a0f',
        panelBG: '#13131a',
        glowStart: '#00f2fe20',
        glowEnd: '#4facfe20'
      },
      boxShadow: {
        'neon': '0 0 10px #00f2fe, 0 0 40px #00f2fe80',
        'neon-purple': '0 0 10px #4facfe, 0 0 40px #4facfe80',
      }
    },
  },
  plugins: [],
}
