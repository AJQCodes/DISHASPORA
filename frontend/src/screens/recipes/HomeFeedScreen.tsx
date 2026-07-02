import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, TextInput, Image
} from 'react-native';

const TRENDING = [
  { id: '1', name: 'Jollof Rice', country: 'Ghana 🇬🇭', calories: 420, time: '45 min', emoji: '🍛' },
  { id: '2', name: 'Egusi Soup', country: 'Nigeria 🇳🇬', calories: 380, time: '60 min', emoji: '🥘' },
  { id: '3', name: 'Injera', country: 'Ethiopia 🇪🇹', calories: 270, time: '30 min', emoji: '🫓' },
  { id: '4', name: 'Tagine', country: 'Morocco 🇲🇦', calories: 510, time: '90 min', emoji: '🍲' },
  { id: '5', name: 'Suya', country: 'Nigeria 🇳🇬', calories: 320, time: '25 min', emoji: '🍢' },
  { id: '6', name: 'Kelewele', country: 'Ghana 🇬🇭', calories: 290, time: '20 min', emoji: '🍌' },
];

const CATEGORIES = ['All', 'West Africa', 'East Africa', 'North Africa', 'Southern Africa', 'Diaspora'];

export default function HomeFeedScreen({ navigation }: any) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = TRENDING.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase())
  );

 return (
  <View style={{ flex: 1 }}>
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 60 }}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, Foodie! 👋</Text>
          <Text style={styles.subGreeting}>What are you cooking today?</Text>
        </View>
        <TouchableOpacity style={styles.profileBtn}>
          <Text style={styles.profileEmoji}>👤</Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <TouchableOpacity
  style={styles.searchBox}
  onPress={() => navigation.navigate('RecipeSearch')}
>
  <Text style={styles.searchIcon}>🔍</Text>
  <Text style={{ color: '#999', fontSize: 15 }}>Search recipes...</Text>
</TouchableOpacity>

      {/* Categories */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryRow}>
        {CATEGORIES.map(cat => (
          <TouchableOpacity
            key={cat}
            style={[styles.categoryChip, activeCategory === cat && styles.categoryChipActive]}
            onPress={() => setActiveCategory(cat)}
          >
            <Text style={[styles.categoryText, activeCategory === cat && styles.categoryTextActive]}>
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Trending Section */}
      <Text style={styles.sectionTitle}>🔥 Trending Recipes</Text>
      <View style={styles.grid}>
        {filtered.map(recipe => (
          <TouchableOpacity
            key={recipe.id}
            style={styles.card}
            onPress={() => navigation.navigate('RecipeDetail', { recipe })}
          >
            <Text style={styles.cardEmoji}>{recipe.emoji}</Text>
            <Text style={styles.cardName}>{recipe.name}</Text>
            <Text style={styles.cardCountry}>{recipe.country}</Text>
            <View style={styles.cardMeta}>
              <Text style={styles.cardMetaText}>🔥 {recipe.calories} cal</Text>
              <Text style={styles.cardMetaText}>⏱ {recipe.time}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Browse All */}
      <TouchableOpacity
  style={styles.marketplaceBtn}
  onPress={() => navigation.navigate('Marketplace')}
>
  <Text style={styles.marketplaceBtnText}>🛍️ Visit Marketplace</Text>
</TouchableOpacity>
      <TouchableOpacity
      
  style={styles.plannerBtn}
  onPress={() => navigation.navigate('MealPlannerOnboarding')}
>
  <Text style={styles.plannerBtnText}>🥗 Start Meal Planner</Text>
</TouchableOpacity>
      <TouchableOpacity
  style={styles.budgetBtn}
  onPress={() => navigation.navigate('BudgetCookingMode')}
>
  <Text style={styles.budgetBtnText}>💰 Budget Cooking Mode</Text>
</TouchableOpacity>
      <TouchableOpacity
  style={styles.uploadBtn}
  onPress={() => navigation.navigate('RecipeUpload')}
>
  <Text style={styles.uploadBtnText}>+ Upload a Recipe</Text>
</TouchableOpacity>
      <TouchableOpacity
        style={styles.browseBtn}
        onPress={() => navigation.navigate('RecipeCategory')}
      >
        <Text style={styles.browseBtnText}>Browse All Recipes →</Text>
      </TouchableOpacity>
    </ScrollView>
  </View>
);

}

const styles = StyleSheet.create({
  container: {  backgroundColor: '#fff', paddingHorizontal: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 60, marginBottom: 20 },
  greeting: { fontSize: 22, fontWeight: 'bold', color: '#1A1A1A' },
  subGreeting: { fontSize: 14, color: '#666', marginTop: 2 },
  profileBtn: { backgroundColor: '#FFF3EC', padding: 10, borderRadius: 50 },
  profileEmoji: { fontSize: 20 },
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F5F5F5', borderRadius: 12, paddingHorizontal: 14, marginBottom: 16 },
  searchIcon: { fontSize: 16, marginRight: 8 },
  searchInput: { flex: 1, paddingVertical: 12, fontSize: 15 },
  categoryRow: { marginBottom: 20 },
  categoryChip: { borderWidth: 1.5, borderColor: '#ddd', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8, marginRight: 8 },
  categoryChipActive: { backgroundColor: '#E85D04', borderColor: '#E85D04' },
  categoryText: { fontSize: 13, color: '#444' },
  categoryTextActive: { color: '#fff', fontWeight: '600' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 16 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start' },
  card: { width: '48%', backgroundColor: '#FFF3EC', borderRadius: 14, padding: 14, marginBottom: 14, alignSelf: 'flex-start' },
  cardEmoji: { fontSize: 36, marginBottom: 8 },
  cardName: { fontSize: 15, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 2 },
  cardCountry: { fontSize: 12, color: '#666', marginBottom: 8 },
  cardMeta: { flexDirection: 'row', justifyContent: 'space-between' },
  cardMetaText: { fontSize: 11, color: '#888' },
  browseBtn: { backgroundColor: '#FFF3EC', padding: 16, borderRadius: 10, alignItems: 'center', marginVertical: 24 },
  browseBtnText: { color: '#E85D04', fontWeight: '600', fontSize: 15 },
  uploadBtn: { backgroundColor: '#1A1A1A', padding: 16, borderRadius: 10, alignItems: 'center', marginTop: 8 },
  uploadBtnText: { color: '#fff', fontWeight: '600', fontSize: 15 },
  plannerBtn: { backgroundColor: '#FFF3EC', padding: 16, borderRadius: 10, alignItems: 'center', marginTop: 8 },
  plannerBtnText: { color: '#E85D04', fontWeight: '600', fontSize: 15 },
  budgetBtn: { backgroundColor: '#1A1A1A', padding: 16, borderRadius: 10, alignItems: 'center', marginTop: 8 },
  budgetBtnText: { color: '#fff', fontWeight: '600', fontSize: 15 },
  marketplaceBtn: { backgroundColor: '#E85D04', padding: 16, borderRadius: 10, alignItems: 'center', marginTop: 8 },
marketplaceBtnText: { color: '#fff', fontWeight: '600', fontSize: 15 },
});