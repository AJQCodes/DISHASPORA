import React from 'react';
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import Animated, { FadeInDown, SlideInDown } from 'react-native-reanimated';
import { api } from '@/api';
import { IMG } from '@/config';
import { useCart } from '@/context/CartContext';
import { formatMoney } from '@/money';
import { colors, shadowStrong } from '@/theme';
import type { Basket } from '@/types';
import Avatar from './Avatar';
import PrimaryButton from './PrimaryButton';
import { Skeleton } from './Skeleton';

/** One-Click Ingredient Basket bottom sheet (GET /recipes/{id}/basket). */
export default function BasketSheet({
  recipeId,
  visible,
  onClose,
}: {
  recipeId: number;
  visible: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const cart = useCart();
  const basket = useQuery({
    queryKey: ['basket', recipeId],
    queryFn: () => api.get<Basket>(`/recipes/${recipeId}/basket`),
    enabled: visible,
  });

  const data = basket.data;

  const addAll = () => {
    if (!data || data.items.length === 0) return;
    const rows = data.items.map((it) => ({ listing: it.listing, qty: it.qty }));
    const res = cart.addAll(rows);
    if (res === 'different-vendor') {
      Alert.alert(
        'Start a new cart?',
        `Your cart has items from ${cart.vendorName}. Only one vendor per order — replace it with this basket?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Replace',
            style: 'destructive',
            onPress: () => {
              cart.replaceAllWith(rows);
              onClose();
              router.push('/cart');
            },
          },
        ]
      );
      return;
    }
    onClose();
    router.push('/cart');
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <TouchableOpacity style={{ flex: 1 }} onPress={onClose} />
        <Animated.View entering={SlideInDown.springify().damping(18)} style={styles.sheet}>
          <View style={styles.handle} />
          <Text style={styles.title}>Ingredient Basket</Text>
          {basket.isLoading ? (
            <View style={{ gap: 12, marginTop: 12 }}>
              <Skeleton height={52} radius={16} />
              <Skeleton height={52} radius={16} />
              <Skeleton height={52} radius={16} />
            </View>
          ) : !data || !data.vendor || data.items.length === 0 ? (
            <Text style={styles.emptyText}>
              No ingredient vendor near you stocks these items yet. Check the market for
              individual ingredients.
            </Text>
          ) : (
            <>
              <View style={styles.vendorRow}>
                <Avatar url={data.vendor.logoUrl} name={data.vendor.name} size={38} square />
                <View style={{ flex: 1 }}>
                  <Text style={styles.vendorName}>{data.vendor.name}</Text>
                  <Text style={styles.vendorMeta}>
                    {data.vendor.location} · matches {data.items.length} of{' '}
                    {data.items.length + data.unmatched.length} ingredients
                  </Text>
                </View>
              </View>
              <ScrollView style={{ maxHeight: 320 }} showsVerticalScrollIndicator={false}>
                {data.items.map((item, i) => (
                  <Animated.View
                    key={`${item.listing.id}-${i}`}
                    entering={FadeInDown.delay(i * 40)}
                    style={styles.itemRow}
                  >
                    <Image
                      source={{ uri: IMG(item.listing.imageUrl) }}
                      style={styles.itemImg}
                      contentFit="cover"
                    />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.itemName}>{item.ingredient.name}</Text>
                      <Text style={styles.itemSub}>
                        {item.listing.title} · {item.listing.quantity} {item.listing.unit}
                      </Text>
                    </View>
                    <Text style={styles.itemPrice}>
                      {formatMoney(item.listing.amountMinor * item.qty, item.listing.currency)}
                    </Text>
                  </Animated.View>
                ))}
                {data.unmatched.map((ingredient, i) => (
                  <View key={`u-${i}`} style={[styles.itemRow, { opacity: 0.45 }]}>
                    <View style={[styles.itemImg, styles.unmatchedImg]}>
                      <Ionicons name="close" size={16} color={colors.inkFaint} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.itemName}>{ingredient.name}</Text>
                      <Text style={styles.itemSub}>not available nearby</Text>
                    </View>
                  </View>
                ))}
              </ScrollView>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>
                  {formatMoney(data.totalMinor, data.currency)}
                </Text>
              </View>
              <PrimaryButton title="Add all to cart" onPress={addAll} />
            </>
          )}
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(23,37,42,0.45)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 20,
    paddingBottom: 34,
    ...shadowStrong,
  },
  handle: {
    alignSelf: 'center',
    width: 44,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.surfaceAlt,
    marginBottom: 14,
  },
  title: { fontSize: 18, fontWeight: '700', color: colors.ink },
  emptyText: { fontSize: 13.5, color: colors.inkSoft, marginTop: 12, lineHeight: 20 },
  vendorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.brandLight,
    borderRadius: 16,
    padding: 12,
    marginVertical: 14,
  },
  vendorName: { fontSize: 14, fontWeight: '700', color: colors.ink },
  vendorMeta: { fontSize: 11.5, color: colors.inkSoft, marginTop: 1 },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8,
  },
  itemImg: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: colors.surfaceAlt,
  },
  unmatchedImg: { alignItems: 'center', justifyContent: 'center' },
  itemName: { fontSize: 13.5, fontWeight: '600', color: colors.ink },
  itemSub: { fontSize: 11.5, color: colors.inkFaint, marginTop: 1 },
  itemPrice: { fontSize: 13, fontWeight: '700', color: colors.accentDark },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderTopWidth: 1,
    borderColor: colors.surfaceAlt,
    marginTop: 6,
    marginBottom: 8,
  },
  totalLabel: { fontSize: 15, fontWeight: '700', color: colors.ink },
  totalValue: { fontSize: 16, fontWeight: '800', color: colors.ink },
});
