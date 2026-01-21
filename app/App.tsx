import { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, SafeAreaView, FlatList, Platform } from "react-native";
import { db } from "./db/client";

// Conditionally import migrations only for native
// Web uses Turso server which has schema pushed via drizzle-kit
const useMigrationsCompat = () => {
  if (Platform.OS === "web") {
    // Web connects to Turso server - schema is managed via drizzle-kit push
    return { success: true, error: null };
  }
  // Native: use expo-sqlite migrations
  const { useMigrations } = require("drizzle-orm/expo-sqlite/migrator");
  const migrations = require("../db/migrations/migrations").default;
  return useMigrations(db, migrations);
};

import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { Box } from "@/components/ui/box";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { Button, ButtonText } from "@/components/ui/button";
import { TagSelector } from "@/components/TagSelector";
import { EnergySlider } from "@/components/EnergySlider";
import { MoodSlider } from "@/components/MoodSlider";
import { useTags } from "@/hooks/useTags";
import { useEntries, type EntryWithTags } from "@/hooks/useEntries";
import { useLocation } from "@/hooks/useLocation";
import type { Tag } from "@db/schema";
import "@/global.css";

export default function App() {
  const { success, error: migrationError } = useMigrationsCompat();
  const { tags, isLoading: tagsLoading, createTag } = useTags();
  const { entries, isLoading: entriesLoading, createEntry, refresh: refreshEntries } = useEntries();
  const { getCurrentLocation, isLoading: locationLoading, hasPermission } = useLocation();
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [energyLevel, setEnergyLevel] = useState<number | null>(null);
  const [moodLevel, setMoodLevel] = useState<number | null>(null);
  const [showTagSelector, setShowTagSelector] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const handleTagSelect = (tag: Tag) => {
    setSelectedTags((prev) => [...prev, tag]);
  };

  const handleTagDeselect = (tag: Tag) => {
    setSelectedTags((prev) => prev.filter((t) => t.id !== tag.id));
  };

  const handleLogEntry = async () => {
    setIsCreating(true);
    try {
      const location = await getCurrentLocation();
      await createEntry({
        tagIds: selectedTags.map((t) => t.id),
        energyLevel: energyLevel ?? undefined,
        moodLevel: moodLevel ?? undefined,
        latitude: location?.latitude,
        longitude: location?.longitude,
        locationName: location?.locationName,
      });
      setSelectedTags([]);
      setEnergyLevel(null);
      setMoodLevel(null);
    } finally {
      setIsCreating(false);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  if (migrationError) {
    return (
      <GluestackUIProvider mode="dark">
        <Box className="flex-1 items-center justify-center bg-background-0 p-5">
          <Text className="text-error-500 text-center">
            Migration error: {migrationError.message}
          </Text>
          <StatusBar style="auto" />
        </Box>
      </GluestackUIProvider>
    );
  }

  if (!success || tagsLoading) {
    return (
      <GluestackUIProvider mode="dark">
        <Box className="flex-1 items-center justify-center bg-background-0 p-5">
          <ActivityIndicator size="large" color="#007AFF" />
          <Text className="mt-4 text-typography-500">Setting up database...</Text>
          <StatusBar style="auto" />
        </Box>
      </GluestackUIProvider>
    );
  }

  return (
    <GluestackUIProvider mode="dark">
      <SafeAreaView style={{ flex: 1 }}>
        <Box className="flex-1 bg-background-0 p-5">
          <VStack space="lg" className="flex-1">
            <HStack className="items-center justify-between">
              <Text className="text-2xl font-bold text-typography-900">Tracker</Text>
              {showTagSelector && (
                <Button
                  action="secondary"
                  variant="outline"
                  size="sm"
                  onPress={() => setShowTagSelector(false)}
                >
                  <ButtonText>Done</ButtonText>
                </Button>
              )}
            </HStack>

            {showTagSelector ? (
              <TagSelector
                tags={tags}
                selectedTags={selectedTags}
                onTagSelect={handleTagSelect}
                onTagDeselect={handleTagDeselect}
                onCreateTag={createTag}
              />
            ) : (
              <VStack space="md" className="flex-1">
                {/* New entry section */}
                <Box className="bg-background-50 p-4 rounded-lg">
                  <VStack space="sm">
                    <Text className="text-typography-700 font-medium">New Entry</Text>

                    <EnergySlider value={energyLevel} onChange={setEnergyLevel} />

                    <MoodSlider value={moodLevel} onChange={setMoodLevel} />

                    {selectedTags.length > 0 ? (
                      <HStack space="sm" className="flex-wrap">
                        {selectedTags.map((tag) => (
                          <Box
                            key={tag.id}
                            className="bg-primary-500 px-3 py-1 rounded-full mb-1"
                          >
                            <Text className="text-sm text-typography-0">{tag.name}</Text>
                          </Box>
                        ))}
                      </HStack>
                    ) : (
                      <Text className="text-typography-400 text-sm">No tags selected</Text>
                    )}

                    <HStack space="sm" className="mt-2">
                      <Button
                        action="secondary"
                        variant="outline"
                        size="sm"
                        onPress={() => setShowTagSelector(true)}
                      >
                        <ButtonText>{selectedTags.length > 0 ? "Edit Tags" : "Add Tags"}</ButtonText>
                      </Button>

                      <Button
                        action="primary"
                        size="sm"
                        onPress={handleLogEntry}
                        isDisabled={isCreating || locationLoading}
                        testID="log-entry-button"
                      >
                        <ButtonText>
                          {isCreating ? "Logging..." : "Log Entry"}
                        </ButtonText>
                      </Button>
                    </HStack>

                    {hasPermission === false && (
                      <Text className="text-warning-500 text-xs mt-1">
                        Location permission denied - entries will be saved without location
                      </Text>
                    )}
                  </VStack>
                </Box>

                {/* Recent entries */}
                <VStack space="sm" className="flex-1">
                  <Text className="text-typography-700 font-medium">Recent Entries</Text>

                  {entriesLoading ? (
                    <ActivityIndicator size="small" color="#007AFF" />
                  ) : entries.length === 0 ? (
                    <Text className="text-typography-400 text-sm">No entries yet</Text>
                  ) : (
                    <FlatList
                      data={entries}
                      keyExtractor={(item) => item.localId}
                      renderItem={({ item }) => (
                        <Box className="bg-background-50 p-3 rounded-lg mb-2">
                          <HStack className="justify-between items-start">
                            <VStack space="xs" className="flex-1">
                              <HStack space="sm" className="items-center">
                                <Text className="text-typography-500 text-xs">
                                  {formatDate(item.createdAt)}
                                </Text>
                                {item.energyLevel !== null && (
                                  <Box
                                    className={`px-2 py-0.5 rounded ${
                                      item.energyLevel <= 3
                                        ? 'bg-error-500'
                                        : item.energyLevel <= 5
                                        ? 'bg-warning-500'
                                        : item.energyLevel <= 7
                                        ? 'bg-info-500'
                                        : 'bg-success-500'
                                    }`}
                                  >
                                    <Text className="text-xs text-typography-0 font-medium">
                                      E:{item.energyLevel}
                                    </Text>
                                  </Box>
                                )}
                                {item.moodLevel !== null && (
                                  <Box
                                    className={`px-2 py-0.5 rounded ${
                                      item.moodLevel <= 3
                                        ? 'bg-purple-500'
                                        : item.moodLevel <= 5
                                        ? 'bg-indigo-500'
                                        : item.moodLevel <= 7
                                        ? 'bg-amber-500'
                                        : 'bg-orange-500'
                                    }`}
                                  >
                                    <Text className="text-xs text-typography-0 font-medium">
                                      M:{item.moodLevel}
                                    </Text>
                                  </Box>
                                )}
                              </HStack>
                              {item.locationName && (
                                <Text className="text-typography-400 text-xs">
                                  {item.locationName}
                                </Text>
                              )}
                              {item.tags.length > 0 && (
                                <HStack space="xs" className="flex-wrap mt-1">
                                  {item.tags.map((tag) => (
                                    <Box
                                      key={tag.id}
                                      className="bg-primary-600 px-2 py-0.5 rounded-full mb-1"
                                    >
                                      <Text className="text-xs text-typography-0">{tag.name}</Text>
                                    </Box>
                                  ))}
                                </HStack>
                              )}
                            </VStack>
                          </HStack>
                        </Box>
                      )}
                    />
                  )}
                </VStack>
              </VStack>
            )}
          </VStack>
          <StatusBar style="auto" />
        </Box>
      </SafeAreaView>
    </GluestackUIProvider>
  );
}
