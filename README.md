# 🍳 Xpiri

**Never let good food go bad.**

Xpiri is an offline AI agent for food waste tracking, built for food tech founders who care about sustainability.

![Xpiri Banner](public/og.png)

## ✨ Features

- 🧠 **Smart Expiry Tracking** - Knowledge graph remembers every ingredient and its expiry date
- 🍳 **Recipe Suggestions** - Get recipe ideas based on what's about to expire
- 📱 **Instant Alerts** - Telegram, WhatsApp, SMS notifications
- 🔒 **100% Offline** - Your data stays on your device. No cloud, no tracking
- 📊 **Waste Analytics** - Track your waste reduction over time
- 🌱 **Donate & Compost** - Route near-expiry items to food banks

## 🚀 Quick Start

```bash
# Clone the repo
git clone https://github.com/yourusername/xpiri.git
cd xpiri

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the landing page.

## 🛠️ Tech Stack

- **Framework:** Next.js 14
- **Styling:** Tailwind CSS
- **Language:** TypeScript
- **AI Backend:** Thoth (Ollama)
- **Deployment:** Vercel

## 📦 Project Structure

```
xpiri/
├── src/
│   ├── app/
│   │   ├── layout.tsx      # Root layout
│   │   ├── page.tsx        # Landing page
│   │   └── globals.css     # Global styles
│   └── components/
│       ├── Hero.tsx        # Hero section
│       ├── Features.tsx    # Features grid
│       ├── HowItWorks.tsx  # Step-by-step guide
│       ├── CTA.tsx         # Call to action
│       └── Footer.tsx      # Footer
├── public/                 # Static assets
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── next.config.js
```

## 🎨 Design

- **Primary Color:** `#2D5A27` (Fresh Green)
- **Accent Color:** `#4CAF50` (Living Green)
- **Warning:** `#FF9800` (Expiry Orange)
- **Danger:** `#F44336` (Spoiled Red)

## 🚢 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import repository on [vercel.com](https://vercel.com)
3. Deploy automatically

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/xpiri)

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) first.

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

---

Built with ❤️ for food tech founders who care about sustainability.
