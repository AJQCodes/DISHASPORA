import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput } from 'react-native';

const GOALS = ['Lose Weight', 'Gain Muscle', 'Eat Healthier', 'Maintain Weight', 'Manage Diabetes', 'Heart Health'];
const ACTIVITY_LEVELS = [
  { label: 'Sedentary', desc: 'Little or no exercise' },
  { label: 'Light', desc: 'Exercise 1-3 days/week' },
  { label: 'Moderate', desc: 'Exercise 3-5 days/week' },
  { label: 'Active', desc: 'Exercise 6-7 days/week' },
  { label: 'Very Active', desc: 'Hard exercise daily' },
];

export default function MealPlannerOnboardingScreen({ navigation }: any) {
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [gender, setGender] = useState('');
  const [goal, setGoal] = useState('');
  const [activity, setActivity] = useState('');

  const calculateCalories = () => {
    const w = parseFloat(weight);
    const h = parseFloat(height);
    const a = parseFloat(age);
    if (!w || !h || !a) return 2000;

    // Mifflin-St Jeor formula
    let bmr = gender === 'Female'
      ? 10 * w + 6.25 * h - 5 * a - 161
      : 10 * w + 6.25 * h - 5 * a + 5;

    const multipliers: any = {
      'Sedentary': 1.2, 'Light': 1.375,
      'Moderate': 1.55, 'Active': 1.725, 'Very Active': 1.9
    };
    const tdee = bmr * (multipliers[activity] || 1.2);

    if (goal === 'Lose Weight') return Math.round(tdee - 500);
    if (goal === 'Gain Muscle') return Math.round(tdee + 300);
    return Math.round(tdee);
  };

  const handleContinue = () => {
    if (!age || !weight || !height || !gender || !goal || !activity) {
      return;
    }
    const calories = calculateCalories();
    navigation.navigate('CalorieDashboard', { calories, goal, activity });
  };

  const isComplete = age && weight && height && gender && goal && activity;

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 60 }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Meal Planner Setup</Text>
      </View>

      <Text style={styles.subtitle}>
        We'll calculate your daily calorie target based on your body and goals.
      </Text>

      {/* Gender */}
      <Text style={styles.label}>Gender *</Text>
      <View style={styles.chipWrap}>
        {['Male', 'Female'].map(g => (
          <TouchableOpacity
            key={g}
            style={[styles.chip, gender === g && styles.chipActive]}
            onPress={() => setGender(g)}
          >
            <Text style={[styles.chipText, gender === g && styles.chipTextActive]}>{g}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Biometrics */}
      <View style={styles.row}>
        <View style={styles.rowItem}>
          <Text style={styles.label}>Age *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. 22"
            value={age}
            onChangeText={setAge}
            keyboardType="number-pad"
          />
        </View>
        <View style={styles.rowItem}>
          <Text style={styles.label}>Weight (kg) *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. 65"
            value={weight}
            onChangeText={setWeight}
            keyboardType="decimal-pad"
          />
        </View>
        <View style={styles.rowItem}>
          <Text style={styles.label}>Height (cm) *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. 170"
            value={height}
            onChangeText={setHeight}
            keyboardType="decimal-pad"
          />
        </View>
      </View>

      {/* Goal */}
      <Text style={styles.label}>Your Goal *</Text>
      <View style={styles.chipWrap}>
        {GOALS.map(g => (
          <TouchableOpacity
            key={g}
            style={[styles.chip, goal === g && styles.chipActive]}
            onPress={() => setGoal(g)}
          >
            <Text style={[styles.chipText, goal === g && styles.chipTextActive]}>{g}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Activity Level */}
      <Text style={styles.label}>Activity Level *</Text>
      {ACTIVITY_LEVELS.map(a => (
        <TouchableOpacity
          key={a.label}
          style={[styles.activityCard, activity === a.label && styles.activityCardActive]}
          onPress={() => setActivity(a.label)}
        >
          <Text style={[styles.activityLabel, activity === a.label && styles.activityLabelActive]}>
            {a.label}
          </Text>
          <Text style={[styles.activityDesc, activity === a.label && styles.activityDescActive]}>
            {a.desc}
          </Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity
        style={[styles.btn, !isComplete && styles.btnDisabled]}
        onPress={handleContinue}
        disabled={!isComplete}
      >
        <Text style={styles.btnText}>Calculate My Target →</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 16 },
  header: { flexDirection: 'row', alignItems: 'center', paddingTop: 60, marginBottom: 8, gap: 16 },
  back: { color: '#E85D04', fontSize: 22 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#1A1A1A' },
  subtitle: { fontSize: 14, color: '#666', marginBottom: 8, lineHeight: 20 },
  label: { fontSize: 14, fontWeight: '600', color: '#1A1A1A', marginBottom: 8, marginTop: 16 },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { borderWidth: 1.5, borderColor: '#ddd', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8 },
  chipActive: { backgroundColor: '#E85D04', borderColor: '#E85D04' },
  chipText: { fontSize: 13, color: '#444' },
  chipTextActive: { color: '#fff', fontWeight: '600' },
  row: { flexDirection: 'row', gap: 8 },
  rowItem: { flex: 1 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 10, padding: 12, fontSize: 15 },
  activityCard: { borderWidth: 1.5, borderColor: '#ddd', borderRadius: 10, padding: 14, marginBottom: 8 },
  activityCardActive: { backgroundColor: '#FFF3EC', borderColor: '#E85D04' },
  activityLabel: { fontSize: 15, fontWeight: '600', color: '#1A1A1A' },
  activityLabelActive: { color: '#E85D04' },
  activityDesc: { fontSize: 12, color: '#888', marginTop: 2 },
  activityDescActive: { color: '#E85D04' },
  btn: { backgroundColor: '#E85D04', padding: 16, borderRadius: 10, alignItems: 'center', marginTop: 24 },
  btnDisabled: { backgroundColor: '#ddd' },
  btnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});