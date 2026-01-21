import { Platform } from "react-native";
import * as schema from "@db/schema";

// Database client - uses real database on all platforms
// Native: expo-sqlite (local, offline-first)
// Web: libsql client connecting to Turso server (requires server running)

let db: any;
let expo: any;

if (Platform.OS !== "web") {
  // Native: use expo-sqlite with drizzle
  const SQLite = require("expo-sqlite");
  const { drizzle } = require("drizzle-orm/expo-sqlite");
  expo = SQLite.openDatabaseSync("tracker.db");
  db = drizzle(expo, { schema });
} else {
  // Web: use libsql web client with Turso server (HTTP-based, no native bindings)
  const { createClient } = require("@libsql/client/web");
  const { drizzle } = require("drizzle-orm/libsql/web");

  // Connect to Turso dev server (turso dev --db-file local.db --port 8080)
  // In production, use TURSO_DATABASE_URL environment variable
  const tursoUrl = process.env.EXPO_PUBLIC_TURSO_URL || "http://127.0.0.1:8080";
  const tursoToken = process.env.EXPO_PUBLIC_TURSO_AUTH_TOKEN;

  console.log(`[DB] Running on web - connecting to Turso at ${tursoUrl}`);

  const client = createClient({
    url: tursoUrl,
    authToken: tursoToken,
  });

  db = drizzle(client, { schema });
  expo = null;
}

export { db, expo };
