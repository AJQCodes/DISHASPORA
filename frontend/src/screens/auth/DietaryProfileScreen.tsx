import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';

const ALLERGIES = [
  'Peanuts', 'Tree Nuts', 'Milk', 'Eggs', 'Wheat', 'Soy',
  'Fish', 'Shellfish', 'Sesame', 'Gluten', 'None'
];

const HEALTH_GOALS = [
  'Lose Weight', 'Gain Muscle', 'Eat Healthier', 'Explore Cuisines',
  'Manage Diabetes', 'Heart Health', 'Just Hungry 😄'
];

const SPICE_LEVELS = ['Mild', 'Medium', 'Hot', 'Extra Hot 🔥'];

export default function DietaryProfileScreen({ navigation }: any) {
  const [allergies, setAllergies] = useState<string[]>([]);
  const [goals, setGoals] = useState<string[]>([]);
  const [spice, setSpice] = useState('');

  const toggle = (list: string[], setList: Function, item: string) => {
    setList((prev: string[]) =>
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  };

  const handleFinish = () => {
    if (!spice) {
      Alert.alert('Almost there!', 'Please select your spice level');
      return;
    }
    navigation.navigate('HomeFeed');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Your Food Profile 🌶️</Text>
      <Text style={styles.subtitle}>Help us personalise your Dishaspora experience</Text>

      {/* Allergies */}
      <Text style={styles.label}>Any food allergies?</Text>
      <View style={styles.chipWrap}>
        {ALLERGIES.map(item => (
          <TouchableOpacity
            key={item}
            style={[styles.chip, allergies.includes(item) && styles.chipSelected]}
            onPress={() => toggle(allergies, setAllergies, item)}
          >
            <Text style={[styles.chipText, allergies.includes(item) && styles.chipTextSelected]}>
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Health Goals */}
      <Text style={styles.label}>What are your health goals?</Text>
      <View style={styles.chipWrap}>
        {HEALTH_GOALS.map(item => (
          <TouchableOpacity
            key={item}
            style={[styles.chip, goals.includes(item) && styles.chipSelected]}
            onPress={() => toggle(goals, setGoals, item)}
          >
            <Text style={[styles.chipText, goals.includes(item) && styles.chipTextSelected]}>
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Spice Level */}
      <Text style={styles.label}>Preferred spice level?</Text>
      <View style={styles.chipWrap}>
        {SPICE_LEVELS.map(item => (
          <TouchableOpacity
            key={item}
            style={[styles.chip, spice === item && styles.chipSelected]}
            onPress={() => setSpice(item)}
          >
            <Text style={[styles.chipText, spice === item && styles.chipTextSelected]}>
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.button} onPress={handleFinish}>
        <Text style={styles.buttonText}>Finish Setup 🎉</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, backgroundColor: '#fff', paddingTop: 60, paddingBottom: 40 },
  title: { fontSize: 26, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 6 },
  subtitle: { fontSize: 15, color: '#666', marginBottom: 28 },
  label: { fontSize: 15, fontWeight: '600', color: '#1A1A1A', marginBottom: 10, marginTop: 20 },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    borderWidth: 1.5, borderColor: '#ddd', borderRadius: 20,
    paddingHorizontal: 14, paddingVertical: 8, marginRight: 8, marginBottom: 8,
  },
  chipSelected: { backgroundColor: '#E85D04', borderColor: '#E85D04' },
  chipText: { fontSize: 13, color: '#444' },
  chipTextSelected: { color: '#fff', fontWeight: '600' },
  button: {
    backgroundColor: '#E85D04', padding: 16, borderRadius: 10,
    alignItems: 'center', marginTop: 32,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});