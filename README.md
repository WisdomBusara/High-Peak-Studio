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

3. Set up environment variables
```bash
cp .env.example .env.local
# Edit .env.local with your configuration
```

4. Run development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

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
2. Design system and basic components
3. Public website pages
4. Payload CMS setup
5. PostgreSQL and database models
6. Media management (R2)
7. Admin dashboard
8. Lead management
9. Chatbot UI
10. Knowledge pipeline

## Principles

- **No Fabrication**: Never invent Highpeak-specific information
- **Verified Content**: Only approved, published content is used
- **Accessibility**: WCAG 2.2 AA compliance
- **Performance**: Lighthouse 90+ scores
- **Responsive**: Mobile-first design
- **Traceable**: Full audit trails and source attribution

## Related Documentation

See `Highpeak-Consultants-Complete-Platform-Specification.md` for complete requirements.
