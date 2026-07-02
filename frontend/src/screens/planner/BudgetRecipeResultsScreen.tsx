import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';

type BudgetRecipe = {
  id: string;
  name: string;
  emoji: string;
  cost: number;
  calories: number;
  time: string;
  serves: number;
  tags: string[];
};

const ALL_RECIPES: BudgetRecipe[] = [
  { id: '1', name: 'Kelewele & Beans', emoji: '🍌', cost: 8.5, calories: 520, time: '25 min', serves: 2, tags: ['Vegetarian', 'Quick (<30 min)'] },
  { id: '2', name: 'Jollof Rice (Basic)', emoji: '🍛', cost: 12, calories: 420, time: '45 min', serves: 3, tags: ['Any'] },
  { id: '3', name: 'Grilled Tilapia & Rice', emoji: '🐟', cost: 18, calories: 490, time: '35 min', serves: 2, tags: ['High Protein'] },
  { id: '4', name: 'Waakye Bowl', emoji: '🍚', cost: 10, calories: 580, time: '40 min', serves: 2, tags: ['Any'] },
  { id: '5', name: 'Vegetable Soup & Rice', emoji: '🥦', cost: 9, calories: 430, time: '30 min', serves: 3, tags: ['Vegetarian', 'Quick (<30 min)'] },
  { id: '6', name: 'Akara & Pap', emoji: '🫘', cost: 6, calories: 410, time: '20 min', serves: 2, tags: ['Vegetarian', 'Quick (<30 min)'] },
  { id: '7', name: 'Pepper Soup', emoji: '🫕', cost: 14, calories: 380, time: '50 min', serves: 3, tags: ['High Protein', 'Low Carb'] },
  { id: '8', name: 'Fried Rice & Chicken', emoji: '🍗', cost: 16, calories: 680, time: '40 min', serves: 3, tags: ['High Protein'] },
  { id: '9', name: 'Banku & Okro Stew', emoji: '🥘', cost: 11, calories: 550, time: '55 min', serves: 2, tags: ['Any'] },
  { id: '10', name: 'Oats & Banana Bowl', emoji: '🥣', cost: 5, calories: 320, time: '10 min', serves: 1, tags: ['Vegetarian', 'Quick (<30 min)', 'Low Carb'] },
];

const SORT_OPTIONS = ['Lowest Cost', 'Most Calories', 'Quickest'];

export default function BudgetRecipeResultsScreen({ navigation, route }: any) {
  const { budget = 50, meals = 3, dietFilter = 'Any' } = route.params || {};
  const perMealBudget = meals > 0 ? budget / meals : budget;

  const [sortBy, setSortBy] = useState('Lowest Cost');

  const results = useMemo(() => {
    let filtered = ALL_RECIPES.filter(recipe => {
      if (recipe.cost > perMealBudget) return false;
      if (dietFilter === 'Any') return true;
      return recipe.tags.includes(dietFilter);
    });

    filtered = [...filtered].sort((a, b) => {
      if (sortBy === 'Most Calories') return b.calories - a.calories;
      if (sortBy === 'Quickest') return parseInt(a.time) - parseInt(b.time);
      return a.cost - b.cost;
    });

    return filtered;
  }, [perMealBudget, dietFilter, sortBy]);

  const totalIfAll = results.slice(0, meals).reduce((sum, r) => sum + r.cost, 0);

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 60 }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerTextWrap}>
          <Text style={styles.title}>Budget Recipes</Text>
          <Text style={styles.subtitle}>
            GH₵ {budget} · {meals} meals · ~GH₵ {perMealBudget.toFixed(0)}/meal
          </Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{results.length}</Text>
          <Text style={styles.statLabel}>Matches</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>GH₵ {totalIfAll.toFixed(0)}</Text>
          <Text style={styles.statLabel}>Top {meals} total</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{dietFilter === 'Any' ? 'All' : dietFilter.split(' ')[0]}</Text>
          <Text style={styles.statLabel}>Filter</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Sort by</Text>
      <View style={styles.chipWrap}>
        {SORT_OPTIONS.map(option => (
          <TouchableOpacity
            key={option}
            style={[styles.chip, sortBy === option && styles.chipActive]}
            onPress={() => setSortBy(option)}
          >
            <Text style={[styles.chipText, sortBy === option && styles.chipTextActive]}>
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {results.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyEmoji}>😕</Text>
          <Text style={styles.emptyTitle}>No recipes in budget</Text>
          <Text style={styles.emptyDesc}>
            Try raising your budget or changing the diet filter.
          </Text>
          <TouchableOpacity style={styles.emptyBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.emptyBtnText}>Adjust Budget</Text>
          </TouchableOpacity>
        </View>
      ) : (
        results.map((recipe, index) => (
          <TouchableOpacity
            key={recipe.id}
            style={styles.recipeCard}
            onPress={() =>
              navigation.navigate('RecipeDetail', {
                recipe: { ...recipe, country: 'Ghana 🇬🇭' },
              })
            }
          >
            <View style={styles.rankBadge}>
              <Text style={styles.rankText}>#{index + 1}</Text>
            </View>

            <Text style={styles.recipeEmoji}>{recipe.emoji}</Text>

            <View style={styles.recipeInfo}>
              <Text style={styles.recipeName}>{recipe.name}</Text>
              <View style={styles.metaRow}>
                <Text style={styles.metaCost}>GH₵ {recipe.cost.toFixed(2)}</Text>
                <Text style={styles.metaDot}>·</Text>
                <Text style={styles.metaCal}>🔥 {recipe.calories} kcal</Text>
                <Text style={styles.metaDot}>·</Text>
                <Text style={styles.metaTime}>⏱ {recipe.time}</Text>
              </View>
              <Text style={styles.servesText}>Serves {recipe.serves}</Text>
            </View>

            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        ))
      )}

      {results.length > 0 && (
        <TouchableOpacity
          style={styles.secondaryBtn}
          onPress={() => navigation.navigate('BudgetCookingMode')}
        >
          <Text style={styles.secondaryBtnText}>↺ Change Budget</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 16 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    marginBottom: 20,
    gap: 16,
  },
  back: { color: '#E85D04', fontSize: 22 },
  headerTextWrap: { flex: 1 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#1A1A1A' },
  subtitle: { fontSize: 13, color: '#888', marginTop: 2 },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  statCard: {
    flex: 1,
    backgroundColor: '#FFF3EC',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
  },
  statValue: { fontSize: 18, fontWeight: 'bold', color: '#E85D04' },
  statLabel: { fontSize: 11, color: '#888', marginTop: 2 },
  sectionTitle: { fontSize: 14, fontWeight: '600', color: '#1A1A1A', marginBottom: 10 },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
  chip: {
    borderWidth: 1.5,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  chipActive: { backgroundColor: '#E85D04', borderColor: '#E85D04' },
  chipText: { fontSize: 13, color: '#444' },
  chipTextActive: { color: '#fff', fontWeight: '600' },
  recipeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  rankBadge: {
    backgroundColor: '#E85D04',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 10,
  },
  rankText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  recipeEmoji: { fontSize: 32, marginRight: 12 },
  recipeInfo: { flex: 1 },
  recipeName: { fontSize: 15, fontWeight: '600', color: '#1A1A1A', marginBottom: 4 },
  metaRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' },
  metaCost: { fontSize: 13, fontWeight: 'bold', color: '#E85D04' },
  metaDot: { fontSize: 12, color: '#ccc', marginHorizontal: 4 },
  metaCal: { fontSize: 12, color: '#666' },
  metaTime: { fontSize: 12, color: '#666' },
  servesText: { fontSize: 11, color: '#888', marginTop: 2 },
  arrow: { fontSize: 22, color: '#E85D04' },
  emptyBox: {
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    marginTop: 8,
  },
  emptyEmoji: { fontSize: 48, marginBottom: 12 },
  emptyTitle: { fontSize: 18, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 6 },
  emptyDesc: { fontSize: 13, color: '#666', textAlign: 'center', lineHeight: 20 },
  emptyBtn: {
    backgroundColor: '#E85D04',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 16,
  },
  emptyBtnText: { color: '#fff', fontWeight: '600', fontSize: 14 },
  secondaryBtn: {
    backgroundColor: '#FFF3EC',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 12,
  },
  secondaryBtnText: { color: '#E85D04', fontWeight: '600', fontSize: 15 },
});
