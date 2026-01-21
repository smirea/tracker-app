import { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, SafeAreaView } from "react-native";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { db } from "./db/client";
import migrations from "../db/migrations/migrations";

import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { Box } from "@/components/ui/box";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { Button, ButtonText } from "@/components/ui/button";
import { TagSelector } from "@/components/TagSelector";
import { useTags } from "@/hooks/useTags";
import type { Tag } from "../db/schema";
import "@/global.css";

export default function App() {
  const { success, error: migrationError } = useMigrations(db, migrations);
  const { tags, isLoading: tagsLoading, createTag } = useTags();
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [showTagSelector, setShowTagSelector] = useState(false);

  const handleTagSelect = (tag: Tag) => {
    setSelectedTags((prev) => [...prev, tag]);
  };

  const handleTagDeselect = (tag: Tag) => {
    setSelectedTags((prev) => prev.filter((t) => t.id !== tag.id));
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
              <VStack space="md" className="flex-1 justify-center items-center">
                <Text className="text-typography-500">
                  {selectedTags.length > 0
                    ? `${selectedTags.length} tag(s) selected`
                    : "No tags selected"}
                </Text>

                <HStack space="md" className="mt-4">
                  <Button action="primary" size="md" onPress={() => setShowTagSelector(true)}>
                    <ButtonText>Select Tags</ButtonText>
                  </Button>
                </HStack>

                {selectedTags.length > 0 && (
                  <HStack space="sm" className="flex-wrap mt-4 justify-center">
                    {selectedTags.map((tag) => (
                      <Box
                        key={tag.id}
                        className="bg-primary-500 px-3 py-1.5 rounded-full mb-2"
                      >
                        <Text className="text-sm text-typography-0">{tag.name}</Text>
                      </Box>
                    ))}
                  </HStack>
                )}
              </VStack>
            )}
          </VStack>
          <StatusBar style="auto" />
        </Box>
      </SafeAreaView>
    </GluestackUIProvider>
  );
}
