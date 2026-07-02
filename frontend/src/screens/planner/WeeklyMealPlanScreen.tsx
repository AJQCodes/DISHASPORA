import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const MEAL_PLAN: any = {
  Mon: {
    Breakfast: { name: 'Oats & Banana', calories: 320, emoji: '🥣' },
    Lunch: { name: 'Jollof Rice & Chicken', calories: 650, emoji: '🍛' },
    Dinner: { name: 'Egusi Soup & Fufu', calories: 580, emoji: '🥘' },
    Snacks: { name: 'Mixed Nuts', calories: 180, emoji: '🥜' },
  },
  Tue: {
    Breakfast: { name: 'Scrambled Eggs & Toast', calories: 380, emoji: '🍳' },
    Lunch: { name: 'Kelewele & Beans', calories: 520, emoji: '🍌' },
    Dinner: { name: 'Grilled Tilapia & Rice', calories: 490, emoji: '🐟' },
    Snacks: { name: 'Fruit Salad', calories: 150, emoji: '🍓' },
  },
  Wed: {
    Breakfast: { name: 'Akara & Pap', calories: 410, emoji: '🫘' },
    Lunch: { name: 'Kontomire Stew & Rice', calories: 600, emoji: '🥬' },
    Dinner: { name: 'Suya & Salad', calories: 420, emoji: '🍢' },
    Snacks: { name: 'Boiled Groundnuts', calories: 200, emoji: '🥜' },
  },
  Thu: {
    Breakfast: { name: 'Bread & Egg Sauce', calories: 350, emoji: '🍞' },
    Lunch: { name: 'Waakye', calories: 580, emoji: '🍚' },
    Dinner: { name: 'Light Soup & Banku', calories: 510, emoji: '🍲' },
    Snacks: { name: 'Yoghurt & Honey', calories: 160, emoji: '🍯' },
  },
  Fri: {
    Breakfast: { name: 'Smoothie Bowl', calories: 290, emoji: '🥤' },
    Lunch: { name: 'Fried Rice & Chicken', calories: 680, emoji: '🍗' },
    Dinner: { name: 'Pepper Soup', calories: 380, emoji: '🫕' },
    Snacks: { name: 'Plantain Chips', calories: 220, emoji: '🍌' },
  },
  Sat: {
    Breakfast: { name: 'Pancakes & Syrup', calories: 450, emoji: '🥞' },
    Lunch: { name: 'Shawarma', calories: 620, emoji: '🌯' },
    Dinner: { name: 'Grilled Chicken & Veggies', calories: 480, emoji: '🥗' },
    Snacks: { name: 'Ice Cream', calories: 280, emoji: '🍦' },
  },
  Sun: {
    Breakfast: { name: 'Full Ghanaian Breakfast', calories: 520, emoji: '🍽️' },
    Lunch: { name: 'Sunday Jollof', calories: 700, emoji: '🍛' },
    Dinner: { name: 'Vegetable Soup & Rice', calories: 430, emoji: '🥦' },
    Snacks: { name: 'Chin Chin', calories: 240, emoji: '🍪' },
  },
};

export default function WeeklyMealPlanScreen({ navigation }: any) {
  const [selectedDay, setSelectedDay] = useState('Mon');
  const dayPlan = MEAL_PLAN[selectedDay];
  const totalCalories = Object.values(dayPlan).reduce((sum: number, m: any) => sum + m.calories, 0);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Weekly Meal Plan</Text>
      </View>

      {/* Day Selector */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dayRow}>
        {DAYS.map(day => (
          <TouchableOpacity
            key={day}
            style={[styles.dayChip, selectedDay === day && styles.dayChipActive]}
            onPress={() => setSelectedDay(day)}
          >
            <Text style={[styles.dayText, selectedDay === day && styles.dayTextActive]}>{day}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Daily Total */}
      <View style={styles.totalBox}>
        <Text style={styles.totalLabel}>Total for {selectedDay}</Text>
        <Text style={styles.totalCalories}>{totalCalories} kcal</Text>
      </View>

      {/* Meal Slots */}
      <ScrollView contentContainerStyle={{ paddingBottom: 60 }}>
        {Object.entries(dayPlan).map(([mealType, meal]: any) => (
          <TouchableOpacity
            key={mealType}
            style={styles.mealCard}
            onPress={() => navigation.navigate('MealSlotDetail', { meal: { ...meal, type: mealType } })}
          >
            <Text style={styles.mealEmoji}>{meal.emoji}</Text>
            <View style={styles.mealInfo}>
              <Text style={styles.mealType}>{mealType}</Text>
              <Text style={styles.mealName}>{meal.name}</Text>
            </View>
            <View style={styles.mealCalBox}>
              <Text style={styles.mealCal}>{meal.calories}</Text>
              <Text style={styles.mealCalLabel}>kcal</Text>
            </View>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        ))}

        {/* Action Buttons */}
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() => navigation.navigate('ShoppingList')}
        >
          <Text style={styles.primaryBtnText}>🛒 Generate Shopping List</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryBtn}
          onPress={() => navigation.navigate('NutritionSummary')}
        >
          <Text style={styles.secondaryBtnText}>📊 View Nutrition Summary</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 16 },
  header: { flexDirection: 'row', alignItems: 'center', paddingTop: 60, marginBottom: 16, gap: 16 },
  back: { color: '#E85D04', fontSize: 22 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#1A1A1A' },
  dayRow: { marginBottom: 16 },
  dayChip: { borderWidth: 1.5, borderColor: '#ddd', borderRadius: 20, paddingHorizontal: 18, paddingVertical: 10, marginRight: 8 },
  dayChipActive: { backgroundColor: '#E85D04', borderColor: '#E85D04' },
  dayText: { fontSize: 14, color: '#444', fontWeight: '600' },
  dayTextActive: { color: '#fff' },
  totalBox: { backgroundColor: '#FFF3EC', borderRadius: 12, padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  totalLabel: { fontSize: 15, color: '#666' },
  totalCalories: { fontSize: 22, fontWeight: 'bold', color: '#E85D04' },
  mealCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F5F5F5', borderRadius: 12, padding: 14, marginBottom: 10 },
  mealEmoji: { fontSize: 32, marginRight: 12 },
  mealInfo: { flex: 1 },
  mealType: { fontSize: 12, color: '#888', marginBottom: 2 },
  mealName: { fontSize: 15, fontWeight: '600', color: '#1A1A1A' },
  mealCalBox: { alignItems: 'flex-end', marginRight: 8 },
  mealCal: { fontSize: 16, fontWeight: 'bold', color: '#E85D04' },
  mealCalLabel: { fontSize: 11, color: '#888' },
  arrow: { fontSize: 22, color: '#E85D04' },
  primaryBtn: { backgroundColor: '#E85D04', padding: 16, borderRadius: 10, alignItems: 'center', marginTop: 16, marginBottom: 10 },
  primaryBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  secondaryBtn: { backgroundColor: '#FFF3EC', padding: 16, borderRadius: 10, alignItems: 'center' },
  secondaryBtnText: { color: '#E85D04', fontSize: 16, fontWeight: '600' },
});