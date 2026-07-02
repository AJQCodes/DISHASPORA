import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput } from 'react-native';

const ALL_RECIPES = [
  { id: '1', name: 'Jollof Rice', country: 'Ghana 🇬🇭', calories: 420, time: '45 min', emoji: '🍛', dietary: 'Halal', region: 'West Africa' },
  { id: '2', name: 'Egusi Soup', country: 'Nigeria 🇳🇬', calories: 380, time: '60 min', emoji: '🥘', dietary: 'Halal', region: 'West Africa' },
  { id: '3', name: 'Injera', country: 'Ethiopia 🇪🇹', calories: 270, time: '30 min', emoji: '🫓', dietary: 'Vegan', region: 'East Africa' },
  { id: '4', name: 'Tagine', country: 'Morocco 🇲🇦', calories: 510, time: '90 min', emoji: '🍲', dietary: 'Halal', region: 'North Africa' },
  { id: '5', name: 'Suya', country: 'Nigeria 🇳🇬', calories: 320, time: '25 min', emoji: '🍢', dietary: 'Halal', region: 'West Africa' },
  { id: '6', name: 'Kelewele', country: 'Ghana 🇬🇭', calories: 290, time: '20 min', emoji: '🍌', dietary: 'Vegan', region: 'West Africa' },
  { id: '7', name: 'Bobotie', country: 'South Africa 🇿🇦', calories: 450, time: '50 min', emoji: '🥗', dietary: 'Halal', region: 'Southern Africa' },
  { id: '8', name: 'Shakshuka', country: 'Morocco 🇲🇦', calories: 210, time: '20 min', emoji: '🍳', dietary: 'Vegetarian', region: 'North Africa' },
  { id: '9', name: 'Fufu & Light Soup', country: 'Ghana 🇬🇭', calories: 490, time: '70 min', emoji: '🍜', dietary: 'Halal', region: 'West Africa' },
  { id: '10', name: 'Piri Piri Chicken', country: 'Mozambique 🇲🇿', calories: 360, time: '40 min', emoji: '🍗', dietary: 'Halal', region: 'Southern Africa' },
];

const DIETARY_FILTERS = ['All', 'Halal', 'Vegan', 'Vegetarian', 'Gluten-Free'];
const REGION_FILTERS = ['All', 'West Africa', 'East Africa', 'North Africa', 'Southern Africa'];

export default function RecipeSearchScreen({ navigation }: any) {
  const [query, setQuery] = useState('');
  const [dietary, setDietary] = useState('All');
  const [region, setRegion] = useState('All');
  const [showFilters, setShowFilters] = useState(false);

  const results = ALL_RECIPES.filter(r => {
    const nameMatch = r.name.toLowerCase().includes(query.toLowerCase());
    const dietaryMatch = dietary === 'All' || r.dietary === dietary;
    const regionMatch = region === 'All' || r.region === region;
    return nameMatch && dietaryMatch && regionMatch;
  });

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Search Recipes</Text>
      </View>

      {/* Search Input */}
      <View style={styles.searchBox}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name, cuisine, ingredient..."
          value={query}
          onChangeText={setQuery}
          autoFocus
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery('')}>
            <Text style={styles.clearBtn}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Filter Toggle */}
      <TouchableOpacity
        style={styles.filterToggle}
        onPress={() => setShowFilters(!showFilters)}
      >
        <Text style={styles.filterToggleText}>
          {showFilters ? '▲ Hide Filters' : '▼ Show Filters'}
        </Text>
      </TouchableOpacity>

      {/* Filters */}
      {showFilters && (
        <View style={styles.filtersBox}>
          <Text style={styles.filterLabel}>Dietary</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
            {DIETARY_FILTERS.map(d => (
              <TouchableOpacity
                key={d}
                style={[styles.chip, dietary === d && styles.chipActive]}
                onPress={() => setDietary(d)}
              >
                <Text style={[styles.chipText, dietary === d && styles.chipTextActive]}>{d}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Text style={styles.filterLabel}>Region</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
            {REGION_FILTERS.map(r => (
              <TouchableOpacity
                key={r}
                style={[styles.chip, region === r && styles.chipActive]}
                onPress={() => setRegion(r)}
              >
                <Text style={[styles.chipText, region === r && styles.chipTextActive]}>{r}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Results Count */}
      <Text style={styles.resultsCount}>
        {query || dietary !== 'All' || region !== 'All'
          ? `${results.length} result${results.length !== 1 ? 's' : ''} found`
          : 'All recipes'}
      </Text>

      {/* Results */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 60 }}>
        {results.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyEmoji}>🍽️</Text>
            <Text style={styles.emptyText}>No recipes found</Text>
            <Text style={styles.emptySubText}>Try a different search or filter</Text>
          </View>
        ) : (
          results.map(recipe => (
            <TouchableOpacity
              key={recipe.id}
              style={styles.recipeCard}
              onPress={() => navigation.navigate('RecipeDetail', { recipe })}
            >
              <Text style={styles.recipeEmoji}>{recipe.emoji}</Text>
              <View style={styles.recipeInfo}>
                <Text style={styles.recipeName}>{recipe.name}</Text>
                <Text style={styles.recipeMeta}>{recipe.country} · {recipe.dietary}</Text>
                <Text style={styles.recipeMeta}>🔥 {recipe.calories} cal · ⏱ {recipe.time}</Text>
              </View>
              <Text style={styles.arrow}>›</Text>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 16 },
  header: { flexDirection: 'row', alignItems: 'center', paddingTop: 60, marginBottom: 16, gap: 16 },
  back: { color: '#E85D04', fontSize: 22 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#1A1A1A' },
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F5F5F5', borderRadius: 12, paddingHorizontal: 14, marginBottom: 12 },
  searchIcon: { fontSize: 16, marginRight: 8 },
  searchInput: { flex: 1, paddingVertical: 12, fontSize: 15 },
  clearBtn: { fontSize: 16, color: '#999', paddingLeft: 8 },
  filterToggle: { marginBottom: 8 },
  filterToggleText: { color: '#E85D04', fontSize: 14, fontWeight: '600' },
  filtersBox: { backgroundColor: '#FFF3EC', borderRadius: 12, padding: 14, marginBottom: 12 },
  filterLabel: { fontSize: 13, fontWeight: '600', color: '#1A1A1A', marginBottom: 8, marginTop: 4 },
  chipRow: { marginBottom: 4 },
  chip: { borderWidth: 1.5, borderColor: '#ddd', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6, marginRight: 8, backgroundColor: '#fff' },
  chipActive: { backgroundColor: '#E85D04', borderColor: '#E85D04' },
  chipText: { fontSize: 12, color: '#444' },
  chipTextActive: { color: '#fff', fontWeight: '600' },
  resultsCount: { fontSize: 13, color: '#888', marginBottom: 12 },
  recipeCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF3EC', borderRadius: 12, padding: 14, marginBottom: 12 },
  recipeEmoji: { fontSize: 36, marginRight: 14 },
  recipeInfo: { flex: 1 },
  recipeName: { fontSize: 16, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 4 },
  recipeMeta: { fontSize: 12, color: '#666', marginBottom: 2 },
  arrow: { fontSize: 22, color: '#E85D04' },
  emptyBox: { alignItems: 'center', paddingTop: 60 },
  emptyEmoji: { fontSize: 48, marginBottom: 12 },
  emptyText: { fontSize: 18, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 4 },
  emptySubText: { fontSize: 14, color: '#888' },
});