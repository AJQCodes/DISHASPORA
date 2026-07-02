import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, TextInput, Alert
} from 'react-native';

const REGIONS = ['West Africa', 'East Africa', 'North Africa', 'Southern Africa', 'Diaspora'];
const DIETARY_TAGS = ['Halal', 'Vegan', 'Vegetarian', 'Gluten-Free', 'Dairy-Free', 'Pescatarian'];
const DIFFICULTY = ['Easy', 'Medium', 'Hard'];

export default function RecipeUploadScreen({ navigation }: any) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [region, setRegion] = useState('');
  const [dietary, setDietary] = useState<string[]>([]);
  const [difficulty, setDifficulty] = useState('');
  const [cookTime, setCookTime] = useState('');
  const [servings, setServings] = useState('');
  const [calories, setCalories] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [steps, setSteps] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const toggleDietary = (tag: string) => {
    setDietary(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = () => {
    if (!name || !region || !difficulty || !cookTime || !ingredients || !steps) {
      Alert.alert('Missing Fields', 'Please fill in all required fields.');
      return;
    }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <View style={styles.successContainer}>
        <Text style={styles.successEmoji}>🎉</Text>
        <Text style={styles.successTitle}>Recipe Submitted!</Text>
        <Text style={styles.successSubtitle}>
          Your recipe has been submitted for review. It will appear on the app once approved.
        </Text>
        <TouchableOpacity
          style={styles.successBtn}
          onPress={() => navigation.navigate('HomeFeed')}
        >
          <Text style={styles.successBtnText}>Back to Home</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.uploadAnotherBtn}
          onPress={() => {
            setName(''); setDescription(''); setRegion('');
            setDietary([]); setDifficulty(''); setCookTime('');
            setServings(''); setCalories(''); setIngredients('');
            setSteps(''); setSubmitted(false);
          }}
        >
          <Text style={styles.uploadAnotherText}>Upload Another Recipe</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 60 }}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Upload Recipe</Text>
      </View>

      <Text style={styles.subtitle}>Share your recipe with the Dishaspora community</Text>

      {/* Recipe Name */}
      <Text style={styles.label}>Recipe Name *</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. Grandma's Jollof Rice"
        value={name}
        onChangeText={setName}
      />

      {/* Description */}
      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, styles.multiline]}
        placeholder="Tell us about this dish, its cultural significance, your personal touch..."
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={3}
      />

      {/* Region */}
      <Text style={styles.label}>Region *</Text>
      <View style={styles.chipWrap}>
        {REGIONS.map(r => (
          <TouchableOpacity
            key={r}
            style={[styles.chip, region === r && styles.chipActive]}
            onPress={() => setRegion(r)}
          >
            <Text style={[styles.chipText, region === r && styles.chipTextActive]}>{r}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Dietary Tags */}
      <Text style={styles.label}>Dietary Tags</Text>
      <View style={styles.chipWrap}>
        {DIETARY_TAGS.map(tag => (
          <TouchableOpacity
            key={tag}
            style={[styles.chip, dietary.includes(tag) && styles.chipActive]}
            onPress={() => toggleDietary(tag)}
          >
            <Text style={[styles.chipText, dietary.includes(tag) && styles.chipTextActive]}>{tag}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Difficulty */}
      <Text style={styles.label}>Difficulty *</Text>
      <View style={styles.chipWrap}>
        {DIFFICULTY.map(d => (
          <TouchableOpacity
            key={d}
            style={[styles.chip, difficulty === d && styles.chipActive]}
            onPress={() => setDifficulty(d)}
          >
            <Text style={[styles.chipText, difficulty === d && styles.chipTextActive]}>{d}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Cook Time, Servings, Calories */}
      <View style={styles.row}>
        <View style={styles.rowItem}>
          <Text style={styles.label}>Cook Time * </Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. 45 min"
            value={cookTime}
            onChangeText={setCookTime}
          />
        </View>
        <View style={styles.rowItem}>
          <Text style={styles.label}>Servings</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. 4"
            value={servings}
            onChangeText={setServings}
            keyboardType="number-pad"
          />
        </View>
        <View style={styles.rowItem}>
          <Text style={styles.label}>Calories</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. 420"
            value={calories}
            onChangeText={setCalories}
            keyboardType="number-pad"
          />
        </View>
      </View>

      {/* Ingredients */}
      <Text style={styles.label}>Ingredients * (one per line)</Text>
      <TextInput
        style={[styles.input, styles.multiline]}
        placeholder={`2 cups rice\n1 can tomatoes\n1 onion, diced`}
        value={ingredients}
        onChangeText={setIngredients}
        multiline
        numberOfLines={5}
      />

      {/* Steps */}
      <Text style={styles.label}>Cooking Steps * (one per line)</Text>
      <TextInput
        style={[styles.input, styles.multiline]}
        placeholder={`Blend tomatoes and peppers\nFry in hot oil for 10 mins\nAdd rice and stock`}
        value={steps}
        onChangeText={setSteps}
        multiline
        numberOfLines={5}
      />

      {/* Submit */}
      <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
        <Text style={styles.submitBtnText}>Submit Recipe 🍽️</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 16 },
  header: { flexDirection: 'row', alignItems: 'center', paddingTop: 60, marginBottom: 8, gap: 16 },
  back: { color: '#E85D04', fontSize: 22 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#1A1A1A' },
  subtitle: { fontSize: 14, color: '#666', marginBottom: 24 },
  label: { fontSize: 14, fontWeight: '600', color: '#1A1A1A', marginBottom: 8, marginTop: 16 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 10, padding: 14, fontSize: 15, marginBottom: 4 },
  multiline: { minHeight: 100, textAlignVertical: 'top' },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 4 },
  chip: { borderWidth: 1.5, borderColor: '#ddd', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8 },
  chipActive: { backgroundColor: '#E85D04', borderColor: '#E85D04' },
  chipText: { fontSize: 13, color: '#444' },
  chipTextActive: { color: '#fff', fontWeight: '600' },
  row: { flexDirection: 'row', gap: 8 },
  rowItem: { flex: 1 },
  submitBtn: { backgroundColor: '#E85D04', padding: 16, borderRadius: 10, alignItems: 'center', marginTop: 24 },
  submitBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  successContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, backgroundColor: '#fff' },
  successEmoji: { fontSize: 80, marginBottom: 16 },
  successTitle: { fontSize: 28, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 8 },
  successSubtitle: { fontSize: 15, color: '#666', textAlign: 'center', marginBottom: 32, lineHeight: 22 },
  successBtn: { backgroundColor: '#E85D04', padding: 16, borderRadius: 10, alignItems: 'center', width: '100%', marginBottom: 12 },
  successBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  uploadAnotherBtn: { padding: 16, alignItems: 'center' },
  uploadAnotherText: { color: '#E85D04', fontSize: 15, fontWeight: '600' },
});