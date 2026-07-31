import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { formatMoney } from '../money';
import { colors } from '../theme';
import type { Currency } from '../types';

/** Price in accent orange + optional strikethrough compare-at price. */
export default function Price({
  amountMinor,
  currency,
  compareAtMinor,
  size = 15,
  style,
}: {
  amountMinor: number;
  currency: Currency;
  compareAtMinor?: number | null;
  size?: number;
  style?: ViewStyle;
}) {
  return (
    <View style={[styles.row, style]}>
      <Text style={[styles.price, { fontSize: size }]}>
        {formatMoney(amountMinor, currency)}
      </Text>
      {compareAtMinor ? (
        <Text style={[styles.compare, { fontSize: size - 3 }]}>
          {formatMoney(compareAtMinor, currency)}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  price: { color: colors.accentDark, fontWeight: '700' },
  compare: { color: colors.inkFaint, textDecorationLine: 'line-through' },
});
