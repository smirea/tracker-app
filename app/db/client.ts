import { Platform } from "react-native";
import * as schema from "@db/schema";

// Only import expo-sqlite on native platforms
let db: any;
let expo: any;

if (Platform.OS !== "web") {
  // Native: use expo-sqlite with drizzle
  const SQLite = require("expo-sqlite");
  const { drizzle } = require("drizzle-orm/expo-sqlite");
  expo = SQLite.openDatabaseSync("tracker.db");
  db = drizzle(expo, { schema });
} else {
  // Web: use in-memory mock (for development/testing only)
  console.log("[DB] Running on web - using in-memory mock database");

  // In-memory store
  const store = {
    entries: [] as any[],
    tags: [] as any[],
    entryTags: [] as any[],
    nextId: { entries: 1, tags: 1, entryTags: 1 },
  };

  // Helper to identify table from drizzle table object
  const getTableName = (table: any): string => {
    if (table === schema.tags) return "tags";
    if (table === schema.entries) return "entries";
    if (table === schema.entryTags) return "entryTags";
    return "unknown";
  };

  // Mock drizzle-like interface for web testing
  db = {
    select: (fields?: any) => {
      let selectedFields = fields;
      return {
        from: (table: any) => {
          const tableName = getTableName(table);
          let results = [...(store as any)[tableName]];

          return {
            // Simple orderBy - returns data sorted
            orderBy: (_orderFn: any) => {
              // Sort by createdAt desc for entries, name asc for tags
              if (tableName === "entries") {
                results.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
              } else if (tableName === "tags") {
                results.sort((a, b) => a.name.localeCompare(b.name));
              }
              // Return promise-like (hooks use await)
              return Promise.resolve(results);
            },
            // innerJoin for entry-tags relationship
            innerJoin: (joinTable: any, _condition: any) => {
              const joinTableName = getTableName(joinTable);
              // Handle entryTags -> tags join
              if (tableName === "entryTags" && joinTableName === "tags") {
                const joined = store.entryTags.map((et) => {
                  const tag = store.tags.find((t) => t.id === et.tagId);
                  return tag ? { entryId: et.entryId, tag } : null;
                }).filter(Boolean);
                return Promise.resolve(joined);
              }
              return Promise.resolve([]);
            },
            where: (_condition: any) => ({
              get: () => Promise.resolve(null),
            }),
            // Direct call returns all
            then: (resolve: any) => resolve(results),
          };
        },
      };
    },

    insert: (table: any) => ({
      values: (data: any | any[]) => ({
        returning: () => {
          const tableName = getTableName(table);
          const items = Array.isArray(data) ? data : [data];
          const results: any[] = [];

          for (const item of items) {
            const id = store.nextId[tableName as keyof typeof store.nextId]++;
            const record = {
              ...item,
              id,
              createdAt: item.createdAt || new Date()
            };
            (store as any)[tableName].push(record);
            results.push(record);
          }

          return Promise.resolve(results);
        },
      }),
    }),

    delete: (table: any) => ({
      where: (_condition: any) => {
        // For simplicity, we'd need the actual ID - this is a basic mock
        return Promise.resolve();
      },
    }),
  };

  expo = null;
}

export { db, expo };
