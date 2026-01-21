import { useState, useEffect, useCallback } from 'react';
import { db } from '@/db/client';
import { tags } from '@db/schema';
import type { Tag, NewTag } from '@db/schema';
import { eq, asc } from 'drizzle-orm';

export function useTags() {
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Load all tags sorted by name
  const loadTags = useCallback(async () => {
    try {
      setIsLoading(true);
      const result = await db.select().from(tags).orderBy(asc(tags.name));
      setAllTags(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load tags'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Create a new tag
  const createTag = useCallback(async (name: string): Promise<Tag> => {
    const newTag: NewTag = { name: name.trim() };
    const [result] = await db.insert(tags).values(newTag).returning();
    // Update local state
    setAllTags((prev) => [...prev, result].sort((a, b) => a.name.localeCompare(b.name)));
    return result;
  }, []);

  // Delete a tag
  const deleteTag = useCallback(async (tagId: number): Promise<void> => {
    await db.delete(tags).where(eq(tags.id, tagId));
    setAllTags((prev) => prev.filter((t) => t.id !== tagId));
  }, []);

  // Load tags on mount
  useEffect(() => {
    loadTags();
  }, [loadTags]);

  return {
    tags: allTags,
    isLoading,
    error,
    createTag,
    deleteTag,
    refresh: loadTags,
  };
}
