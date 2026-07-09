# PartiFi – Loan Participation Marketplace

A production-grade SaaS demo for credit unions and vetted brokers to **post, search, and settle loan participations** — built to showcase for client presentations and deploy to Netlify.

![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8)

## Live Demo Features

- **Landing page** with hero, stats, featured participations, testimonials, pricing
- **Authentication** with role-based access (Credit Union, Broker, Admin)
- **Participation marketplace** with instant search & filters
- **Detailed participation pages** with inquiry system
- **Dashboards** for Credit Unions, Brokers, and Admin
- **News & Resources** sections with seeded industry content
- **Stripe integration** (demo mode + production-ready API routes)
- **Dark/light mode**, fully responsive, seeded sample data

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@partifi.com | demo123 |
| Credit Union | cu@heritagecu.org | demo123 |
| Broker | broker@capitalpartners.com | demo123 |

## Deploy to Netlify

### Option 1: Netlify UI
1. Push this repo to GitHub
2. Go to [netlify.com](https://netlify.com) → **Add new site** → **Import from Git**
3. Build command: `npm run build`
4. Publish directory: `.next` (Netlify Next.js plugin handles this automatically)
5. Add environment variable: `NEXT_PUBLIC_APP_URL=https://your-site.netlify.app`

### Option 2: Netlify CLI
```bash
npm install -g netlify-cli
npm run build
netlify deploy --prod
```

The `netlify.toml` is pre-configured with `@netlify/plugin-nextjs`.

## Environment Variables

Copy `.env.example` to `.env.local`:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Optional - Stripe (demo works without these)
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRICE_PREMIUM_CU=
STRIPE_PRICE_PREMIUM_BROKER=
```

## Tech Stack

- **Frontend:** Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS
- **UI:** Radix UI primitives, Lucide icons, dark/light theme
- **Data:** In-memory demo store with comprehensive seed data (Supabase-ready architecture)
- **Payments:** Stripe Checkout, Customer Portal, Webhooks
- **Deploy:** Netlify with Next.js plugin

## Project Structure

```
src/
├── app/                    # Pages & API routes
│   ├── participations/     # Browse & detail pages
│   ├── dashboard/          # Role-based dashboards
│   ├── news/               # Industry news
│   ├── resources/          # Guides & templates
│   └── api/                # Auth, inquiries, Stripe, admin
├── components/             # UI components
└── lib/                    # Types, seed data, auth, utilities
```

## Client Presentation Tips

1. Start on the **landing page** — show stats and featured participations
2. **Browse participations** — demo search filters (loan type, state, risk rating)
3. Open a **participation detail** — show inquiry form
4. **Login as Credit Union** — show dashboard with inquiries and listings
5. **Login as Broker** — show saved participations and deal flow
6. **Login as Admin** — show user management and pending approvals
7. Show **News & Resources** — demonstrate content management value
8. Show **Pricing** — mention Stripe subscription billing

## License

Demo project for client presentation purposes.
