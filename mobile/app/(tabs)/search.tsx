import React, { useMemo, useState } from 'react';
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { api } from '@/api';
import ChoiceChip from '@/components/ChoiceChip';
import EmptyState from '@/components/EmptyState';
import RecipeCard from '@/components/RecipeCard';
import SearchRow from '@/components/SearchRow';
import { SkeletonGrid } from '@/components/Skeleton';
import { colors } from '@/theme';
import type { Page, Recipe, RecipeCategory, SmartSearchResponse } from '@/types';

const CATEGORIES: { label: string; value: RecipeCategory }[] = [
  { label: 'Local', value: 'LOCAL' },
  { label: 'Continental', value: 'CONTINENTAL' },
  { label: 'Foreign', value: 'FOREIGN' },
  { label: 'Drinks', value: 'DRINK' },
];

const CALORIE_CHIPS = [
  { label: 'Under 400 kcal', value: 400 },
  { label: 'Under 600 kcal', value: 600 },
];
const TIME_CHIPS = [
  { label: 'Under 30 min', value: 30 },
  { label: 'Under 60 min', value: 60 },
];

export default function Search() {
  const insets = useSafeAreaInsets();
  const [input, setInput] = useState('');
  const [smartQuery, setSmartQuery] = useState('');
  const [category, setCategory] = useState<RecipeCategory | null>(null);
  const [maxCalories, setMaxCalories] = useState<number | null>(null);
  const [maxMinutes, setMaxMinutes] = useState<number | null>(null);

  // Smart natural-language search when a query is submitted
  const smart = useQuery({
    queryKey: ['smart-search', smartQuery],
    queryFn: () => api.get<SmartSearchResponse>('/search/smart', { q: smartQuery }),
    enabled: smartQuery.length > 0,
  });

  // Standard filtered browse otherwise
  const browse = useQuery({
    queryKey: ['recipes', category, maxCalories, maxMinutes],
    queryFn: () =>
      api.get<Page<Recipe>>('/recipes', {
        category: category ?? undefined,
        maxCalories: maxCalories ?? undefined,
        maxMinutes: maxMinutes ?? undefined,
        page: 0,
        size: 30,
      }),
    enabled: smartQuery.length === 0,
  });

  const smartMode = smartQuery.length > 0;
  const loading = smartMode ? smart.isLoading : browse.isLoading;
  const recipes = smartMode ? smart.data?.recipes ?? [] : browse.data?.content ?? [];

  const parsedChips = useMemo(() => {
    const f = smart.data?.filters;
    if (!smartMode || !f) return [];
    const chips: { key: string; label: string }[] = [];
    if (f.q) chips.push({ key: 'q', label: `“${f.q}”` });
    if (f.category) chips.push({ key: 'category', label: f.category.toLowerCase() });
    if (f.cuisine) chips.push({ key: 'cuisine', label: f.cuisine });
    if (f.maxCalories) chips.push({ key: 'maxCalories', label: `≤ ${f.maxCalories} kcal` });
    if (f.maxMinutes) chips.push({ key: 'maxMinutes', label: `≤ ${f.maxMinutes} min` });
    return chips;
  }, [smart.data, smartMode]);

  const submit = () => setSmartQuery(input.trim());

  const clearSmart = () => {
    setSmartQuery('');
    setInput('');
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, paddingTop: insets.top + 10 }}>
      <View style={styles.searchWrap}>
        <SearchRow
          value={input}
          onChangeText={setInput}
          onSubmit={submit}
          placeholder="Try “fast Ghanaian meals under 30 min”"
        />
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={smartMode ? smart.isRefetching : browse.isRefetching}
            onRefresh={() => (smartMode ? smart.refetch() : browse.refetch())}
            tintColor={colors.brandDark}
          />
        }
        keyboardShouldPersistTaps="handled"
      >
        {smartMode ? (
          <View style={styles.chipsRow}>
            {parsedChips.map((chip) => (
              <ChoiceChip key={chip.key} label={chip.label} selected onRemove={clearSmart} />
            ))}
            {parsedChips.length > 0 ? (
              <ChoiceChip label="Clear" onPress={clearSmart} />
            ) : null}
          </View>
        ) : (
          <>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.chipsRowScroll}
            >
              {CATEGORIES.map((c) => (
                <ChoiceChip
                  key={c.value}
                  label={c.label}
                  selected={category === c.value}
                  onPress={() => setCategory(category === c.value ? null : c.value)}
                />
              ))}
            </ScrollView>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.chipsRowScroll}
            >
              {CALORIE_CHIPS.map((c) => (
                <ChoiceChip
                  key={c.label}
                  label={c.label}
                  selected={maxCalories === c.value}
                  onPress={() => setMaxCalories(maxCalories === c.value ? null : c.value)}
                />
              ))}
              {TIME_CHIPS.map((c) => (
                <ChoiceChip
                  key={c.label}
                  label={c.label}
                  selected={maxMinutes === c.value}
                  onPress={() => setMaxMinutes(maxMinutes === c.value ? null : c.value)}
                />
              ))}
            </ScrollView>
          </>
        )}

        <View style={styles.results}>
          {loading ? (
            <SkeletonGrid count={6} />
          ) : recipes.length === 0 ? (
            <EmptyState
              image={2}
              message={
                smartMode
                  ? 'No dishes matched that search. Try different words — or fewer filters.'
                  : 'No recipes match these filters yet.'
              }
              actionLabel="Clear search"
              onAction={() => {
                clearSmart();
                setCategory(null);
                setMaxCalories(null);
                setMaxMinutes(null);
              }}
            />
          ) : (
            <View style={styles.grid}>
              {recipes.map((recipe, i) => (
                <Animated.View
                  key={recipe.id}
                  entering={FadeInDown.delay(i * 50).duration(320)}
                  style={styles.gridCell}
                >
                  <RecipeCard recipe={recipe} />
                </Animated.View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  searchWrap: { paddingHorizontal: 20, marginBottom: 14 },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  chipsRowScroll: { paddingHorizontal: 20, gap: 8, marginBottom: 10, paddingBottom: 2 },
  results: { paddingHorizontal: 20, paddingTop: 8 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 14 },
  gridCell: { width: '47%', flexGrow: 1 },
});
