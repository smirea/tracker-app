import * as SQLite from "expo-sqlite";
import { drizzle } from "drizzle-orm/expo-sqlite";
import * as schema from "../../db/schema";

// Open database synchronously for use with Drizzle
const expo = SQLite.openDatabaseSync("tracker.db");

// Create Drizzle instance with schema for relational queries
export const db = drizzle(expo, { schema });

export { expo };
