# Movy

A streaming-catalog front-end for movies, series and anime: a draggable hero billboard, Top 10 rail, "Only on" provider rails, personalised rails, browse pages with filters, title pages with cast, episodes and trailers, profiles with PINs and interests, multiple shareable watchlists, history, a watch-party lobby, a download dialog, and a "no signal" 404. Nine fully translated locales. Dark UI built with Next.js, Tailwind v4 and SCSS modules.

Metadata and artwork come from [TMDB](https://www.themoviedb.org/). This product uses the TMDB API but is not endorsed or certified by TMDB.

## Quick start

```bash
npm install
cp .env.example .env      # optional – add a TMDB key for live data
npm run dev               # http://localhost:3000
```

Without a `TMDB_API_KEY` the site renders from the bundled snapshot in `src/data/fixtures`, so every page works offline. With a key, the home page, browse grids, search and title pages pull live data from TMDB.

```bash
npm run build && npm start   # production
npm run typecheck            # tsc --noEmit
```

## Environment

| Variable                   | Purpose                                                                                      |
| -------------------------- | -------------------------------------------------------------------------------------------- |
| `TMDB_API_KEY`             | TMDB v3 API key or v4 read token. Optional; fixtures are used when missing.                  |
| `NEXT_PUBLIC_IMAGE_PROXY`  | Optional prefix for an image proxy. Leave empty to load from `image.tmdb.org` directly.      |
| `NEXT_PUBLIC_SITE_URL`     | Public origin used for canonical, hreflang and Open Graph URLs.                              |

## Routes

| Route                                  | What it is                                                                 |
| -------------------------------------- | -------------------------------------------------------------------------- |
| `/`                                    | Hero billboard, Top 10, upcoming TV, trending, provider rails, 4K, top rated, genres |
| `/browse/movie` `/browse/tv` `/browse/anime` | Poster-marquee header, genre/year/country/sort filters, infinite grid |
| `/movie/:id` `/tv/:id[/:season/:episode]` `/anime/:id` | Title page; add `?play=true` for the player view     |
| `/watchlist` `/history`                | Per-profile lists (auth wall when signed out); watchlist has up to 20 named lists of 100 titles |
| `/l/:token`                            | Read-only shared list; the list travels inside the URL, so no backend is needed |
| `/watchparty` `/watchparty/:roomId`    | Lobby, room creation/joining, room with chat                               |
| `/profiles`                            | "Who's watching?" picker plus a create/edit wizard (name, avatar, movie and TV interests, optional PIN) |
| `/help` `/legal/terms` `/legal/privacy` `/legal/dmca` | Static pages                                                |
| `/api/search` `/api/browse` `/api/episodes` `/api/trailer` `/api/recommendations` | JSON endpoints used by the client |

Locales are path-prefixed: `/pt`, `/es`, `/de`, `/fr`, `/ru`, `/tr`, `/id`, `/it`. English is the default; every locale carries the full catalog (410 keys), and English still backs any key you add later.

## Playback

The player is a shell. It ships with **no stream providers**: the server picker is empty and the player falls back to the official trailer. To connect a licensed source, register it in `src/lib/sources.ts`; each entry becomes a selectable server.

## Downloads

The title page has a Download dialog (quality, subtitle language, and a rolling 5-per-24-hours allowance). It stays empty until a registered source implements the optional `downloads()` hook in `src/lib/sources.ts`.

## Local-only state

Profiles (with avatar, interests and a salted-hash PIN), lists, history, recent searches and watch-party rooms are stored in `localStorage` (see `src/lib/store.tsx`, `src/lib/lists.ts` and `src/lib/rooms.ts`). There is no backend, so cross-device sign-in, QR login, email recovery and device management are intentionally not part of this project. Swap those modules to sync across devices.

## Project layout

```
src/
  pages/            Next.js pages router (i18n via next.config.ts)
  components/
    layout/         Header, mobile Dock, Footer, SearchOverlay, Seo
    home/           HomeBanner, Top10, StreamingRail, GenreRail
    media/          MovieCard, ScrollRow, Rail, MovieGrid
    browse/         BrowseMiniHero, PosterMarquee, FilterBar
    watch/          WatchHero, Player, Episodes, CastRail, AboutSection
    auth/           AuthModal, ProfileMenu, AuthWall, ProfileWizard, PinPad, PinDialog, Avatar
    errors/         NoSignal (404/500)
    ui/             Button, SectionHeader, Toast, BrandMark, BrandLoader
  lib/              tmdb client, data layer with fixture fallback, store, i18n
  data/fixtures/    Offline snapshot used when no TMDB key is configured
messages/           Translations per locale
```
