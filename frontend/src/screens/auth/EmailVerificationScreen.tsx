import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';

export default function EmailVerificationScreen({ navigation, route }: any) {
  const [code, setCode] = useState('');

  const handleVerify = () => {
    if (code.length < 4) {
      Alert.alert('Error', 'Please enter the verification code');
      return;
    }
    // Backend connection comes later
    navigation.navigate('Onboarding');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>📧</Text>
      <Text style={styles.title}>Check your email</Text>
      <Text style={styles.subtitle}>
        We sent a verification code to your email address. Enter it below to continue.
      </Text>

      <TextInput
        style={styles.codeInput}
        placeholder="Enter code"
        value={code}
        onChangeText={setCode}
        keyboardType="number-pad"
        maxLength={6}
        textAlign="center"
      />

      <TouchableOpacity style={styles.button} onPress={handleVerify}>
        <Text style={styles.buttonText}>Verify Email</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => Alert.alert('Resent!', 'A new code has been sent.')}>
        <Text style={styles.link}>Didn't get a code? Resend</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')} style={{ marginTop: 12 }}>
        <Text style={styles.back}>← Back to Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#fff' },
  emoji: { fontSize: 56, textAlign: 'center', marginBottom: 16 },
  title: { fontSize: 26, fontWeight: 'bold', color: '#1A1A1A', textAlign: 'center', marginBottom: 12 },
  subtitle: { fontSize: 15, color: '#666', textAlign: 'center', marginBottom: 32, lineHeight: 22 },
  codeInput: {
    borderWidth: 2, borderColor: '#E85D04', borderRadius: 12,
    padding: 16, fontSize: 24, marginBottom: 24, letterSpacing: 8,
  },
  button: { backgroundColor: '#E85D04', padding: 16, borderRadius: 10, alignItems: 'center', marginBottom: 16 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  link: { color: '#E85D04', textAlign: 'center', fontSize: 14 },
  back: { color: '#999', textAlign: 'center', fontSize: 14 },
});