import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from 'react-native';

const BUDGET_PRESETS = [20, 35, 50, 75, 100, 150];
const MEAL_COUNTS = [1, 2, 3, 4, 5];
const DIET_FILTERS = ['Any', 'Vegetarian', 'High Protein', 'Low Carb', 'Quick (<30 min)'];

export default function BudgetCookingModeScreen({ navigation }: any) {
  const [budget, setBudget] = useState('50');
  const [meals, setMeals] = useState(3);
  const [dietFilter, setDietFilter] = useState('Any');

  const budgetNum = parseFloat(budget) || 0;
  const perMeal = meals > 0 && budgetNum > 0 ? (budgetNum / meals).toFixed(2) : '0.00';
  const canSearch = budgetNum > 0 && meals > 0;

  const handleSearch = () => {
    if (!canSearch) return;
    navigation.navigate('BudgetRecipeResults', {
      budget: budgetNum,
      meals,
      dietFilter,
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 60 }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerTextWrap}>
          <Text style={styles.title}>Budget Cooking Mode</Text>
          <Text style={styles.subtitle}>Find meals that fit your wallet</Text>
        </View>
      </View>

      <View style={styles.heroCard}>
        <Text style={styles.heroEmoji}>💰</Text>
        <Text style={styles.heroTitle}>Cook smart, spend less</Text>
        <Text style={styles.heroDesc}>
          Set your weekly food budget and we'll rank recipes by cost and nutrition.
        </Text>
      </View>

      <Text style={styles.label}>Weekly budget (GH₵) *</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. 50"
        value={budget}
        onChangeText={setBudget}
        keyboardType="decimal-pad"
      />

      <Text style={styles.label}>Quick presets</Text>
      <View style={styles.chipWrap}>
        {BUDGET_PRESETS.map(amount => (
          <TouchableOpacity
            key={amount}
            style={[styles.chip, budgetNum === amount && styles.chipActive]}
            onPress={() => setBudget(String(amount))}
          >
            <Text style={[styles.chipText, budgetNum === amount && styles.chipTextActive]}>
              GH₵ {amount}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Meals to plan *</Text>
      <View style={styles.chipWrap}>
        {MEAL_COUNTS.map(count => (
          <TouchableOpacity
            key={count}
            style={[styles.chip, meals === count && styles.chipActive]}
            onPress={() => setMeals(count)}
          >
            <Text style={[styles.chipText, meals === count && styles.chipTextActive]}>
              {count} {count === 1 ? 'meal' : 'meals'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Diet preference</Text>
      <View style={styles.chipWrap}>
        {DIET_FILTERS.map(filter => (
          <TouchableOpacity
            key={filter}
            style={[styles.chip, dietFilter === filter && styles.chipActive]}
            onPress={() => setDietFilter(filter)}
          >
            <Text style={[styles.chipText, dietFilter === filter && styles.chipTextActive]}>
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {canSearch && (
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Estimated per meal</Text>
          <Text style={styles.summaryValue}>GH₵ {perMeal}</Text>
          <Text style={styles.summaryHint}>
            {meals} meals · GH₵ {budgetNum} total · {dietFilter}
          </Text>
        </View>
      )}

      <TouchableOpacity
        style={[styles.primaryBtn, !canSearch && styles.primaryBtnDisabled]}
        onPress={handleSearch}
        disabled={!canSearch}
      >
        <Text style={styles.primaryBtnText}>🔍 Find Budget Recipes</Text>
      </TouchableOpacity>
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
  heroCard: {
    backgroundColor: '#FFF3EC',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 24,
  },
  heroEmoji: { fontSize: 40, marginBottom: 8 },
  heroTitle: { fontSize: 18, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 6 },
  heroDesc: { fontSize: 13, color: '#666', textAlign: 'center', lineHeight: 20 },
  label: { fontSize: 14, fontWeight: '600', color: '#1A1A1A', marginBottom: 10, marginTop: 4 },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 14,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
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
  summaryCard: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  summaryLabel: { fontSize: 13, color: '#888' },
  summaryValue: { fontSize: 28, fontWeight: 'bold', color: '#E85D04', marginVertical: 4 },
  summaryHint: { fontSize: 12, color: '#666' },
  primaryBtn: {
    backgroundColor: '#E85D04',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
  },
  primaryBtnDisabled: { backgroundColor: '#ddd' },
  primaryBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
