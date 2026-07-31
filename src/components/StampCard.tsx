import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';
import type { PassportStamp } from '../types';
import Flag from './Flag';

/**
 * Passport stamp card: stamped = brandLight card with flag + cyan check seal;
 * unstamped = dashed-border gray card.
 */
export default function StampCard({ stamp, style }: { stamp: PassportStamp; style?: ViewStyle }) {
  if (!stamp.stamped) {
    return (
      <View style={[styles.card, styles.dashed, style]}>
        <View style={{ opacity: 0.4 }}>
          <Flag country={stamp.country} size={26} />
        </View>
        <Text style={styles.nameDim}>{stamp.countryName}</Text>
        <Text style={styles.progressDim}>
          {stamp.recipesCooked}/{stamp.totalRecipes} dishes
        </Text>
      </View>
    );
  }
  return (
    <View style={[styles.card, styles.stamped, style]}>
      <View style={styles.seal}>
        <Ionicons name="checkmark" size={12} color="#FFFFFF" />
      </View>
      <Flag country={stamp.country} size={26} />
      <Text style={styles.name}>{stamp.countryName}</Text>
      <Text style={styles.cuisine}>{stamp.cuisine}</Text>
      <Text style={styles.progress}>
        {stamp.recipesCooked}/{stamp.totalRecipes} dishes
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 20,
    padding: 14,
    alignItems: 'center',
    minHeight: 128,
    justifyContent: 'center',
  },
  stamped: { backgroundColor: colors.brandLight },
  dashed: {
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: colors.inkFaint,
    backgroundColor: '#FFFFFF',
  },
  seal: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.brandDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: { fontSize: 13.5, fontWeight: '700', color: colors.ink, marginTop: 6 },
  nameDim: { fontSize: 13.5, fontWeight: '600', color: colors.inkFaint, marginTop: 6 },
  cuisine: { fontSize: 11, color: colors.brandDark, marginTop: 1 },
  progress: { fontSize: 11.5, color: colors.inkSoft, marginTop: 5, fontWeight: '600' },
  progressDim: { fontSize: 11.5, color: colors.inkFaint, marginTop: 5 },
});
