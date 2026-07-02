import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

export default function SplashScreen({ navigation }: any) {
  const opacity = new Animated.Value(0);
  const scale = new Animated.Value(0.8);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 900,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      navigation.replace('Login');
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.logoBox, { opacity, transform: [{ scale }] }]}>
        <Text style={styles.logo}>🍜</Text>
        <Text style={styles.title}>Dishaspora</Text>
        <Text style={styles.tagline}>Where cultures meet through food.</Text>
      </Animated.View>
      <Text style={styles.footer}>CodeQuest 2026 · Group 12</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E85D04',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoBox: {
    alignItems: 'center',
  },
  logo: {
    fontSize: 72,
    marginBottom: 16,
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  tagline: {
    fontSize: 16,
    color: '#FFD6B8',
    marginTop: 8,
    fontStyle: 'italic',
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    fontSize: 12,
    color: '#FFD6B8',
  },
});