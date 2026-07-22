import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'xpiri-green': '#2D5A27',
        'xpiri-fresh': '#4CAF50',
        'xpiri-warning': '#FF9800',
        'xpiri-danger': '#F44336',
      },
    },
  },
  plugins: [],
}
export default config
