import React from 'react';
import { Pressable } from 'react-native';
import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';

interface EnergySliderProps {
  value: number | null;
  onChange: (value: number | null) => void;
}

const ENERGY_LEVELS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const;

export function EnergySlider({ value, onChange }: EnergySliderProps) {
  const handlePress = (level: number) => {
    // If same value is pressed, deselect it
    if (value === level) {
      onChange(null);
    } else {
      onChange(level);
    }
  };

  const getBackgroundColor = (level: number, isSelected: boolean) => {
    if (!isSelected) return 'bg-background-100';
    // Gradient from red (low energy) to green (high energy)
    if (level <= 3) return 'bg-error-500';
    if (level <= 5) return 'bg-warning-500';
    if (level <= 7) return 'bg-info-500';
    return 'bg-success-500';
  };

  return (
    <VStack space="xs">
      <HStack className="justify-between items-center">
        <Text className="text-sm font-medium text-typography-700">Energy Level</Text>
        {value !== null && (
          <Text className="text-sm text-typography-500">{value}/10</Text>
        )}
      </HStack>
      <HStack space="xs" className="justify-between">
        {ENERGY_LEVELS.map((level) => {
          const isSelected = value === level;
          const isFilled = value !== null && level <= value;
          return (
            <Pressable
              key={level}
              onPress={() => handlePress(level)}
              className={`flex-1 aspect-square rounded items-center justify-center ${
                isFilled ? getBackgroundColor(level, true) : 'bg-background-100'
              }`}
            >
              <Text
                className={`text-xs font-medium ${
                  isFilled ? 'text-typography-0' : 'text-typography-500'
                }`}
              >
                {level}
              </Text>
            </Pressable>
          );
        })}
      </HStack>
      <HStack className="justify-between">
        <Text className="text-xs text-typography-400">Low</Text>
        <Text className="text-xs text-typography-400">High</Text>
      </HStack>
    </VStack>
  );
}
