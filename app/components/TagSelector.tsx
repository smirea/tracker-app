import React, { useState, useMemo } from 'react';
import { FlatList, Pressable } from 'react-native';
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Input, InputField } from '@/components/ui/input';
import { Button, ButtonText } from '@/components/ui/button';
import type { Tag } from '@db/schema';

interface TagSelectorProps {
  tags: Tag[];
  selectedTags: Tag[];
  onTagSelect: (tag: Tag) => void;
  onTagDeselect: (tag: Tag) => void;
  onCreateTag: (name: string) => Promise<Tag>;
}

export function TagSelector({
  tags,
  selectedTags,
  onTagSelect,
  onTagDeselect,
  onCreateTag,
}: TagSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  // Filter and sort tags by name
  const filteredTags = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) {
      return [...tags].sort((a, b) => a.name.localeCompare(b.name));
    }
    return tags
      .filter((tag) => tag.name.toLowerCase().includes(query))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [tags, searchQuery]);

  // Check if exact match exists
  const exactMatchExists = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    return tags.some((tag) => tag.name.toLowerCase() === query);
  }, [tags, searchQuery]);

  // Check if tag is selected
  const isSelected = (tag: Tag) => {
    return selectedTags.some((t) => t.id === tag.id);
  };

  // Handle tag press
  const handleTagPress = (tag: Tag) => {
    if (isSelected(tag)) {
      onTagDeselect(tag);
    } else {
      onTagSelect(tag);
    }
  };

  // Handle create new tag
  const handleCreateTag = async () => {
    const name = searchQuery.trim();
    if (!name || exactMatchExists || isCreating) return;

    setIsCreating(true);
    try {
      const newTag = await onCreateTag(name);
      onTagSelect(newTag);
      setSearchQuery('');
    } finally {
      setIsCreating(false);
    }
  };

  const showCreateButton = searchQuery.trim() && !exactMatchExists;

  return (
    <VStack space="md" className="flex-1">
      {/* Search/Create Input */}
      <Input size="md" variant="outline">
        <InputField
          placeholder="Search or create tag..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </Input>

      {/* Create Button */}
      {showCreateButton && (
        <Button
          action="primary"
          size="sm"
          onPress={handleCreateTag}
          disabled={isCreating}
        >
          <ButtonText>
            {isCreating ? 'Creating...' : `Create "${searchQuery.trim()}"`}
          </ButtonText>
        </Button>
      )}

      {/* Selected Tags */}
      {selectedTags.length > 0 && (
        <VStack space="sm">
          <Text className="text-sm font-medium text-typography-500">
            Selected ({selectedTags.length})
          </Text>
          <HStack space="sm" className="flex-wrap">
            {selectedTags.map((tag) => (
              <Pressable
                key={tag.id}
                onPress={() => onTagDeselect(tag)}
                className="bg-primary-500 px-3 py-1.5 rounded-full mb-2"
              >
                <Text className="text-sm text-typography-0">{tag.name} ×</Text>
              </Pressable>
            ))}
          </HStack>
        </VStack>
      )}

      {/* Tags List */}
      <VStack space="sm" className="flex-1">
        <Text className="text-sm font-medium text-typography-500">
          {searchQuery.trim() ? 'Matching Tags' : 'All Tags'}
        </Text>
        {filteredTags.length === 0 ? (
          <Text className="text-sm text-typography-400 italic">
            {searchQuery.trim()
              ? 'No matching tags found'
              : 'No tags yet. Type above to create one.'}
          </Text>
        ) : (
          <FlatList
            data={filteredTags}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => {
              const selected = isSelected(item);
              return (
                <Pressable
                  onPress={() => handleTagPress(item)}
                  className={`px-3 py-2.5 rounded mb-1 ${
                    selected
                      ? 'bg-primary-100 border border-primary-500'
                      : 'bg-background-50 border border-outline-200'
                  }`}
                >
                  <HStack className="justify-between items-center">
                    <Text
                      className={`text-base ${
                        selected
                          ? 'text-primary-700 font-medium'
                          : 'text-typography-900'
                      }`}
                    >
                      {item.name}
                    </Text>
                    {selected && (
                      <Text className="text-primary-500 text-sm">✓</Text>
                    )}
                  </HStack>
                </Pressable>
              );
            }}
            showsVerticalScrollIndicator={false}
          />
        )}
      </VStack>
    </VStack>
  );
}
