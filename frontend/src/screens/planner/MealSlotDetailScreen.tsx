import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';

const SUGGESTED_SWAPS: any = {
  Breakfast: [
    { name: 'Smoothie Bowl', calories: 290, emoji: '🥤' },
    { name: 'Akara & Pap', calories: 410, emoji: '🫘' },
    { name: 'Oats & Banana', calories: 320, emoji: '🥣' },
  ],
  Lunch: [
    { name: 'Waakye', calories: 580, emoji: '🍚' },
    { name: 'Kelewele & Beans', calories: 520, emoji: '🍌' },
    { name: 'Fried Rice & Chicken', calories: 680, emoji: '🍗' },
  ],
  Dinner: [
    { name: 'Grilled Tilapia & Rice', calories: 490, emoji: '🐟' },
    { name: 'Vegetable Soup & Rice', calories: 430, emoji: '🥦' },
    { name: 'Pepper Soup', calories: 380, emoji: '🫕' },
  ],
  Snacks: [
    { name: 'Mixed Nuts', calories: 180, emoji: '🥜' },
    { name: 'Fruit Salad', calories: 150, emoji: '🍓' },
    { name: 'Yoghurt & Honey', calories: 160, emoji: '🍯' },
  ],
};

export default function MealSlotDetailScreen({ navigation, route }: any) {
  const { meal } = route.params || {};
  const [currentMeal, setCurrentMeal] = useState(meal);
  const mealType = currentMeal?.type || 'Breakfast';
  const swaps = SUGGESTED_SWAPS[mealType] || SUGGESTED_SWAPS.Breakfast;

  const handleSwap = (swap: any) => {
    setCurrentMeal({ ...swap, type: mealType });
    Alert.alert('Meal Swapped!', `${swap.name} has been set for ${mealType}.`);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 60 }}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{mealType}</Text>
      </View>

      {/* Current Meal */}
      <View style={styles.currentMealBox}>
        <Text style={styles.currentEmoji}>{currentMeal?.emoji || '🍽️'}</Text>
        <Text style={styles.currentName}>{currentMeal?.name || 'No meal set'}</Text>
        <View style={styles.calBadge}>
          <Text style={styles.calBadgeText}>🔥 {currentMeal?.calories || 0} kcal</Text>
        </View>
      </View>

      {/* Nutrition Breakdown */}
      <Text style={styles.sectionTitle}>Nutrition Breakdown</Text>
      <View style={styles.nutritionRow}>
        {[
          { label: 'Carbs', value: '62g', color: '#E85D04' },
          { label: 'Protein', value: '28g', color: '#4CAF50' },
          { label: 'Fat', value: '14g', color: '#2196F3' },
          { label: 'Fibre', value: '6g', color: '#FF9800' },
        ].map(n => (
          <View key={n.label} style={styles.nutritionCard}>
            <Text style={[styles.nutritionValue, { color: n.color }]}>{n.value}</Text>
            <Text style={styles.nutritionLabel}>{n.label}</Text>
          </View>
        ))}
      </View>

      {/* Action Buttons */}
      <View style={styles.actionRow}>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => navigation.navigate('RecipeDetail', { recipe: currentMeal })}
        >
          <Text style={styles.actionBtnText}>📖 View Recipe</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => navigation.navigate('CookingTimer', { recipe: currentMeal })}
        >
          <Text style={styles.actionBtnText}>⏱ Start Cooking</Text>
        </TouchableOpacity>
      </View>

      {/* Suggested Swaps */}
      <Text style={styles.sectionTitle}>Suggested Swaps</Text>
      <Text style={styles.swapSubtitle}>Not feeling this meal? Try one of these instead.</Text>
      {swaps.map((swap: any, i: number) => (
        <View key={i} style={styles.swapCard}>
          <Text style={styles.swapEmoji}>{swap.emoji}</Text>
          <View style={styles.swapInfo}>
            <Text style={styles.swapName}>{swap.name}</Text>
            <Text style={styles.swapCal}>🔥 {swap.calories} kcal</Text>
          </View>
          <TouchableOpacity
            style={styles.swapBtn}
            onPress={() => handleSwap(swap)}
          >
            <Text style={styles.swapBtnText}>Swap</Text>
          </TouchableOpacity>
        </View>
      ))}

      {/* Remove Meal */}
      <TouchableOpacity
        style={styles.removeBtn}
        onPress={() => {
          Alert.alert('Remove Meal', 'Are you sure you want to remove this meal?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Remove', style: 'destructive', onPress: () => navigation.goBack() },
          ]);
        }}
      >
        <Text style={styles.removeBtnText}>🗑 Remove Meal</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 16 },
  header: { flexDirection: 'row', alignItems: 'center', paddingTop: 60, marginBottom: 24, gap: 16 },
  back: { color: '#E85D04', fontSize: 22 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#1A1A1A' },
  currentMealBox: { backgroundColor: '#FFF3EC', borderRadius: 16, padding: 24, alignItems: 'center', marginBottom: 24 },
  currentEmoji: { fontSize: 64, marginBottom: 12 },
  currentName: { fontSize: 20, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 12, textAlign: 'center' },
  calBadge: { backgroundColor: '#E85D04', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 6 },
  calBadgeText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 12 },
  nutritionRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
  nutritionCard: { flex: 1, backgroundColor: '#F5F5F5', borderRadius: 10, padding: 12, alignItems: 'center', marginHorizontal: 3 },
  nutritionValue: { fontSize: 16, fontWeight: 'bold' },
  nutritionLabel: { fontSize: 11, color: '#888', marginTop: 2 },
  actionRow: { flexDirection: 'row', gap: 10, marginBottom: 24 },
  actionBtn: { flex: 1, backgroundColor: '#FFF3EC', padding: 14, borderRadius: 10, alignItems: 'center' },
  actionBtnText: { color: '#E85D04', fontWeight: '600', fontSize: 14 },
  swapSubtitle: { fontSize: 13, color: '#888', marginBottom: 12, marginTop: -4 },
  swapCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F5F5F5', borderRadius: 12, padding: 14, marginBottom: 10 },
  swapEmoji: { fontSize: 32, marginRight: 12 },
  swapInfo: { flex: 1 },
  swapName: { fontSize: 15, fontWeight: '600', color: '#1A1A1A', marginBottom: 2 },
  swapCal: { fontSize: 12, color: '#666' },
  swapBtn: { backgroundColor: '#E85D04', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  swapBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
  removeBtn: { backgroundColor: '#FFE5D9', padding: 16, borderRadius: 10, alignItems: 'center', marginTop: 8 },
  removeBtnText: { color: '#E85D04', fontWeight: '600', fontSize: 15 },
});