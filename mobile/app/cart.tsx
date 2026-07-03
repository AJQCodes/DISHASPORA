import React from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useMutation } from '@tanstack/react-query';
import Animated, { FadeInDown, Layout } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { api } from '@/api';
import EmptyState from '@/components/EmptyState';
import PrimaryButton from '@/components/PrimaryButton';
import ScreenHeader from '@/components/ScreenHeader';
import StepperRow from '@/components/StepperRow';
import SummaryBlock from '@/components/SummaryBlock';
import { useCart } from '@/context/CartContext';
import { colors, shadow } from '@/theme';
import type { OrderCreateResponse } from '@/types';

// Fees mirror the backend: 7% platform fee + flat 300 minor units delivery.
const FEE_RATE = 0.07;
const DELIVERY_MINOR = 300;

export default function Cart() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const cart = useCart();

  const checkout = useMutation({
    mutationFn: () =>
      api.post<OrderCreateResponse>('/orders', {
        items: cart.items.map((it) => ({ listingId: it.listing.id, qty: it.qty })),
      }),
    onSuccess: ({ order, payment }) => {
      router.push({
        pathname: '/pay',
        params: {
          kind: 'order',
          orderId: String(order.id),
          reference: payment.reference,
          url: payment.authorizationUrl,
          amountMinor: String(payment.amountMinor),
          currency: payment.currency,
        },
      });
    },
    onError: (e: any) =>
      Alert.alert('Checkout failed', e?.message ?? 'Could not create the order.'),
  });

  const feeMinor = Math.round(cart.subtotalMinor * FEE_RATE);
  const totalMinor = cart.subtotalMinor + feeMinor + DELIVERY_MINOR;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, paddingTop: insets.top + 6 }}>
      <ScreenHeader title="My Cart" />
      {cart.items.length === 0 ? (
        <EmptyState
          image={1}
          message="Your cart is empty. Fill it from the market or a recipe's ingredient basket."
          actionLabel="Browse the market"
          onAction={() => router.push('/(tabs)/market')}
          style={{ marginTop: 40 }}
        />
      ) : (
        <ScrollView
          contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.vendorChip}>
            <Text style={styles.vendorChipText}>Ordering from {cart.vendorName}</Text>
          </View>
          <View style={{ gap: 12 }}>
            {cart.items.map((item, i) => (
              <Animated.View
                key={item.listing.id}
                entering={FadeInDown.delay(i * 50).duration(300)}
                layout={Layout.springify()}
              >
                <StepperRow
                  item={item}
                  onInc={() => cart.setQty(item.listing.id, item.qty + 1)}
                  onDec={() => cart.setQty(item.listing.id, item.qty - 1)}
                />
              </Animated.View>
            ))}
          </View>

          <Animated.View layout={Layout.springify()} style={styles.summaryCard}>
            <SummaryBlock
              subtotalMinor={cart.subtotalMinor}
              feeMinor={feeMinor}
              deliveryMinor={DELIVERY_MINOR}
              totalMinor={totalMinor}
              currency={cart.currency ?? 'GHS'}
            />
            <PrimaryButton
              title="Checkout"
              variant="black"
              loading={checkout.isPending}
              onPress={() => checkout.mutate()}
              style={{ marginTop: 16 }}
            />
          </Animated.View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  vendorChip: {
    alignSelf: 'flex-start',
    backgroundColor: colors.brandLight,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 7,
    marginBottom: 14,
  },
  vendorChipText: { fontSize: 12.5, fontWeight: '700', color: colors.brandDark },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    marginTop: 20,
    ...shadow,
  },
});
