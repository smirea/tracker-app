# Task
Implement mood tracking with a slider from 1 to 10, following the same pattern as energy levels.

# Learnings
- Followed exact same pattern as EnergySlider - schema field, hook update, new component, App.tsx integration
- Used different color scheme for mood: purple (low) → indigo → amber → orange (high) to visually distinguish from energy
- Changed entry display format from "7/10" to "E:7" and "M:8" to fit both badges on one line
- Added testID attributes to Pressable components for easier browser testing via JavaScript clicks
- React Native Web maps testID to data-testid attribute in the DOM
