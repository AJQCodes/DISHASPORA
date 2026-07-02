import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';

export default function RecipeDetailScreen({ navigation, route }: any) {
  const { recipe } = route.params || {};
  const [bookmarked, setBookmarked] = useState(false);

  const ingredients = [
    '2 cups long grain rice',
    '1 can chopped tomatoes',
    '2 red bell peppers',
    '1 onion, diced',
    '3 cloves garlic',
    '2 cups chicken stock',
    '2 tbsp tomato paste',
    'Salt, pepper, thyme to taste',
  ];

  const steps = [
    'Blend tomatoes, peppers and onion into a smooth paste.',
    'Fry the blended mixture in hot oil for 15 minutes until reduced.',
    'Add tomato paste, stock and seasoning. Stir well.',
    'Wash and add rice. Cover and cook on low heat for 25 minutes.',
    'Stir occasionally and add more stock if needed.',
    'Serve hot with fried plantain and chicken.',
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 60 }}>
      {/* Header */}
      <View style={styles.heroBox}>
        <Text style={styles.heroEmoji}>{recipe?.emoji || '🍛'}</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <TouchableOpacity
  style={styles.bookmarkBtn}
  onPress={() => {
    setBookmarked(!bookmarked);
    if (!bookmarked) navigation.navigate('Bookmarks');
  }}
>
  <Text style={styles.bookmarkText}>{bookmarked ? '🔖' : '🏷️'}</Text>
</TouchableOpacity>
      </View>

      <View style={styles.content}>
        {/* Title */}
        <Text style={styles.title}>{recipe?.name || 'Jollof Rice'}</Text>
        <Text style={styles.origin}>🌍 {recipe?.country || 'Ghana 🇬🇭'}</Text>

        {/* Meta */}
        <View style={styles.metaRow}>
          <View style={styles.metaCard}>
            <Text style={styles.metaValue}>🔥 {recipe?.calories || 420}</Text>
            <Text style={styles.metaLabel}>Calories</Text>
          </View>
          <View style={styles.metaCard}>
            <Text style={styles.metaValue}>⏱ {recipe?.time || '45 min'}</Text>
            <Text style={styles.metaLabel}>Cook Time</Text>
          </View>
          <View style={styles.metaCard}>
            <Text style={styles.metaValue}>👥 4</Text>
            <Text style={styles.metaLabel}>Servings</Text>
          </View>
        </View>

        {/* Nutrition */}
        <Text style={styles.sectionTitle}>Nutrition Info</Text>
        <View style={styles.nutritionRow}>
          {[
            { label: 'Carbs', value: '68g' },
            { label: 'Protein', value: '12g' },
            { label: 'Fat', value: '8g' },
            { label: 'Fibre', value: '4g' },
          ].map(n => (
            <View key={n.label} style={styles.nutritionCard}>
              <Text style={styles.nutritionValue}>{n.value}</Text>
              <Text style={styles.nutritionLabel}>{n.label}</Text>
            </View>
          ))}
        </View>

        {/* Ingredients */}
        <Text style={styles.sectionTitle}>Ingredients</Text>
        {ingredients.map((ing, i) => (
          <View key={i} style={styles.ingredientRow}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.ingredientText}>{ing}</Text>
          </View>
        ))}

        {/* Steps */}
        <Text style={styles.sectionTitle}>Instructions</Text>
        {steps.map((step, i) => (
          <View key={i} style={styles.stepRow}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>{i + 1}</Text>
            </View>
            <Text style={styles.stepText}>{step}</Text>
          </View>
        ))}

        {/* Cook Now Button */}
        <TouchableOpacity
          style={styles.cookBtn}
          onPress={() => navigation.navigate('CookingTimer', { recipe })}
        >
          <Text style={styles.cookBtnText}>Start Cooking ⏱</Text>
        </TouchableOpacity>

        {/* Reviews Button */}
        <TouchableOpacity
          style={styles.reviewBtn}
          onPress={() => navigation.navigate('RecipeReviews', { recipe })}
        >
          <Text style={styles.reviewBtnText}>View Reviews ⭐</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  heroBox: { backgroundColor: '#FFF3EC', height: 220, alignItems: 'center', justifyContent: 'center' },
  heroEmoji: { fontSize: 90 },
  backBtn: { position: 'absolute', top: 50, left: 16, backgroundColor: '#fff', padding: 8, borderRadius: 20 },
  backText: { fontSize: 18, color: '#E85D04' },
  bookmarkBtn: { position: 'absolute', top: 50, right: 16, backgroundColor: '#fff', padding: 8, borderRadius: 20 },
  bookmarkText: { fontSize: 18 },
  content: { padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 4 },
  origin: { fontSize: 14, color: '#666', marginBottom: 20 },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
  metaCard: { backgroundColor: '#FFF3EC', borderRadius: 12, padding: 14, alignItems: 'center', flex: 1, marginHorizontal: 4 },
  metaValue: { fontSize: 14, fontWeight: 'bold', color: '#1A1A1A' },
  metaLabel: { fontSize: 11, color: '#888', marginTop: 4 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 12, marginTop: 8 },
  nutritionRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
  nutritionCard: { backgroundColor: '#F5F5F5', borderRadius: 10, padding: 12, alignItems: 'center', flex: 1, marginHorizontal: 3 },
  nutritionValue: { fontSize: 15, fontWeight: 'bold', color: '#E85D04' },
  nutritionLabel: { fontSize: 11, color: '#888', marginTop: 2 },
  ingredientRow: { flexDirection: 'row', marginBottom: 8 },
  bullet: { color: '#E85D04', fontSize: 16, marginRight: 8 },
  ingredientText: { fontSize: 15, color: '#444', flex: 1 },
  stepRow: { flexDirection: 'row', marginBottom: 16, alignItems: 'flex-start' },
  stepNumber: { backgroundColor: '#E85D04', width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginRight: 12, marginTop: 2 },
  stepNumberText: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
  stepText: { fontSize: 15, color: '#444', flex: 1, lineHeight: 22 },
  cookBtn: { backgroundColor: '#E85D04', padding: 16, borderRadius: 10, alignItems: 'center', marginTop: 24, marginBottom: 12 },
  cookBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  reviewBtn: { backgroundColor: '#FFF3EC', padding: 16, borderRadius: 10, alignItems: 'center', marginBottom: 12 },
  reviewBtnText: { color: '#E85D04', fontSize: 16, fontWeight: '600' },
});