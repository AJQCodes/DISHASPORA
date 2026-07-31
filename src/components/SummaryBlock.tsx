import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { formatMoney } from '../money';
import { colors } from '../theme';
import type { Currency } from '../types';

/** Order Summary block (ref pattern #14): label/value rows, divider, bold Total. */
export default function SummaryBlock({
  subtotalMinor,
  feeMinor,
  deliveryMinor,
  totalMinor,
  currency,
  style,
}: {
  subtotalMinor: number;
  feeMinor: number;
  deliveryMinor: number;
  totalMinor: number;
  currency: Currency;
  style?: ViewStyle;
}) {
  const Row = ({ label, value, bold }: { label: string; value: number; bold?: boolean }) => (
    <View style={styles.row}>
      <Text style={[styles.label, bold && styles.boldLabel]}>{label}</Text>
      <Text style={[styles.value, bold && styles.boldValue]}>
        {formatMoney(value, currency)}
      </Text>
    </View>
  );
  return (
    <View style={style}>
      <Text style={styles.heading}>Order Summary</Text>
      <Row label="Sub Total" value={subtotalMinor} />
      <Row label="Taxes & Fee" value={feeMinor} />
      <Row label="Delivery Fee" value={deliveryMinor} />
      <View style={styles.divider} />
      <Row label="Total" value={totalMinor} bold />
    </View>
  );
}

const styles = StyleSheet.create({
  heading: { fontSize: 17, fontWeight: '700', color: colors.ink, marginBottom: 12 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  label: { fontSize: 14, color: colors.inkSoft },
  value: { fontSize: 14, color: colors.ink, fontWeight: '500' },
  boldLabel: { fontSize: 16, fontWeight: '700', color: colors.ink },
  boldValue: { fontSize: 16, fontWeight: '700', color: colors.ink },
  divider: { height: 1, backgroundColor: colors.surfaceAlt, marginVertical: 10 },
});
