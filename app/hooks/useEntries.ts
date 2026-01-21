import { useState, useEffect, useCallback } from 'react';
import { db } from '@/db/client';
import { entries, entryTags, tags, type Entry, type NewEntry, type Tag } from '@db/schema';
import { eq, desc } from 'drizzle-orm';

export type EntryWithTags = Entry & { tags: Tag[] };

export type CreateEntryInput = {
  content?: string;
  energyLevel?: number;
  latitude?: number;
  longitude?: number;
  locationName?: string;
  tagIds?: number[];
};

export function useEntries() {
  const [allEntries, setAllEntries] = useState<EntryWithTags[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Load all entries with their tags, sorted by most recent first
  const loadEntries = useCallback(async () => {
    try {
      setIsLoading(true);

      // Get all entries
      const entryResults = await db.select().from(entries).orderBy(desc(entries.createdAt));

      // Get all entry-tag relationships with tag data
      const entryTagResults = await db
        .select({
          entryId: entryTags.entryId,
          tag: tags,
        })
        .from(entryTags)
        .innerJoin(tags, eq(entryTags.tagId, tags.id));

      // Group tags by entry
      const tagsByEntry = new Map<number, Tag[]>();
      for (const row of entryTagResults) {
        const existing = tagsByEntry.get(row.entryId) || [];
        existing.push(row.tag);
        tagsByEntry.set(row.entryId, existing);
      }

      // Combine entries with their tags
      const entriesWithTags: EntryWithTags[] = entryResults.map((entry) => ({
        ...entry,
        tags: tagsByEntry.get(entry.id) || [],
      }));

      setAllEntries(entriesWithTags);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load entries'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Create a new entry with optional tags
  const createEntry = useCallback(
    async (input: CreateEntryInput): Promise<EntryWithTags> => {
      const localId = crypto.randomUUID();

      const newEntry: NewEntry = {
        localId,
        content: input.content || null,
        energyLevel: input.energyLevel || null,
        latitude: input.latitude || null,
        longitude: input.longitude || null,
        locationName: input.locationName || null,
      };

      const [result] = await db.insert(entries).values(newEntry).returning();

      // Insert entry-tag relationships if tags provided
      const entryTagsList: Tag[] = [];
      if (input.tagIds && input.tagIds.length > 0) {
        await db.insert(entryTags).values(
          input.tagIds.map((tagId) => ({
            entryId: result.id,
            tagId,
          }))
        );

        // Fetch the tags for this entry
        const tagResults = await db
          .select()
          .from(tags)
          .where(
            eq(
              tags.id,
              input.tagIds[0] // We need an IN query, but drizzle needs inArray
            )
          );
        // Actually, let's just reload to get accurate data
      }

      // Reload to get fresh data with tags
      await loadEntries();

      // Return the created entry (find it in the reloaded list)
      const createdEntry = allEntries.find((e) => e.localId === localId);
      return createdEntry || { ...result, tags: [] };
    },
    [loadEntries, allEntries]
  );

  // Delete an entry
  const deleteEntry = useCallback(
    async (entryId: number): Promise<void> => {
      await db.delete(entries).where(eq(entries.id, entryId));
      setAllEntries((prev) => prev.filter((e) => e.id !== entryId));
    },
    []
  );

  // Load entries on mount
  useEffect(() => {
    loadEntries();
  }, [loadEntries]);

  return {
    entries: allEntries,
    isLoading,
    error,
    createEntry,
    deleteEntry,
    refresh: loadEntries,
  };
}
