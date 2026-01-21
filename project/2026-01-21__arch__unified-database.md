# Task
Remove mock database and use proper database (Turso/libsql) on all platforms including web. Eliminate platform-specific special cases in database code.

# Learnings
- `@libsql/client` has multiple entry points: `/web` for browser, default for Node.js
- `drizzle-orm/libsql` also has `/web` variant that must be used in browser (`drizzle-orm/libsql/web`)
- Using the wrong drizzle import (`drizzle-orm/libsql` instead of `drizzle-orm/libsql/web`) causes "Neon: unsupported system: undefined" error because it tries to load native bindings
- Web mode connects to Turso server via HTTP, native mode uses local expo-sqlite
- Migrations: native uses `drizzle-orm/expo-sqlite/migrator`, web relies on schema being pushed to Turso via `drizzle-kit push`
- Environment variable for web Turso URL uses `EXPO_PUBLIC_` prefix to be bundled for client-side
