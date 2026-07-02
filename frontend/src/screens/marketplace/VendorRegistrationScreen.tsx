import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, TextInput, Alert
} from 'react-native';

const COUNTRIES = ['Ghana', 'Nigeria', 'Kenya', 'South Africa', 'Ethiopia', 'United Kingdom', 'United States', 'Canada', 'Other'];
const CATEGORIES = ['Home Kitchen', 'Restaurant', 'Street Food', 'Catering', 'Grocery & Ingredients', 'Bakery', 'Drinks & Beverages'];

export default function VendorRegistrationScreen({ navigation }: any) {
  const [businessName, setBusinessName] = useState('');
  const [description, setDescription] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!businessName || !country || !phone || !email || !category) {
      Alert.alert('Missing Fields', 'Please fill in all required fields.');
      return;
    }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <View style={styles.successContainer}>
        <Text style={styles.successEmoji}>🏪</Text>
        <Text style={styles.successTitle}>Application Submitted!</Text>
        <Text style={styles.successSubtitle}>
          Your vendor application for {businessName} has been submitted. 
          We will review it and get back to you within 24-48 hours.
        </Text>
        <TouchableOpacity
  style={styles.successBtn}
  onPress={() => navigation.reset({
    index: 1,
    routes: [
      { name: 'HomeFeed' },
      { name: 'Marketplace' },
    ],
  })}
>
  <Text style={styles.successBtnText}>Back to Marketplace</Text>
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
        <Text style={styles.title}>Become a Vendor</Text>
      </View>

      <Text style={styles.subtitle}>
        Join thousands of vendors selling food and ingredients on Dishaspora.
      </Text>

      {/* Business Name */}
      <Text style={styles.label}>Business Name *</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. Mama Akua Kitchen"
        value={businessName}
        onChangeText={setBusinessName}
      />

      {/* Category */}
      <Text style={styles.label}>Business Category *</Text>
      <View style={styles.chipWrap}>
        {CATEGORIES.map(cat => (
          <TouchableOpacity
            key={cat}
            style={[styles.chip, category === cat && styles.chipActive]}
            onPress={() => setCategory(cat)}
          >
            <Text style={[styles.chipText, category === cat && styles.chipTextActive]}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Description */}
      <Text style={styles.label}>Business Description</Text>
      <TextInput
        style={[styles.input, styles.multiline]}
        placeholder="Tell customers about your business, specialties, and what makes you unique..."
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
      />

      {/* Country */}
      <Text style={styles.label}>Country *</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
        {COUNTRIES.map(c => (
          <TouchableOpacity
            key={c}
            style={[styles.chip, country === c && styles.chipActive]}
            onPress={() => setCountry(c)}
          >
            <Text style={[styles.chipText, country === c && styles.chipTextActive]}>{c}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* City */}
      <Text style={styles.label}>City</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. Accra"
        value={city}
        onChangeText={setCity}
      />

      {/* Contact */}
      <Text style={styles.label}>Phone Number *</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. 024XXXXXXX"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />

      <Text style={styles.label}>Business Email *</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. business@email.com"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      {/* Logo Placeholder */}
      <Text style={styles.label}>Business Logo</Text>
      <TouchableOpacity style={styles.logoUpload}>
        <Text style={styles.logoUploadEmoji}>📸</Text>
        <Text style={styles.logoUploadText}>Tap to upload your logo</Text>
        <Text style={styles.logoUploadSubtext}>JPG or PNG, max 5MB</Text>
      </TouchableOpacity>

      {/* Terms */}
      <View style={styles.termsBox}>
        <Text style={styles.termsText}>
          By submitting, you agree to Dishaspora's Vendor Terms of Service and
          confirm that all information provided is accurate.
        </Text>
      </View>

      <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
        <Text style={styles.submitBtnText}>Submit Application 🏪</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 16 },
  header: { flexDirection: 'row', alignItems: 'center', paddingTop: 60, marginBottom: 8, gap: 16 },
  back: { color: '#E85D04', fontSize: 22 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#1A1A1A' },
  subtitle: { fontSize: 14, color: '#666', marginBottom: 24, lineHeight: 20 },
  label: { fontSize: 14, fontWeight: '600', color: '#1A1A1A', marginBottom: 8, marginTop: 16 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 10, padding: 14, fontSize: 15, marginBottom: 4 },
  multiline: { minHeight: 100, textAlignVertical: 'top' },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chipRow: { marginBottom: 4 },
  chip: { borderWidth: 1.5, borderColor: '#ddd', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8, marginRight: 8, marginBottom: 8 },
  chipActive: { backgroundColor: '#E85D04', borderColor: '#E85D04' },
  chipText: { fontSize: 13, color: '#444' },
  chipTextActive: { color: '#fff', fontWeight: '600' },
  logoUpload: { borderWidth: 2, borderColor: '#ddd', borderRadius: 12, borderStyle: 'dashed', padding: 24, alignItems: 'center', marginBottom: 4 },
  logoUploadEmoji: { fontSize: 36, marginBottom: 8 },
  logoUploadText: { fontSize: 15, fontWeight: '600', color: '#444' },
  logoUploadSubtext: { fontSize: 12, color: '#888', marginTop: 4 },
  termsBox: { backgroundColor: '#F5F5F5', borderRadius: 10, padding: 14, marginTop: 16, marginBottom: 8 },
  termsText: { fontSize: 12, color: '#666', lineHeight: 18 },
  submitBtn: { backgroundColor: '#E85D04', padding: 16, borderRadius: 10, alignItems: 'center', marginTop: 16 },
  submitBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  successContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, backgroundColor: '#fff' },
  successEmoji: { fontSize: 80, marginBottom: 16 },
  successTitle: { fontSize: 28, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 8 },
  successSubtitle: { fontSize: 15, color: '#666', textAlign: 'center', marginBottom: 32, lineHeight: 22 },
  successBtn: { backgroundColor: '#E85D04', padding: 16, borderRadius: 10, alignItems: 'center', width: '100%' },
  successBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});