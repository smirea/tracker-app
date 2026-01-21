# Tracker

A personal tracking app for iOS built with Expo, using SQLite for offline-first storage with optional Turso cloud sync.

## Prerequisites

- [Bun](https://bun.sh) - JavaScript runtime and package manager
- [Expo Go](https://expo.dev/go) - Install on your iPhone from the App Store
- [Turso CLI](https://docs.turso.tech/cli/installation) (optional, for cloud sync)

### Install Bun

```bash
curl -fsSL https://bun.sh/install | bash
```

### Install Turso CLI

```bash
brew install tursodatabase/tap/turso
```

## Project Setup

1. Clone the repository:

```bash
cd tracker
```

2. Install dependencies:

```bash
bun install
cd app && bun install
```

3. Generate database migrations (if schema changes):

```bash
# From tracker root
bun run db:generate
```

## Running the App

Start the Expo development server:

```bash
cd app
bun run start
```

Scan the QR code with your iPhone camera to open in Expo Go.

### Other run commands

```bash
bun run ios      # Run on iOS simulator
bun run android  # Run on Android emulator
bun run web      # Run in web browser
```

## Database

The app uses SQLite locally via `expo-sqlite` for offline-first functionality. The schema is managed with Drizzle ORM.

### Schema Overview

- **entries** - Main tracking entries (content, energy level, location, timestamps)
- **tags** - Reusable tags for categorization
- **entry_tags** - Links entries to tags
- **media** - Attachments (images, voice memos)

### Drizzle Studio

View and edit your database (from tracker root):

```bash
bun run db:studio
```

## Cloud Sync (Optional)

For syncing data to a remote Turso database:

1. Create a Turso database:

```bash
turso db create tracker
```

2. Get your credentials:

```bash
turso db show tracker --url
turso db tokens create tracker
```

3. Create `.env` in the root directory:

```bash
cp .env.example .env
```

4. Add your credentials to `.env`:

```
TURSO_DATABASE_URL=libsql://tracker-yourname.turso.io
TURSO_AUTH_TOKEN=your-auth-token
```

### Local Turso Development

Run a local Turso server for development:

```bash
turso dev --db-file local.db
```

This starts a server at `http://127.0.0.1:8080`.

## Project Structure

```
tracker/
├── db/                      # Shared database layer (single source of truth)
│   ├── schema.ts            # Database schema definitions
│   └── migrations/          # Generated Drizzle migrations
├── app/                     # Expo mobile app
│   ├── App.tsx              # Main application entry
│   ├── components/ui/       # gluestack-ui components
│   ├── db/
│   │   └── client.ts        # expo-sqlite client
│   ├── global.css           # Tailwind CSS entry
│   ├── tailwind.config.js   # Tailwind configuration
│   └── package.json
├── server/                  # Server scripts/tooling
│   └── db/
│       └── client.ts        # @libsql/client for Turso
├── drizzle.config.ts        # Drizzle configuration
└── package.json             # Root package with db scripts
```

## Tech Stack

- **Runtime**: [Bun](https://bun.sh)
- **Framework**: [Expo](https://expo.dev) (React Native)
- **UI**: [gluestack-ui](https://gluestack.io) with NativeWind (Tailwind CSS)
- **Database**: [SQLite](https://docs.expo.dev/versions/latest/sdk/sqlite/) via expo-sqlite
- **ORM**: [Drizzle](https://orm.drizzle.team)
- **Cloud Sync**: [Turso](https://turso.tech) (optional)
