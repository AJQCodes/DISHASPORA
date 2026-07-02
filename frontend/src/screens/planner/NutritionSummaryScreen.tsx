import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';

const WEEKLY_DATA = [
  { day: 'Mon', calories: 1920, target: 2000, carbs: 245, protein: 89, fat: 52 },
  { day: 'Tue', calories: 1750, target: 2000, carbs: 220, protein: 95, fat: 48 },
  { day: 'Wed', calories: 2100, target: 2000, carbs: 268, protein: 82, fat: 61 },
  { day: 'Thu', calories: 1880, target: 2000, carbs: 238, protein: 91, fat: 55 },
  { day: 'Fri', calories: 2050, target: 2000, carbs: 260, protein: 88, fat: 58 },
  { day: 'Sat', calories: 2280, target: 2000, carbs: 290, protein: 78, fat: 68 },
  { day: 'Sun', calories: 1990, target: 2000, carbs: 252, protein: 86, fat: 54 },
];

const VITAMINS = [
  { name: 'Vitamin A', amount: '820mcg', target: '900mcg', pct: 91 },
  { name: 'Vitamin C', amount: '72mg', target: '90mg', pct: 80 },
  { name: 'Vitamin D', amount: '12mcg', target: '20mcg', pct: 60 },
  { name: 'Iron', amount: '14mg', target: '18mg', pct: 78 },
  { name: 'Calcium', amount: '880mg', target: '1000mg', pct: 88 },
  { name: 'Zinc', amount: '9mg', target: '11mg', pct: 82 },
];

export default function NutritionSummaryScreen({ navigation }: any) {
  const [activeTab, setActiveTab] = useState<'weekly' | 'vitamins'>('weekly');

  const avgCalories = Math.round(
    WEEKLY_DATA.reduce((sum, d) => sum + d.calories, 0) / WEEKLY_DATA.length
  );
  const avgCarbs = Math.round(
    WEEKLY_DATA.reduce((sum, d) => sum + d.carbs, 0) / WEEKLY_DATA.length
  );
  const avgProtein = Math.round(
    WEEKLY_DATA.reduce((sum, d) => sum + d.protein, 0) / WEEKLY_DATA.length
  );
  const avgFat = Math.round(
    WEEKLY_DATA.reduce((sum, d) => sum + d.fat, 0) / WEEKLY_DATA.length
  );

  const maxCalories = Math.max(...WEEKLY_DATA.map(d => d.calories));

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 60 }}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Nutrition Summary</Text>
      </View>

      {/* Weekly Average Cards */}
      <Text style={styles.sectionTitle}>Weekly Averages</Text>
      <View style={styles.avgRow}>
        <View style={styles.avgCard}>
          <Text style={styles.avgValue}>{avgCalories}</Text>
          <Text style={styles.avgLabel}>Avg Calories</Text>
        </View>
        <View style={styles.avgCard}>
          <Text style={[styles.avgValue, { color: '#E85D04' }]}>{avgCarbs}g</Text>
          <Text style={styles.avgLabel}>Avg Carbs</Text>
        </View>
        <View style={styles.avgCard}>
          <Text style={[styles.avgValue, { color: '#4CAF50' }]}>{avgProtein}g</Text>
          <Text style={styles.avgLabel}>Avg Protein</Text>
        </View>
        <View style={styles.avgCard}>
          <Text style={[styles.avgValue, { color: '#2196F3' }]}>{avgFat}g</Text>
          <Text style={styles.avgLabel}>Avg Fat</Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'weekly' && styles.tabActive]}
          onPress={() => setActiveTab('weekly')}
        >
          <Text style={[styles.tabText, activeTab === 'weekly' && styles.tabTextActive]}>
            Weekly Calories
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'vitamins' && styles.tabActive]}
          onPress={() => setActiveTab('vitamins')}
        >
          <Text style={[styles.tabText, activeTab === 'vitamins' && styles.tabTextActive]}>
            Vitamins & Minerals
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'weekly' ? (
        <>
          {/* Bar Chart */}
          <View style={styles.chartBox}>
            <View style={styles.barsRow}>
              {WEEKLY_DATA.map(d => (
                <View key={d.day} style={styles.barColumn}>
                  <Text style={styles.barValue}>{d.calories}</Text>
                  <View style={styles.barBg}>
                    <View style={[
                      styles.barFill,
                      { height: `${(d.calories / maxCalories) * 100}%` },
                      d.calories > d.target && styles.barOver,
                    ]} />
                  </View>
                  <Text style={styles.barLabel}>{d.day}</Text>
                </View>
              ))}
            </View>
            <View style={styles.targetLine}>
              <Text style={styles.targetLineText}>— Target: 2000 kcal</Text>
            </View>
          </View>

          {/* Daily Breakdown */}
          <Text style={styles.sectionTitle}>Daily Breakdown</Text>
          {WEEKLY_DATA.map(d => (
            <View key={d.day} style={styles.dayRow}>
              <Text style={styles.dayLabel}>{d.day}</Text>
              <View style={styles.dayBarBg}>
                <View style={[
                  styles.dayBarFill,
                  { width: `${Math.min((d.calories / d.target) * 100, 100)}%` },
                  d.calories > d.target && styles.barOver,
                ]} />
              </View>
              <Text style={[
                styles.dayCalories,
                d.calories > d.target && styles.dayCaloriesOver,
              ]}>
                {d.calories}
              </Text>
            </View>
          ))}
        </>
      ) : (
        <>
          {/* Vitamins & Minerals */}
          <Text style={styles.sectionTitle}>Daily Vitamin & Mineral Intake</Text>
          {VITAMINS.map(v => (
            <View key={v.name} style={styles.vitaminRow}>
              <View style={styles.vitaminInfo}>
                <Text style={styles.vitaminName}>{v.name}</Text>
                <Text style={styles.vitaminAmount}>{v.amount} of {v.target}</Text>
              </View>
              <View style={styles.vitaminBarBg}>
                <View style={[
                  styles.vitaminBarFill,
                  { width: `${v.pct}%` },
                  v.pct < 70 && styles.vitaminLow,
                ]} />
              </View>
              <Text style={styles.vitaminPct}>{v.pct}%</Text>
            </View>
          ))}
        </>
      )}

      {/* Insight Box */}
      <View style={styles.insightBox}>
        <Text style={styles.insightTitle}>💡 Weekly Insight</Text>
        <Text style={styles.insightText}>
          You exceeded your calorie target on Wednesday and Saturday. Consider lighter meals
          on weekends to stay balanced. Your protein intake is on track — great work!
        </Text>
      </View>

      <TouchableOpacity
        style={styles.btn}
        onPress={() => navigation.navigate('WeeklyMealPlan')}
      >
        <Text style={styles.btnText}>Adjust Meal Plan</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 16 },
  header: { flexDirection: 'row', alignItems: 'center', paddingTop: 60, marginBottom: 24, gap: 16 },
  back: { color: '#E85D04', fontSize: 22 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#1A1A1A' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 12, marginTop: 8 },
  avgRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
  avgCard: { flex: 1, backgroundColor: '#F5F5F5', borderRadius: 10, padding: 12, alignItems: 'center', marginHorizontal: 3 },
  avgValue: { fontSize: 16, fontWeight: 'bold', color: '#1A1A1A' },
  avgLabel: { fontSize: 10, color: '#888', marginTop: 2, textAlign: 'center' },
  tabRow: { flexDirection: 'row', backgroundColor: '#F5F5F5', borderRadius: 10, padding: 4, marginBottom: 20 },
  tab: { flex: 1, padding: 10, borderRadius: 8, alignItems: 'center' },
  tabActive: { backgroundColor: '#fff', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  tabText: { fontSize: 13, color: '#888', fontWeight: '600' },
  tabTextActive: { color: '#E85D04' },
  chartBox: { backgroundColor: '#FFF3EC', borderRadius: 16, padding: 16, marginBottom: 24 },
  barsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 120 },
  barColumn: { alignItems: 'center', flex: 1 },
  barValue: { fontSize: 9, color: '#666', marginBottom: 4 },
  barBg: { width: 24, height: 100, backgroundColor: '#ddd', borderRadius: 6, justifyContent: 'flex-end', overflow: 'hidden' },
  barFill: { backgroundColor: '#E85D04', borderRadius: 6, width: '100%' },
  barOver: { backgroundColor: '#FF5252' },
  barLabel: { fontSize: 11, color: '#666', marginTop: 4 },
  targetLine: { marginTop: 8, alignItems: 'flex-end' },
  targetLineText: { fontSize: 11, color: '#888' },
  dayRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  dayLabel: { width: 36, fontSize: 13, fontWeight: '600', color: '#444' },
  dayBarBg: { flex: 1, backgroundColor: '#F5F5F5', borderRadius: 6, height: 10, marginHorizontal: 8 },
  dayBarFill: { backgroundColor: '#E85D04', borderRadius: 6, height: 10 },
  dayCalories: { width: 44, fontSize: 12, color: '#666', textAlign: 'right' },
  dayCaloriesOver: { color: '#FF5252' },
  vitaminRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  vitaminInfo: { width: 110 },
  vitaminName: { fontSize: 13, fontWeight: '600', color: '#1A1A1A' },
  vitaminAmount: { fontSize: 10, color: '#888' },
  vitaminBarBg: { flex: 1, backgroundColor: '#F5F5F5', borderRadius: 6, height: 8, marginHorizontal: 8 },
  vitaminBarFill: { backgroundColor: '#4CAF50', borderRadius: 6, height: 8 },
  vitaminLow: { backgroundColor: '#FF9800' },
  vitaminPct: { width: 36, fontSize: 12, color: '#666', textAlign: 'right' },
  insightBox: { backgroundColor: '#FFF3EC', borderRadius: 12, padding: 16, marginTop: 20, marginBottom: 16 },
  insightTitle: { fontSize: 15, fontWeight: 'bold', color: '#E85D04', marginBottom: 8 },
  insightText: { fontSize: 14, color: '#444', lineHeight: 20 },
  btn: { backgroundColor: '#E85D04', padding: 16, borderRadius: 10, alignItems: 'center' },
  btnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});