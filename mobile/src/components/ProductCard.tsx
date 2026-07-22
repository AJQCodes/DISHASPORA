import React from 'react';
import { Alert, StyleSheet, Text, View, ViewStyle } from 'react-native';
import PressableScale from './PressableScale';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { IMG } from '../config';
import { useCart } from '../context/CartContext';
import { colors, shadow } from '../theme';
import type { Listing } from '../types';
import Avatar from './Avatar';
import Price from './Price';
import PrimaryButton from './PrimaryButton';

/**
 * Product card (ref pattern #2, product variant): image with vendor chip + orange
 * arrow overlay, title, subtitle, price + strikethrough, orange "Buy now" pill.
 */
export default function ProductCard({
  listing,
  style,
  hideVendor,
}: {
  listing: Listing;
  style?: ViewStyle;
  hideVendor?: boolean;
}) {
  const router = useRouter();
  const cart = useCart();

  const buyNow = () => {
    if (!listing.available) return;
    const res = cart.add(listing);
    if (res === 'different-vendor') {
      Alert.alert(
        'Start a new cart?',
        `Your cart has items from ${cart.vendorName}. Only one vendor per order — replace the cart with items from ${listing.vendorName}?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Replace', style: 'destructive', onPress: () => cart.replaceWith(listing) },
        ]
      );
    }
  };

  const openVendor = () =>
    router.push({ pathname: '/vendor/[id]', params: { id: String(listing.vendorId) } });

  return (
    <View style={[styles.card, style]}>
      <PressableScale onPress={openVendor} tilt>
        <View style={styles.imageWrap}>
          <Image
            source={{ uri: IMG(listing.imageUrl) }}
            style={styles.image}
            contentFit="cover"
            transition={150}
          />
          {listing.prepMinutes ? (
            <View style={styles.timeChip}>
              <Ionicons name="time-outline" size={10} color="#FFFFFF" />
              <Text style={styles.timeChipText}>{listing.prepMinutes} min</Text>
            </View>
          ) : null}
          {!hideVendor ? (
            <View style={styles.overlayRow}>
              <View style={styles.vendorChip}>
                <Avatar url={listing.vendorLogoUrl} name={listing.vendorName} size={18} />
                <Text style={styles.vendorName} numberOfLines={1}>
                  {listing.vendorName}
                </Text>
              </View>
              <View style={styles.arrowBtn}>
                <Ionicons name="arrow-forward" size={14} color="#FFFFFF" />
              </View>
            </View>
          ) : null}
        </View>
      </PressableScale>
      <Text style={styles.title} numberOfLines={1}>
        {listing.title}
      </Text>
      <Text style={styles.subtitle} numberOfLines={1}>
        {listing.type === 'INGREDIENT'
          ? `${listing.quantity} ${listing.unit}`
          : listing.description || listing.vendorName}
      </Text>
      <Price
        amountMinor={listing.amountMinor}
        currency={listing.currency}
        compareAtMinor={listing.compareAtMinor}
        style={{ marginTop: 4 }}
      />
      <PrimaryButton
        title={listing.available ? 'Buy now' : 'Out of stock'}
        small
        disabled={!listing.available}
        onPress={buyNow}
        style={{ marginTop: 8 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: { flex: 1 },
  imageWrap: {
    borderRadius: 20,
    overflow: 'hidden',
    aspectRatio: 1,
    backgroundColor: colors.surfaceAlt,
    ...shadow,
  },
  image: { width: '100%', height: '100%' },
  timeChip: {
    position: 'absolute',
    top: 8,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(23,37,42,0.65)',
    borderRadius: 999,
    paddingVertical: 3,
    paddingHorizontal: 8,
  },
  timeChipText: { color: '#FFFFFF', fontSize: 9.5, fontWeight: '600' },
  overlayRow: {
    position: 'absolute',
    left: 8,
    right: 8,
    bottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  vendorChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(23,37,42,0.65)',
    borderRadius: 999,
    paddingVertical: 5,
    paddingHorizontal: 7,
  },
  vendorName: { flex: 1, color: '#FFFFFF', fontSize: 11, fontWeight: '600' },
  arrowBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { fontSize: 14, fontWeight: '600', color: colors.ink, marginTop: 8 },
  subtitle: { fontSize: 12, color: colors.inkFaint, marginTop: 1 },
});
