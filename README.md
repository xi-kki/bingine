# 🍎 Bingine

**Never let good food go bad.**

Bingine is an offline AI agent for food waste tracking. Track your ingredients, get expiry alerts, and receive recipe suggestions — all running locally on your device.

![Bingine](preview.png)

## ✨ Features

- 🧠 **Smart Expiry Tracking** — Bingine remembers every ingredient and its expiry date
- 🍳 **Recipe Suggestions** — Get recipe ideas based on what's about to expire
- 📱 **Instant Alerts** — Telegram, WhatsApp, SMS notifications
- 🔒 **100% Offline** — Your data stays on your device. No cloud, no tracking
- 📊 **Waste Analytics** — Track your waste reduction over time
- 🌱 **Donate & Compost** — Route near-expiry items to food banks

## 🚀 Quick Start

### Option 1: Standalone (No install required)

Just open `dist/index.html` in your browser. Works immediately!

### Option 2: Development

```bash
# Clone the repo
git clone https://github.com/xi-kki/bingine.git
cd bingine

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | Next.js 14 |
| **Styling** | Tailwind CSS |
| **Icons** | Phosphor Icons |
| **Language** | TypeScript |
| **Storage** | LocalStorage (offline) |
| **Deployment** | Vercel / Static |

## 📁 Project Structure

```
bingine/
├── src/
│   ├── app/
│   │   ├── page.tsx          # Landing page
│   │   ├── layout.tsx        # Root layout
│   │   ├── globals.css       # Global styles
│   │   └── dashboard/
│   │       └── page.tsx      # Dashboard
│   ├── components/
│   │   ├── Hero.tsx
│   │   ├── Features.tsx
│   │   ├── HowItWorks.tsx
│   │   ├── CTA.tsx
│   │   └── Footer.tsx
│   └── lib/
│       └── foodStore.ts      # LocalStorage manager
├── dist/
│   └── index.html            # Standalone version
├── preview-landing.html      # Landing preview
├── preview-dashboard.html    # Dashboard preview
├── package.json
└── README.md
```

## 🎨 Design

- **Primary:** `#2D5A27` (Fresh Green)
- **Accent:** `#4CAF50` (Living Green)
- **Warning:** `#FF9800` (Expiry Orange)
- **Danger:** `#F44336` (Spoiled Red)
- **Icons:** [Phosphor Icons](https://phosphoricons.com) — 6 weights, 7,000+ icons

## 📱 Usage

1. **Add items** — Click "Add Item" and enter your food details
2. **Track expiry** — Xpiri automatically tracks expiry status
3. **Get recipes** — See recipe suggestions for expiring items
4. **Save money** — Watch your waste rate go down

## 🌍 Demo

Live: [bingine.vercel.app](https://bingine.vercel.app)

## 🔒 Privacy

- **100% offline** — No data leaves your device
- **No accounts** — No signup required
- **No tracking** — Your kitchen data stays private

## 🤝 Contributing

Contributions welcome! Please read our [Contributing Guide](CONTRIBUTING.md) first.

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

Built with ❤️ for food tech founders who care about sustainability.
