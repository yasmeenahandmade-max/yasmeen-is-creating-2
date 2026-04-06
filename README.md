# Yasmeen Is Creating — Website & CMS

A bilingual (English + Arabic) handmade crafts website with a full admin CMS/CRM dashboard.

## Tech Stack

- **Framework:** Next.js 14 (App Router) + TypeScript
- **Styling:** Tailwind CSS with custom brand tokens
- **Database:** PostgreSQL via Supabase
- **ORM:** Prisma
- **Auth:** Supabase Auth with role-based access
- **i18n:** next-intl (English + Arabic with full RTL)
- **State:** Zustand (cart)
- **File Storage:** Supabase Storage

## Quick Start

### 1. Clone and install

```bash
git clone https://github.com/YOUR_USERNAME/yasmeen-is-creating.git
cd yasmeen-is-creating
npm install
```

### 2. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **Settings → API** and copy your **Project URL** and **anon public key**
3. Go to **Settings → Database** and copy the **Connection string (URI)**
4. Go to **Storage** → click **New Bucket** → name it `uploads` → set it to **Public**
5. In **Auth → Providers → Email**, you may want to disable "Confirm email" for easier testing

### 3. Configure environment

```bash
cp .env.example .env
```

Fill in your `.env`:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
DATABASE_URL=postgresql://postgres:PASSWORD@db.xxxxx.supabase.co:5432/postgres
NEXT_PUBLIC_SITE_URL=http://localhost:3000
ADMIN_EMAIL=your@email.com
ADMIN_PASSWORD=your-password
```

### 4. Set up the database

```bash
npx prisma db push
```

### 5. Seed initial data

```bash
npm run db:seed
```

This creates default categories, site settings, and page content.

### 6. Create your admin account

```bash
npx tsx prisma/setup-admin.ts
```

### 7. Add your brand assets

Place in `/public/fonts/`:
- `Asterone-Regular.woff2`
- `Asterone-Regular.woff`

Place in `/public/images/`:
- `logo.png` — dark logo for light backgrounds
- `logo-white.png` — white logo for dark backgrounds
- `favicon.ico` — browser tab icon
- `og-default.jpg` — social sharing image (1200×630px)

### 8. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

Admin panel: [http://localhost:3000/en/admin](http://localhost:3000/en/admin)

## Project Structure

```
src/
├── app/
│   ├── [locale]/              # Public pages (EN + AR)
│   │   ├── page.tsx           # Homepage (8 CMS-driven sections)
│   │   ├── store/             # Store, product detail, cart, checkout, tracking
│   │   ├── blog/              # Blog listing + post detail
│   │   ├── artists/           # Featured artists listing + detail
│   │   ├── crafts/            # Craft discovery + category detail
│   │   ├── freebies/          # Freebies with email gate
│   │   ├── request/           # Custom order form
│   │   ├── about/             # CMS-driven about page
│   │   ├── contact/           # Contact form
│   │   └── admin/             # Admin CMS/CRM dashboard
│   │       ├── login/         # Admin login
│   │       ├── products/      # Product manager
│   │       ├── orders/        # Order management
│   │       ├── blog/          # Blog post editor
│   │       ├── artists/       # Artist profile editor
│   │       ├── freebies/      # Freebie manager
│   │       ├── categories/    # Category manager (4 types)
│   │       ├── requests/      # Special request tracker
│   │       ├── messages/      # Contact message inbox
│   │       ├── customers/     # Auto-generated customer CRM
│   │       ├── subscribers/   # Email list with CSV export
│   │       ├── places/        # Places to Buy manager
│   │       ├── pages/         # CMS page editor (About, Hero, etc.)
│   │       ├── team/          # Team member management
│   │       └── settings/      # Site settings (branding, social, SEO, payment)
│   ├── api/                   # API routes
│   ├── sitemap.ts             # Auto-generated sitemap.xml
│   └── robots.ts              # robots.txt
├── components/
│   ├── layout/                # Header (with cart badge), Footer
│   ├── admin/                 # Sidebar, TopBar (notifications), StatCard, etc.
│   ├── ui/                    # ImageUpload, RichTextEditor, BilingualInput, etc.
│   ├── home/                  # Hero, About, Products, Places, Newsletter, Instagram
│   ├── blog/                  # LatestPosts
│   └── artists/               # FeaturedArtistSpotlight
├── i18n/                      # Locale config, navigation, request handler
├── lib/                       # Prisma, Supabase, utils, cart store, structured data
├── messages/                  # EN + AR translations (~150 keys each)
├── styles/                    # Global CSS with brand system
└── types/                     # TypeScript definitions
```

## Features

### Public Website
- **Homepage** — 8 live sections: CMS hero, about, product carousel, blog posts, featured artist, places to buy, newsletter, Instagram
- **Store** — Category filters, product detail with image gallery, cart, checkout (CliQ + COD), order confirmation, order tracking
- **Blog** — Search, category filters, rich content with embeds, share buttons (Twitter, Facebook, WhatsApp, copy link)
- **Featured Artists** — Portfolio, interview Q&A, podcast embeds, social links
- **Crafts Discovery** — Browse by craft type, see related products/posts/artists
- **Freebies** — Email-gated downloads, auto-subscriber capture
- **Custom Orders** — Form with image upload, budget, deadline
- **Contact** — Form with admin notification
- **Bilingual** — Full EN/AR with RTL layout, language switcher
- **SEO** — Dynamic meta tags, sitemap.xml, robots.txt, JSON-LD structured data

### Admin Dashboard
- **Role-based access** — Super Admin, Editor, Order Manager
- **Products** — Full CRUD, bilingual, multi-image upload, physical/digital toggle
- **Orders** — Status workflow, payment toggle, filters, internal notes
- **Blog** — Rich text editor with YouTube/Spotify/SoundCloud embeds
- **Artists** — Full profile editor with interview and podcast
- **Freebies** — File upload, download tracking, email capture
- **Categories** — 4 types (Craft, Store, Blog, Freebie) with icons
- **Requests** — 6-status workflow, admin notes, reference images
- **Messages** — Email-style inbox with read/unread
- **Customers** — Auto-generated CRM from orders + requests
- **Subscribers** — Source tags, CSV export
- **Notifications** — Real-time bell with unread count, auto-refresh
- **Team** — Invite members, assign roles, enable/disable
- **Settings** — Branding, social links, SEO defaults, CliQ payment config
- **Pages** — CMS editor for About, Hero, and other static content

## Brand Colors

| Color    | Hex       | Usage              |
|----------|-----------|---------------------|
| Rose     | `#C4918A` | Primary accent      |
| Blush    | `#EDDBD5` | Soft backgrounds    |
| Peach    | `#E8C5AD` | Warm highlights     |
| Sage     | `#C8CCAB` | Natural accent      |
| Forest   | `#5B6E5D` | Deep contrast       |
| Sky      | `#C5CDD8` | Cool accent         |
| Charcoal | `#4A4A4A` | Text / logo         |
| Cream    | `#FAF8F5` | Page background     |

## Deployment to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) → Import your repo
3. Add environment variables (same as your `.env`)
4. Deploy — Vercel auto-detects Next.js
5. Add your custom domain in **Settings → Domains**

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npx prisma db push` | Push schema to database |
| `npm run db:seed` | Seed initial data |
| `npx tsx prisma/setup-admin.ts` | Create first admin user |
| `npx prisma studio` | Open database GUI |

## File Count

**120+ files** across the full application including APIs, pages, components, utilities, translations, and configuration.
