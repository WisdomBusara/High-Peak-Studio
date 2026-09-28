# Highpeak Consultants Ltd - Platform

A premium architecture and consultancy website with CMS, admin dashboard, chatbot, and knowledge management system.

## Project Structure

```
├── app/                    # Next.js app directory
├── components/            # React components
│   ├── ui/               # Design system components
│   └── layout/           # Layout components
├── lib/                   # Utilities and types
├── public/               # Static assets
└── styles/               # Global styles
```

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Instrument Serif & Inter fonts
- **Database**: PostgreSQL with pgvector
- **CMS**: Payload CMS (Phase 2)
- **Media**: Cloudflare R2
- **AI**: OpenAI API for embeddings
- **Email**: Resend
- **Deployment**: Vercel

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- PostgreSQL 12+

### Installation

1. Clone the repository
```bash
git clone git@github.com:WisdomBusara/High-Peak-Studio.git
cd High-Peak-Studio
```

2. Install dependencies
```bash
npm install
```

3. Set up PostgreSQL database
See [DATABASE_SETUP.md](DATABASE_SETUP.md) for complete instructions:
```bash
# Create database and user
createdb -U postgres highpeak
```

4. Set up environment variables
```bash
cp .env.example .env.local
# Edit .env.local with your database credentials
```

5. Run database migrations
```bash
npm run payload:migrate
```

6. Create admin user
```bash
npm run payload:create-user
```

7. Run development server
```bash
npm run dev
```

Access:
- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Admin Panel**: [http://localhost:3000/admin](http://localhost:3000/admin)
- **API**: [http://localhost:3000/api](http://localhost:3000/api)

## Development

### Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Architecture

### Design System

The project uses a cohesive design system based on:

**Colors**
- Background: `#F5F3EE`
- Surface: `#EAE7DF`
- Text: `#151515`
- Muted: `#686762`
- Border: `#C9C6BD`

**Typography**
- Display: Instrument Serif
- Body: Inter

**Layout**
- 12-column grid on desktop
- 8-column on tablet
- 4-column on mobile
- Max content width: 1440px

## Implementation Order

1. ✅ Project foundation
2. ✅ Design system and basic components
3. ✅ Public website pages (13 routes)
4. ✅ Payload CMS setup (6 collections)
5. ✅ Database & Chatbot foundation
6. → LLM integration (OpenAI)
7. → Knowledge pipeline (RAG)
8. → Admin dashboard enhancements
9. → Lead qualification workflow
10. → Analytics & monitoring

## Principles

- **No Fabrication**: Never invent Highpeak-specific information
- **Verified Content**: Only approved, published content is used
- **Accessibility**: WCAG 2.2 AA compliance
- **Performance**: Lighthouse 90+ scores
- **Responsive**: Mobile-first design
- **Traceable**: Full audit trails and source attribution

## Documentation

- **[Highpeak-Consultants-Complete-Platform-Specification.md](Highpeak-Consultants-Complete-Platform-Specification.md)** - Complete platform requirements
- **[CLAUDE.md](CLAUDE.md)** - Implementation guide and architecture
- **[DATABASE_SETUP.md](DATABASE_SETUP.md)** - PostgreSQL setup and configuration
- **[PAYLOAD_SETUP.md](PAYLOAD_SETUP.md)** - Payload CMS configuration
- **[CHATBOT_GUIDE.md](CHATBOT_GUIDE.md)** - Chatbot architecture and development

## Features

### Phase 1: Foundation ✅
- Next.js 15 + React 19 + TypeScript
- Design system with responsive layout
- 13 public website pages
- Payload CMS with 6 collections
- PostgreSQL database
- Chatbot UI with API

### Phase 2: Upcoming
- OpenAI LLM integration
- Knowledge base and RAG
- Advanced analytics
- Admin dashboard enhancements
