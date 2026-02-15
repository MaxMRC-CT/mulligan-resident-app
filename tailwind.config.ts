import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        mulligan: {
          orange: '#F97316',
          black: '#000000',
          white: '#FFFFFF',
          'warm-gray': '#2A2A2A',
          'soft-gray': '#E5E7EB',
        },
      },
    },
  },
  plugins: [],
};
export default config;
