import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';

const MEALS = [
  { type: 'Breakfast', emoji: '🌅', calories: 380, target: 400 },
  { type: 'Lunch', emoji: '☀️', calories: 620, target: 650 },
  { type: 'Dinner', emoji: '🌙', calories: 540, target: 600 },
  { type: 'Snacks', emoji: '🍎', calories: 180, target: 200 },
];

export default function CalorieDashboardScreen({ navigation, route }: any) {
  const { calories = 2000, goal = 'Eat Healthier', activity = 'Moderate' } = route.params || {};
  const consumed = MEALS.reduce((sum, m) => sum + m.calories, 0);
  const remaining = calories - consumed;
  const percentage = Math.min((consumed / calories) * 100, 100);

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 60 }}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Calorie Dashboard</Text>
      </View>

      {/* Goal Badge */}
      <View style={styles.goalBadge}>
        <Text style={styles.goalText}>🎯 Goal: {goal} · {activity}</Text>
      </View>

      {/* Main Calorie Circle */}
      <View style={styles.circleBox}>
        <View style={styles.circle}>
          <Text style={styles.circleNumber}>{remaining}</Text>
          <Text style={styles.circleLabel}>kcal remaining</Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressSection}>
        <View style={styles.progressRow}>
          <Text style={styles.progressLabel}>🔥 {consumed} eaten</Text>
          <Text style={styles.progressLabel}>🎯 {calories} target</Text>
        </View>
        <View style={styles.progressBg}>
          <View style={[styles.progressFill, { width: `${percentage}%` }]} />
        </View>
      </View>

      {/* Macro Summary */}
      <View style={styles.macroRow}>
        {[
          { label: 'Carbs', value: '245g', target: '280g', color: '#E85D04' },
          { label: 'Protein', value: '89g', target: '120g', color: '#4CAF50' },
          { label: 'Fat', value: '52g', target: '65g', color: '#2196F3' },
          { label: 'Fibre', value: '18g', target: '25g', color: '#FF9800' },
        ].map(m => (
          <View key={m.label} style={styles.macroCard}>
            <Text style={[styles.macroValue, { color: m.color }]}>{m.value}</Text>
            <Text style={styles.macroLabel}>{m.label}</Text>
            <Text style={styles.macroTarget}>of {m.target}</Text>
          </View>
        ))}
      </View>

      {/* Meals Breakdown */}
      <Text style={styles.sectionTitle}>Today's Meals</Text>
      {MEALS.map(meal => (
        <TouchableOpacity
          key={meal.type}
          style={styles.mealCard}
          onPress={() => navigation.navigate('MealSlotDetail', { meal })}
        >
          <Text style={styles.mealEmoji}>{meal.emoji}</Text>
          <View style={styles.mealInfo}>
            <Text style={styles.mealType}>{meal.type}</Text>
            <View style={styles.mealProgressBg}>
              <View style={[styles.mealProgressFill, {
                width: `${Math.min((meal.calories / meal.target) * 100, 100)}%`
              }]} />
            </View>
          </View>
          <View style={styles.mealCalBox}>
            <Text style={styles.mealCal}>{meal.calories}</Text>
            <Text style={styles.mealCalTarget}>/ {meal.target} kcal</Text>
          </View>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>
      ))}

      {/* Action Buttons */}
      <TouchableOpacity
        style={styles.primaryBtn}
        onPress={() => navigation.navigate('WeeklyMealPlan')}
      >
        <Text style={styles.primaryBtnText}>📅 View Weekly Plan</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.secondaryBtn}
        onPress={() => navigation.navigate('BudgetCookingMode')}
      >
        <Text style={styles.secondaryBtnText}>💰 Budget Cooking Mode</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.secondaryBtn}
        onPress={() => navigation.navigate('NutritionSummary')}
      >
        <Text style={styles.secondaryBtnText}>📊 Nutrition Summary</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 16 },
  header: { flexDirection: 'row', alignItems: 'center', paddingTop: 60, marginBottom: 8, gap: 16 },
  back: { color: '#E85D04', fontSize: 22 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#1A1A1A' },
  goalBadge: { backgroundColor: '#FFF3EC', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8, alignSelf: 'flex-start', marginBottom: 24 },
  goalText: { color: '#E85D04', fontSize: 13, fontWeight: '600' },
  circleBox: { alignItems: 'center', marginBottom: 24 },
  circle: { width: 180, height: 180, borderRadius: 90, backgroundColor: '#FFF3EC', borderWidth: 6, borderColor: '#E85D04', alignItems: 'center', justifyContent: 'center' },
  circleNumber: { fontSize: 42, fontWeight: 'bold', color: '#E85D04' },
  circleLabel: { fontSize: 13, color: '#888', marginTop: 4 },
  progressSection: { marginBottom: 24 },
  progressRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  progressLabel: { fontSize: 13, color: '#666' },
  progressBg: { backgroundColor: '#F5F5F5', borderRadius: 10, height: 10 },
  progressFill: { backgroundColor: '#E85D04', borderRadius: 10, height: 10 },
  macroRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
  macroCard: { flex: 1, backgroundColor: '#F5F5F5', borderRadius: 10, padding: 10, alignItems: 'center', marginHorizontal: 3 },
  macroValue: { fontSize: 15, fontWeight: 'bold' },
  macroLabel: { fontSize: 11, color: '#888', marginTop: 2 },
  macroTarget: { fontSize: 10, color: '#aaa', marginTop: 1 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 12 },
  mealCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F5F5F5', borderRadius: 12, padding: 14, marginBottom: 10 },
  mealEmoji: { fontSize: 28, marginRight: 12 },
  mealInfo: { flex: 1 },
  mealType: { fontSize: 15, fontWeight: '600', color: '#1A1A1A', marginBottom: 6 },
  mealProgressBg: { backgroundColor: '#ddd', borderRadius: 6, height: 6 },
  mealProgressFill: { backgroundColor: '#E85D04', borderRadius: 6, height: 6 },
  mealCalBox: { alignItems: 'flex-end', marginRight: 8 },
  mealCal: { fontSize: 15, fontWeight: 'bold', color: '#1A1A1A' },
  mealCalTarget: { fontSize: 11, color: '#888' },
  arrow: { fontSize: 22, color: '#E85D04' },
  primaryBtn: { backgroundColor: '#E85D04', padding: 16, borderRadius: 10, alignItems: 'center', marginTop: 20, marginBottom: 10 },
  primaryBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  secondaryBtn: { backgroundColor: '#FFF3EC', padding: 16, borderRadius: 10, alignItems: 'center', marginBottom: 10 },
  secondaryBtnText: { color: '#E85D04', fontSize: 16, fontWeight: '600' },
});