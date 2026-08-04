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
        'bingine-green': '#2D5A27',
        'bingine-fresh': '#4CAF50',
        'bingine-warning': '#FF9800',
        'bingine-danger': '#F44336',
      },
    },
  },
  plugins: [],
}
export default config
