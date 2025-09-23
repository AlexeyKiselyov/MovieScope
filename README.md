# MovieScope

MovieScope is a React SPA for discovering trending movies and searching titles
using the TMDb API.

The app includes:

- Home page with trending movies (day/week) and a "Load more" pagination;
- Movies page with title search via a `query` URL parameter and incremental
  loading;
- Movie details page with poster, genres, rating, overview, plus nested routes:
  Cast and Reviews;
- Smooth scrolling (Lenis), a "Scroll to top" button, toast notifications, and
  basic SEO (OG/Twitter/JSON‑LD).

Routes:

- `/` — Trending (day/week)
- `/movies` — search by title (via `?query=`)
- `/movies/:movieId` — movie details
  - `/movies/:movieId/cast` — cast
  - `/movies/:movieId/reviews` — reviews

## Tech stack

- React 19, React Router 6.30
- TypeScript 5.7, Vite 6
- Axios for TMDb requests
- react-hot-toast, react-icons, react-spinners
- Lenis for smooth scrolling
- CSS Modules, modern-normalize
- Custom SEO util for OG/Twitter and JSON‑LD (`src/Components/SEO`)

## Requirements

- Node.js 18+ (20+ recommended)
- TMDb Bearer token (v4) to access the API

## Environment variables

Create a `.env` file in the project root and add:

```
VITE_TMDB_VIDEO_API_TOKEN=your_tmdb_bearer_token
# Optional but recommended for correct canonical URLs in SEO presets:
VITE_SITE_URL=https://your-domain.com
```

How to get the TMDb token: in your TMDb account settings, create a Read Access
Token (v4 auth) and paste it into `VITE_TMDB_VIDEO_API_TOKEN`.

## Setup and run

1. Install dependencies

```bash
npm install
```

2. Start dev server (with HMR)

```bash
npm run dev
```

3. Build production bundle

```bash
npm run build
```

4. Preview the production build locally

```bash
npm run preview
```

5. Lint the project

```bash
npm run lint
```

Notes:

- the dev script uses `vite --host` to expose the server on your network;
- this is an SPA: when deploying to static hosting, ensure history fallback to
  `index.html` for unknown paths or use platform-specific SPA adapters.

## Features and routes

- Home (`/`): trending for week/day (toggle) with load-more pagination. Source:
  `src/serveсes/getTrendMovies.ts`.
- Search (`/movies`): search by title using the `query` URL parameter, with
  incremental loading — `src/serveсes/findMovie.ts`.
- Details (`/movies/:movieId`): poster, rating, genres, overview —
  `src/serveсes/getMovieDetails.ts`; nested:
  - Cast (`/cast`) — `src/serveсes/getMovieCredits.ts`;
  - Reviews (`/reviews`) — `src/serveсes/getMovieReviews.ts`.

Routing is defined in `src/Components/App.tsx`.

## Project structure (high-level)

- `src/main.tsx` — app entry, Router, SmoothScrolling wrapper
- `src/Components/` — reusable components (Navigation, MovieList, LoadMoreBtn,
  Spotlight, ScrollToTopBtn, Footer, Common/_, SEO/_)
- `src/Pages/` — pages: HomePage, MoviesPage, MovieDetailsPage
- `src/serveсes/` — TMDb API service functions
- `src/types/types.ts` — base `Movie` types
- `public/` — favicon, sitemap, webmanifest

## SEO

In `src/Components/SEO`:

- `SEO.tsx` — utility to set meta tags (title, description, OG/Twitter,
  canonical), JSON‑LD;
- `presets.tsx` — presets for pages: `HomeSEO`, `MoviesSEO`, `MovieDetailsSEO`.
  For proper absolute URLs, set `VITE_SITE_URL`.

## Accessibility and UX

- Buttons and links include aria attributes; rating badges use icons and titles
  for clarity.
- Smooth scrolling (Lenis) and the "Scroll to top" button improve navigation on
  long lists.
- Loaders and toasts communicate network states and errors.

## TMDb usage

This application uses The Movie Database (TMDb) API. All requests are
authenticated via the Bearer token from `.env`.

Important: This product uses the TMDb API but is not endorsed or certified by
TMDb.

## npm scripts

- `dev` — start Vite dev server
- `build` — TypeScript build (`tsc -b`) plus `vite build`
- `preview` — local preview of the built app
- `lint` — run ESLint over the repo

## Images and attribution

- Movie posters are loaded from `image.tmdb.org` with size `w500`. When missing,
  a placeholder from `src/images/Placeholder_Movie.jpg` is used.
- Logos and other images in `src/images` belong to the repository owner/authors.
  Ensure you have rights before reusing externally.

## Troubleshooting

- Empty search results: a "Nothing found" toast is shown.
- Network/token errors: a toast with an error message is shown. Verify
  `VITE_TMDB_VIDEO_API_TOKEN` and your network.
- Wrong canonical/OG tags: set `VITE_SITE_URL` in `.env` (e.g.,
  `https://moviescope.example.com`).

---

Author: AlexeyKiselyov Repository: MovieScope
