import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';

const REGIONS = ['All', 'West Africa', 'East Africa', 'North Africa', 'Southern Africa', 'Diaspora'];
const CUISINES = ['Ghanaian', 'Nigerian', 'Ethiopian', 'Moroccan', 'Kenyan', 'South African', 'Caribbean', 'British-African'];
const DIETARY = ['All', 'Vegetarian', 'Vegan', 'Halal', 'Gluten-Free', 'Dairy-Free'];
const CALORIE_RANGES = ['Any', 'Under 200', '200–400', '400–600', '600+'];

const RECIPES = [
  { id: '1', name: 'Jollof Rice', region: 'West Africa', cuisine: 'Ghanaian', dietary: 'Halal', calories: 420, time: '45 min', emoji: '🍛' },
  { id: '2', name: 'Egusi Soup', region: 'West Africa', cuisine: 'Nigerian', dietary: 'Halal', calories: 380, time: '60 min', emoji: '🥘' },
  { id: '3', name: 'Injera', region: 'East Africa', cuisine: 'Ethiopian', dietary: 'Vegan', calories: 270, time: '30 min', emoji: '🫓' },
  { id: '4', name: 'Tagine', region: 'North Africa', cuisine: 'Moroccan', dietary: 'Halal', calories: 510, time: '90 min', emoji: '🍲' },
  { id: '5', name: 'Suya', region: 'West Africa', cuisine: 'Nigerian', dietary: 'Halal', calories: 320, time: '25 min', emoji: '🍢' },
  { id: '6', name: 'Kelewele', region: 'West Africa', cuisine: 'Ghanaian', dietary: 'Vegan', calories: 290, time: '20 min', emoji: '🍌' },
  { id: '7', name: 'Bobotie', region: 'Southern Africa', cuisine: 'South African', dietary: 'Halal', calories: 450, time: '50 min', emoji: '🥗' },
  { id: '8', name: 'Shakshuka', region: 'North Africa', cuisine: 'Moroccan', dietary: 'Vegetarian', calories: 210, time: '20 min', emoji: '🍳' },
];

export default function RecipeCategoryScreen({ navigation }: any) {
  const [region, setRegion] = useState('All');
  const [dietary, setDietary] = useState('All');
  const [calories, setCalories] = useState('Any');

  const filtered = RECIPES.filter(r => {
    const regionMatch = region === 'All' || r.region === region;
    const dietaryMatch = dietary === 'All' || r.dietary === dietary;
    const calorieMatch =
      calories === 'Any' ||
      (calories === 'Under 200' && r.calories < 200) ||
      (calories === '200–400' && r.calories >= 200 && r.calories <= 400) ||
      (calories === '400–600' && r.calories > 400 && r.calories <= 600) ||
      (calories === '600+' && r.calories > 600);
    return regionMatch && dietaryMatch && calorieMatch;
  });

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Browse Recipes</Text>
      </View>

      {/* Region Filter */}
      <Text style={styles.label}>Region</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
        {REGIONS.map(r => (
          <TouchableOpacity
            key={r}
            style={[styles.chip, region === r && styles.chipActive]}
            onPress={() => setRegion(r)}
          >
            <Text style={[styles.chipText, region === r && styles.chipTextActive]}>{r}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Dietary Filter */}
      <Text style={styles.label}>Dietary</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
        {DIETARY.map(d => (
          <TouchableOpacity
            key={d}
            style={[styles.chip, dietary === d && styles.chipActive]}
            onPress={() => setDietary(d)}
          >
            <Text style={[styles.chipText, dietary === d && styles.chipTextActive]}>{d}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Calorie Filter */}
      <Text style={styles.label}>Calories</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
        {CALORIE_RANGES.map(c => (
          <TouchableOpacity
            key={c}
            style={[styles.chip, calories === c && styles.chipActive]}
            onPress={() => setCalories(c)}
          >
            <Text style={[styles.chipText, calories === c && styles.chipTextActive]}>{c}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Results */}
      <Text style={styles.resultsLabel}>{filtered.length} recipes found</Text>
      {filtered.map(recipe => (
        <TouchableOpacity
          key={recipe.id}
          style={styles.recipeCard}
          onPress={() => navigation.navigate('RecipeDetail', { recipe })}
        >
          <Text style={styles.recipeEmoji}>{recipe.emoji}</Text>
          <View style={styles.recipeInfo}>
            <Text style={styles.recipeName}>{recipe.name}</Text>
            <Text style={styles.recipeMeta}>{recipe.cuisine} · {recipe.dietary}</Text>
            <Text style={styles.recipeMeta}>🔥 {recipe.calories} cal · ⏱ {recipe.time}</Text>
          </View>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 16 },
  header: { flexDirection: 'row', alignItems: 'center', paddingTop: 60, marginBottom: 24, gap: 16 },
  back: { color: '#E85D04', fontSize: 16 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#1A1A1A' },
  label: { fontSize: 14, fontWeight: '600', color: '#1A1A1A', marginBottom: 10, marginTop: 16 },
  chipRow: { marginBottom: 4 },
  chip: { borderWidth: 1.5, borderColor: '#ddd', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8, marginRight: 8 },
  chipActive: { backgroundColor: '#E85D04', borderColor: '#E85D04' },
  chipText: { fontSize: 13, color: '#444' },
  chipTextActive: { color: '#fff', fontWeight: '600' },
  resultsLabel: { fontSize: 13, color: '#888', marginTop: 20, marginBottom: 12 },
  recipeCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF3EC', borderRadius: 12, padding: 14, marginBottom: 12 },
  recipeEmoji: { fontSize: 36, marginRight: 14 },
  recipeInfo: { flex: 1 },
  recipeName: { fontSize: 16, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 4 },
  recipeMeta: { fontSize: 12, color: '#666', marginBottom: 2 },
  arrow: { fontSize: 22, color: '#E85D04' },
});