# Task
Implement energy level tracking with a slider from 1 (low) to 10 (high) for daily entries.

# Learnings
- energyLevel field already existed in the database schema (db/schema.ts) - no migration needed
- useEntries hook already supported energyLevel in CreateEntryInput type - just needed to wire it up
- Used discrete button approach (1-10) instead of continuous slider - more appropriate for 10 distinct values and simpler implementation
- Color coding (red→yellow→blue→green) provides intuitive visual feedback for energy levels
- Followed same component pattern as TagSelector: separate component file, state managed in App.tsx
- NativeWind allows className on Pressable via its extension of React Native components
