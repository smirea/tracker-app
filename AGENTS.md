# Agents

## Project Overview

Personal iOS tracking app for logging daily metrics (energy, tags, memos, images, voice notes) with automatic timestamps and location.

## Tech Stack

- **Runtime**: Bun (not Node.js)
- **Framework**: Expo (React Native)
- **UI**: gluestack-ui with NativeWind (Tailwind CSS)
- **Database**: expo-sqlite with Drizzle ORM
- **Cloud Sync**: Turso (optional, for remote sync)

## Commands

```bash
# From tracker root
bun install          # Install root dependencies
bun run db:generate  # Generate migrations after schema changes
bun run db:studio    # Open Drizzle Studio

# From tracker/app
bun install          # Install app dependencies
bun run start        # Start Expo dev server
```

## Key Files

- `db/schema.ts` - Database schema (single source of truth)
- `db/migrations/` - Generated Drizzle migrations
- `app/db/client.ts` - Expo app's Drizzle client (expo-sqlite)
- `server/db/client.ts` - Server's Drizzle client (@libsql/client)
- `drizzle.config.ts` - Drizzle configuration (root level)

## Conventions

- Use Bun APIs over Node.js equivalents
- Offline-first: all data stored locally in SQLite
- Migrations run automatically on app start via `useMigrations` hook
- Location and timestamp added automatically to entries
- Use gluestack-ui components with Tailwind classes for styling
- Add new UI components: `npx gluestack-ui add --use-bun <component>`
