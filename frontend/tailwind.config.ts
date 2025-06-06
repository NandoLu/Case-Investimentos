// frontend/tailwind.config.ts
import type { Config } from "tailwindcss";

const config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Suas cores personalizadas aqui
      colors: {
        'white': 'var(--color-white)',
        'dark-blue': 'var(--color-dark-blue)',
        'light-gray': 'var(--color-light-gray)',
        'text-dark': 'var(--color-text-dark)',
        'text-light': 'var(--color-text-light)',
        // ... (resto dos mapeamentos ShadCN, se necessário)
      },
    },
  },
  // Plugins são adicionados de forma diferente na v4, ou via CSS.
  // Você pode não precisar desta seção ou ela será diferente.
  plugins: [],
} satisfies Config;

export default config;