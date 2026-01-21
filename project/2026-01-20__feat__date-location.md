# Task
Implement automatic date and location capture for each interaction/entry. When users create an entry, the app should automatically capture the current timestamp and GPS coordinates.

# Plan
1. Create `useEntries` hook for entry CRUD operations
2. Create `useLocation` hook to get current GPS coordinates
3. Update App.tsx to allow creating entries with automatic date/location
4. Add UI to show recent entries

# Learnings
- Schema already has `createdAt` (defaults to now), `latitude`, `longitude`, `locationName` fields ready
- Need to use `expo-location` for GPS access
- `localId` field exists for offline-first UUID generation
- Pre-existing TS type errors due to dual drizzle-orm installations (root + app). Runtime works fine but TypeScript complains about type mismatches. This is a known configuration issue to address separately.
