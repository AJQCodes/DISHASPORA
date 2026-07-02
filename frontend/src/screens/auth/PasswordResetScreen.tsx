import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';

export default function PasswordResetScreen({ navigation }: any) {
  const [step, setStep] = useState<'request' | 'confirm'>('request');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRequest = () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }
    Alert.alert('Code Sent', `A reset code has been sent to ${email}`);
    setStep('confirm');
  };

  const handleConfirm = () => {
    if (!code || !newPassword || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }
    Alert.alert('Success', 'Password reset successfully!', [
      { text: 'Log In', onPress: () => navigation.navigate('Login') }
    ]);
  };

  return (
    <View style={styles.container}>
      {step === 'request' ? (
        <>
          <Text style={styles.emoji}>🔐</Text>
          <Text style={styles.title}>Forgot Password?</Text>
          <Text style={styles.subtitle}>
            Enter your email address and we'll send you a code to reset your password.
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Email address"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TouchableOpacity style={styles.button} onPress={handleRequest}>
            <Text style={styles.buttonText}>Send Reset Code</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={styles.emoji}>✅</Text>
          <Text style={styles.title}>Enter New Password</Text>
          <Text style={styles.subtitle}>
            Enter the code sent to your email and choose a new password.
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Verification code"
            value={code}
            onChangeText={setCode}
            keyboardType="number-pad"
          />
          <TextInput
            style={styles.input}
            placeholder="New password"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
          />
          <TextInput
            style={styles.input}
            placeholder="Confirm new password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />

          <TouchableOpacity style={styles.button} onPress={handleConfirm}>
            <Text style={styles.buttonText}>Reset Password</Text>
          </TouchableOpacity>
        </>
      )}

      <TouchableOpacity onPress={() => navigation.navigate('Login')} style={{ marginTop: 16 }}>
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
  input: {
    borderWidth: 1, borderColor: '#ddd', borderRadius: 10,
    padding: 14, marginBottom: 16, fontSize: 16,
  },
  button: { backgroundColor: '#E85D04', padding: 16, borderRadius: 10, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  back: { color: '#999', textAlign: 'center', fontSize: 14 },
});