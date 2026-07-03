import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';

export default function RatingStars({
  rating,
  reviewCount,
  size = 14,
  onRate,
}: {
  rating: number;
  reviewCount?: number;
  size?: number;
  /** When provided, stars become tappable (for review input). */
  onRate?: (rating: number) => void;
}) {
  const stars = [1, 2, 3, 4, 5];
  return (
    <View style={styles.row}>
      {onRate ? (
        stars.map((s) => (
          <TouchableOpacity key={s} onPress={() => onRate(s)} hitSlop={6}>
            <Ionicons
              name={s <= Math.round(rating) ? 'star' : 'star-outline'}
              size={size + 6}
              color={colors.star}
            />
          </TouchableOpacity>
        ))
      ) : (
        <>
          <Ionicons name="star" size={size} color={colors.star} />
          <Text style={[styles.rating, { fontSize: size - 1 }]}>
            {rating ? rating.toFixed(1) : '—'}
          </Text>
          {reviewCount !== undefined ? (
            <Text style={[styles.count, { fontSize: size - 2 }]}>
              ({reviewCount}+ Review)
            </Text>
          ) : null}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  rating: { color: colors.ink, fontWeight: '700' },
  count: { color: colors.inkFaint },
});
