# Task
Setup Turso for local development so the server can use a local Turso instance instead of requiring the production database.

# Learnings
- Turso CLI v1.0.15 already installed
- Current app uses expo-sqlite on native, mock db on web
- Server uses @libsql/client pointing to http://127.0.0.1:8080 by default
- `turso dev --db-file ./local.db --port 8080` starts local SQLite-compatible server with persistence
- drizzle-kit can push schema to Turso with `--dialect turso` (not sqlite!)
- needed to install @libsql/client at root level for drizzle-kit push to work
- server/db/client.ts already defaults to localhost:8080 when TURSO_DATABASE_URL is not set
