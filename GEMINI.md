# GEMINI.md - thoughtsdbfrontend

## Project Overview
`thoughtsdbfrontend` is a "Second Brain" knowledge management web application built with **Next.js (App Router)**. It serves as a dashboard for visualizing, filtering, and searching through saved "thoughts" or "saves" (tweets, articles, books, reminders, etc.).

### Architecture & Key Technologies
- **Framework:** Next.js (TypeScript) using the App Router.
- **Styling:** Tailwind CSS (v4) with a dark-themed, minimalist aesthetic.
- **Database/Backend:** Supabase (PostgreSQL) with Row Level Security (RLS) and custom RPC functions for semantic search.
- **Search Logic:** Semantic search powered by **Cohere** embeddings.
- **Authentication:** Currently uses a hardcoded `USER_ID` from environment variables, intended for future multi-user auth implementation.

## Key Files & Directories
- `app/page.tsx`: Server component that fetches initial "recent saves" from Supabase.
- `components/Dashboard.tsx`: Main client-side interface for searching, filtering, and displaying cards.
- `components/SaveCard.tsx`: Individual card component for rendering a save entry.
- `lib/search.ts`: Utilities for generating embeddings via Cohere and calling the `search_saves` Supabase RPC.
- `app/api/search/route.ts`: API route handling client-side search requests.
- `app/globals.css`: Global styles, likely including Tailwind v4 configuration and custom theme variables.

## Building and Running
The project follows standard Next.js scripts:

- **Development:** `npm run dev`
- **Build:** `npm run build`
- **Production Start:** `npm run start`
- **Linting:** `npm run lint`

### Required Environment Variables
Ensure the following are set in `.env.local`:
- `SUPABASE_URL`: Your Supabase project URL.
- `SUPABASE_SERVICE_KEY`: Service role key for administrative access (used server-side).
- `COHERE_API_KEY`: API key for generating text embeddings.
- `NEXT_PUBLIC_USER_ID`: (Optional/Temporary) User ID for current dashboard context.

## Development Conventions
- **Server vs Client Components:** Data fetching is preferred in Server Components (`app/page.tsx`) when possible. Interaction-heavy UI is isolated in Client Components (e.g., `components/Dashboard.tsx`).
- **Semantic Search:** Uses a vector-based search approach. The Supabase database expects a `search_saves` function that accepts `query_embedding` (vector), `match_user_id` (uuid), and `match_count` (int).
- **TypeScript:** Strict typing is enforced via `tsconfig.json`.
- **Path Aliases:** Use `@/*` for absolute imports starting from the project root.
