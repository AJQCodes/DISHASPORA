import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { IMG } from '../config';
import { colors } from '../theme';

export default function Avatar({
  url,
  name,
  size = 40,
  square,
}: {
  url?: string | null;
  name?: string;
  size?: number;
  square?: boolean;
}) {
  const borderRadius = square ? size * 0.28 : size / 2;
  const src = IMG(url);
  if (src) {
    return (
      <Image
        source={{ uri: src }}
        style={{ width: size, height: size, borderRadius, backgroundColor: colors.surfaceAlt }}
        contentFit="cover"
      />
    );
  }
  const initial = (name ?? '?').trim().charAt(0).toUpperCase() || '?';
  return (
    <View
      style={[
        styles.fallback,
        { width: size, height: size, borderRadius },
      ]}
    >
      <Text style={[styles.initial, { fontSize: size * 0.42 }]}>{initial}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  fallback: {
    backgroundColor: colors.brandLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initial: { color: colors.brandDark, fontWeight: '700' },
});
