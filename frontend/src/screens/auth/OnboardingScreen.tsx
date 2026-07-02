import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ScrollView, Alert
} from 'react-native';

const COUNTRIES = ['Ghana', 'Nigeria', 'Kenya', 'South Africa', 'Ethiopia', 'Egypt', 'United Kingdom', 'United States', 'Canada', 'Other'];

const DIETARY_PREFS = ['No Restriction', 'Vegetarian', 'Vegan', 'Pescatarian', 'Halal', 'Kosher', 'Gluten-Free', 'Dairy-Free'];

export default function OnboardingScreen({ navigation }: any) {
  const [country, setCountry] = useState('');
  const [bio, setBio] = useState('');
  const [selectedDietary, setSelectedDietary] = useState<string[]>([]);

  const toggleDietary = (pref: string) => {
    setSelectedDietary(prev =>
      prev.includes(pref) ? prev.filter(p => p !== pref) : [...prev, pref]
    );
  };

  const handleContinue = () => {
    if (!country) {
      Alert.alert('Error', 'Please select your country');
      return;
    }
    navigation.navigate('DietaryProfile');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Welcome to Dishaspora! 🍜</Text>
      <Text style={styles.subtitle}>Tell us a little about yourself</Text>

      {/* Country */}
      <Text style={styles.label}>Your Country</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
        {COUNTRIES.map(c => (
          <TouchableOpacity
            key={c}
            style={[styles.chip, country === c && styles.chipSelected]}
            onPress={() => setCountry(c)}
          >
            <Text style={[styles.chipText, country === c && styles.chipTextSelected]}>{c}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Dietary Preferences */}
      <Text style={styles.label}>Dietary Preferences</Text>
      <View style={styles.chipWrap}>
        {DIETARY_PREFS.map(pref => (
          <TouchableOpacity
            key={pref}
            style={[styles.chip, selectedDietary.includes(pref) && styles.chipSelected]}
            onPress={() => toggleDietary(pref)}
          >
            <Text style={[styles.chipText, selectedDietary.includes(pref) && styles.chipTextSelected]}>
              {pref}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Bio */}
      <Text style={styles.label}>Short Bio (optional)</Text>
      <TextInput
        style={styles.bioInput}
        placeholder="e.g. I love exploring African cuisines..."
        value={bio}
        onChangeText={setBio}
        multiline
        numberOfLines={3}
      />

      <TouchableOpacity style={styles.button} onPress={handleContinue}>
        <Text style={styles.buttonText}>Continue →</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, backgroundColor: '#fff', paddingTop: 60 },
  title: { fontSize: 26, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 6 },
  subtitle: { fontSize: 15, color: '#666', marginBottom: 28 },
  label: { fontSize: 15, fontWeight: '600', color: '#1A1A1A', marginBottom: 10, marginTop: 16 },
  chipRow: { flexDirection: 'row', marginBottom: 8 },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    borderWidth: 1.5, borderColor: '#ddd', borderRadius: 20,
    paddingHorizontal: 14, paddingVertical: 8, marginRight: 8, marginBottom: 8,
  },
  chipSelected: { backgroundColor: '#E85D04', borderColor: '#E85D04' },
  chipText: { fontSize: 13, color: '#444' },
  chipTextSelected: { color: '#fff', fontWeight: '600' },
  bioInput: {
    borderWidth: 1, borderColor: '#ddd', borderRadius: 10,
    padding: 14, fontSize: 15, minHeight: 90, textAlignVertical: 'top', marginBottom: 8,
  },
  button: {
    backgroundColor: '#E85D04', padding: 16, borderRadius: 10,
    alignItems: 'center', marginTop: 24, marginBottom: 40,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});