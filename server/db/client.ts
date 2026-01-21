import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "../../db/schema";

// For local development with Turso CLI: turso dev --db-file local.db
// For production: use TURSO_DATABASE_URL and TURSO_AUTH_TOKEN

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL ?? "http://127.0.0.1:8080",
  authToken: process.env.TURSO_AUTH_TOKEN,
});

export const db = drizzle(turso, { schema });
