## Project Overview

Personal iOS tracking app for logging daily metrics (energy, tags, memos, images, voice notes) with automatic timestamps and location.

The overview of the project is under @./project/overview.md

There is a file for every feature implemented under @./project with additional context for that feature

## Tech Stack

- **Runtime**: Bun (not Node.js)
- **Framework**: Expo (React Native)
- **UI**: gluestack-ui with NativeWind (Tailwind CSS)
- **Database**: expo-sqlite with Drizzle ORM
- **Cloud Sync**: Turso (optional, for remote sync)

## Conventions

- Use Bun APIs over Node.js equivalents
- Offline-first: all data stored locally in SQLite
- Migrations run automatically on app start via `useMigrations` hook
- Location and timestamp added automatically to entries
- Use gluestack-ui components with Tailwind classes for styling
- Add new UI components: `npx gluestack-ui add --use-bun <component>`
- Use `testID=<id>` tags on components as you add them to make testing easier
