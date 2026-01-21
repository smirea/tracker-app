import { StatusBar } from "expo-status-bar";
import { ActivityIndicator } from "react-native";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { db } from "./db/client";
import migrations from "../db/migrations/migrations";

import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { Box } from "@/components/ui/box";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { Button, ButtonText } from "@/components/ui/button";
import "@/global.css";

export default function App() {
  const { success, error } = useMigrations(db, migrations);

  if (error) {
    return (
      <GluestackUIProvider mode="dark">
        <Box className="flex-1 items-center justify-center bg-background-0 p-5">
          <Text className="text-error-500 text-center">
            Migration error: {error.message}
          </Text>
          <StatusBar style="auto" />
        </Box>
      </GluestackUIProvider>
    );
  }

  if (!success) {
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
      <Box className="flex-1 items-center justify-center bg-background-0 p-5">
        <VStack space="lg" className="items-center">
          <Text className="text-4xl font-bold text-typography-900">Tracker</Text>
          <Text className="text-typography-500">Database ready!</Text>

          <HStack space="md" className="mt-6">
            <Button action="primary" size="md">
              <ButtonText>New Entry</ButtonText>
            </Button>
            <Button action="secondary" variant="outline" size="md">
              <ButtonText>View All</ButtonText>
            </Button>
          </HStack>
        </VStack>
        <StatusBar style="auto" />
      </Box>
    </GluestackUIProvider>
  );
}
