<h1 align="center">
  🌿 FloraFauna Encyclopedia
</h1>

<p align="center">
  <b>An interactive biodiversity encyclopedia showcasing Indonesia's wildlife and plant species</b><br/>
  <sub>Search, explore, and learn about hundreds of species — with taxonomy data, conservation status, and rich photography.</sub>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js" alt="Next.js"/>
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/Supabase-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase"/>
  <img src="https://img.shields.io/badge/Clerk-6C47FF?style=for-the-badge&logo=clerk&logoColor=white" alt="Clerk"/>
  <img src="https://img.shields.io/badge/Tailwind-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind"/>
  <img src="https://img.shields.io/badge/Vercel-Deployed-000?style=for-the-badge&logo=vercel" alt="Deployed"/>
</p>

<p align="center">
  <a href="https://encyclopedia-lyart.vercel.app"><b>🔗 Live Demo</b></a> · <a href="#getting-started">Quick Start</a> · <a href="#contributing">Contribute</a>
</p>

<!--
🖼️ SCREENSHOTS — Replace after adding actual screenshots

<p align="center">
  <img src="docs/screenshots/hero.png" width="70%" alt="Homepage" />
</p>
<p align="center">
  <img src="docs/screenshots/species-detail.png" width="45%" alt="Species Detail"/>
  &nbsp;
  <img src="docs/screenshots/search.png" width="45%" alt="Search & Filter"/>
</p>
-->

---

## About

FloraFauna Encyclopedia is a full-stack web application that serves as a comprehensive digital reference for Indonesian biodiversity. Users can browse species across categories (mammals, birds, marine life, flora), search by scientific or common names, view IUCN conservation statuses, and contribute new entries.

**Motivation:** Indonesia is one of the world's 17 megadiverse countries, yet accessible digital resources about its native species remain limited. This project aims to fill that gap with a modern, searchable, and visually rich platform.

## Features

| Feature | Description |
|---------|-------------|
| **Species Catalog** | Browse 100+ species across mammals, birds, marine life, and flora with detailed profiles |
| **Taxonomy Data** | Complete classification: Kingdom → Phylum → Class → Order → Family → Genus → Species |
| **Conservation Status** | IUCN Red List categories (CR, EN, VU, NT, LC) displayed per species |
| **Full-Text Search** | Search across scientific names, common names, taxonomy, and habitat descriptions |
| **Category Browsing** | Filter by kingdom (Animalia/Plantae), category, or conservation status |
| **Authentication** | User accounts via Clerk (Google OAuth) for contributor access |
| **Contributor System** | Authenticated users can submit new species entries |
| **Responsive Design** | Fully optimized for desktop and mobile browsing |

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Database | PostgreSQL via Supabase |
| Auth | Clerk |
| Styling | Tailwind CSS + shadcn/ui |
| Payments | Stripe (optional, for premium features) |
| Deployment | Vercel |

## Architecture

```
Client (Browser)
    │
    ▼
┌──────────────────────────────────────────┐
│  Next.js 14 (App Router + RSC)           │
│  ┌──────────┐  ┌──────────┐  ┌────────┐ │
│  │  Pages   │  │  API      │  │ Middle │ │
│  │  (RSC)   │  │  Routes   │  │  ware  │ │
│  └────┬─────┘  └────┬─────┘  └───┬────┘ │
│       │              │            │       │
│  ┌────▼──────────────▼────────────▼────┐ │
│  │         Shared Lib Layer            │ │
│  │  (Supabase client, Clerk, utils)    │ │
│  └─────────────────┬──────────────────┘ │
└────────────────────┼─────────────────────┘
                     │
     ┌───────────────▼────────────────┐
     │       Supabase Platform        │
     │  ┌──────────┐  ┌───────────┐   │
     │  │ Postgres │  │  Storage  │   │
     │  │ (RLS)    │  │  (Images) │   │
     │  └──────────┘  └───────────┘   │
     └────────────────────────────────┘
```

## Getting Started

### Prerequisites

- Node.js 18+
- [Supabase](https://supabase.com/) account (or local instance via CLI)
- [Clerk](https://clerk.com/) account for authentication

### Installation

```bash
git clone https://github.com/Centauryyy25/biodiversity-encyclopedia.git
cd biodiversity-encyclopedia
npm install
```

### Environment Setup

```bash
cp .env.example .env
```

Fill in the required values:

```env
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# Stripe (optional)
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
```

### Database Setup

```bash
# Option A: Local development with Supabase CLI
npm install -g supabase
supabase start
supabase db reset    # Seeds sample species data

# Option B: Cloud — import migrations via Supabase Dashboard
```

See [DATABASE_GUIDE.md](DATABASE_GUIDE.md) for detailed setup instructions.

### Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
biodiversity-encyclopedia/
├── app/                # Next.js App Router (pages, layouts, API routes)
├── components/         # Reusable UI components
├── hooks/              # Custom React hooks
├── lib/                # Shared utilities & Supabase client
├── types/              # TypeScript type definitions
├── utils/              # Helper functions
├── supabase/           # Migrations & seed data
├── public/             # Static assets
└── documentation/      # Project documentation
```

## Species Data Model

```
┌──────────────────────┐
│       species         │
├──────────────────────┤
│ id                    │
│ common_name           │
│ scientific_name       │
│ kingdom               │
│ phylum                │
│ class                 │
│ order                 │
│ family                │
│ genus                 │
│ description           │
│ habitat               │
│ conservation_status   │  ← IUCN: CR, EN, VU, NT, LC
│ image_url             │
│ featured              │
│ created_at            │
└──────────────────────┘
```

## Roadmap

- [ ] AI-powered species identification from user-uploaded photos
- [ ] Interactive habitat maps with species distribution data
- [ ] Multi-language support (English / Bahasa Indonesia)
- [ ] Community discussion forums per species
- [ ] API endpoint for third-party integrations

## Contributing

Contributions are welcome — whether it's adding new species data, fixing bugs, or improving the UI.

```bash
git checkout -b feature/your-feature
git commit -m "feat: add your feature description"
git push origin feature/your-feature
```

Open a Pull Request with a clear description of your changes.

## License

This project is open source and available for academic and personal use.

---

<p align="center">
  Built by <a href="https://www.linkedin.com/in/ilham-ahsan-saputra/"><b>Ilham Ahsan Saputra</b></a><br/>
  <sub>Computer Science Student · Junior Network Engineer</sub>
</p>
