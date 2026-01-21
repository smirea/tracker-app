import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

// Main entries table - each "post" in the personal tracking app
export const entries = sqliteTable("entries", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  content: text("content"), // optional text memo
  energyLevel: integer("energy_level"), // 1-10 scale
  moodLevel: integer("mood_level"), // 1-10 scale
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  // Location data
  latitude: real("latitude"),
  longitude: real("longitude"),
  locationName: text("location_name"), // reverse geocoded name
  // Sync status for offline support
  syncedAt: integer("synced_at", { mode: "timestamp" }),
  localId: text("local_id").notNull().unique(), // UUID for offline creation
});

// Tags table - reusable tags for entries
export const tags = sqliteTable("tags", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull().unique(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});

// Junction table for entries and tags (many-to-many)
export const entryTags = sqliteTable("entry_tags", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  entryId: integer("entry_id").notNull().references(() => entries.id, { onDelete: "cascade" }),
  tagId: integer("tag_id").notNull().references(() => tags.id, { onDelete: "cascade" }),
});

// Media attachments (images, voice memos)
export const media = sqliteTable("media", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  entryId: integer("entry_id").notNull().references(() => entries.id, { onDelete: "cascade" }),
  type: text("type").notNull(), // 'image' | 'voice'
  uri: text("uri").notNull(), // local file path
  remoteUrl: text("remote_url"), // synced cloud URL
  duration: integer("duration"), // for voice memos, in seconds
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  syncedAt: integer("synced_at", { mode: "timestamp" }),
});

// Types for TypeScript
export type Entry = typeof entries.$inferSelect;
export type NewEntry = typeof entries.$inferInsert;
export type Tag = typeof tags.$inferSelect;
export type NewTag = typeof tags.$inferInsert;
export type Media = typeof media.$inferSelect;
export type NewMedia = typeof media.$inferInsert;
