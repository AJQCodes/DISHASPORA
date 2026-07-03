import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { IMG } from '../config';
import { formatMoney } from '../money';
import { colors, shadow } from '../theme';
import type { CartItem } from '../context/CartContext';

/**
 * Cart row (ref pattern #13): white card, rounded image, title + rating/time,
 * circular − / count / + stepper (plus = orange outline), price at right.
 */
export default function StepperRow({
  item,
  onInc,
  onDec,
}: {
  item: CartItem;
  onInc: () => void;
  onDec: () => void;
}) {
  const { listing, qty } = item;
  return (
    <View style={styles.card}>
      <Image
        source={{ uri: IMG(listing.imageUrl) }}
        style={styles.image}
        contentFit="cover"
      />
      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={2}>
          {listing.title}
        </Text>
        <View style={styles.metaRow}>
          {listing.type === 'INGREDIENT' ? (
            <Text style={styles.metaText}>
              {listing.quantity} {listing.unit}
            </Text>
          ) : (
            <>
              <Ionicons name="time-outline" size={12} color={colors.inkFaint} />
              <Text style={styles.metaText}>
                {listing.prepMinutes ? `${listing.prepMinutes} min` : 'Fresh'}
              </Text>
            </>
          )}
        </View>
        <View style={styles.bottomRow}>
          <View style={styles.stepper}>
            <TouchableOpacity style={styles.stepBtn} onPress={onDec} hitSlop={6}>
              <Ionicons name="remove" size={16} color={colors.inkSoft} />
            </TouchableOpacity>
            <Text style={styles.qty}>{qty}</Text>
            <TouchableOpacity
              style={[styles.stepBtn, styles.stepBtnPlus]}
              onPress={onInc}
              hitSlop={6}
            >
              <Ionicons name="add" size={16} color={colors.accentDark} />
            </TouchableOpacity>
          </View>
          <Text style={styles.price}>
            {formatMoney(listing.amountMinor * qty, listing.currency)}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 10,
    gap: 12,
    ...shadow,
  },
  image: {
    width: 88,
    height: 88,
    borderRadius: 16,
    backgroundColor: colors.surfaceAlt,
  },
  body: { flex: 1, justifyContent: 'space-between' },
  title: { fontSize: 14.5, fontWeight: '600', color: colors.ink },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  metaText: { fontSize: 12, color: colors.inkFaint },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  stepper: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  stepBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBtnPlus: { borderColor: colors.accent },
  qty: { fontSize: 15, fontWeight: '700', color: colors.ink, minWidth: 18, textAlign: 'center' },
  price: { fontSize: 14, fontWeight: '700', color: colors.accentDark },
});
