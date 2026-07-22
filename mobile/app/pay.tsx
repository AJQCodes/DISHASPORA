import React, { useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Animated, { FadeInDown, ZoomIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { api } from '@/api';
import PrimaryButton from '@/components/PrimaryButton';
import ScreenHeader from '@/components/ScreenHeader';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { formatMoney } from '@/money';
import { colors, shadow } from '@/theme';
import type { Currency, Order, User } from '@/types';

/**
 * Paystack checkout flow for both orders and subscriptions.
 * Real Paystack URLs open in a WebView; mock/dev URLs show a "Test payment"
 * screen with a simulate button. Either path ends in POST verify.
 */
export default function Pay() {
  const params = useLocalSearchParams<{
    kind: 'order' | 'subscription';
    orderId?: string;
    reference: string;
    url: string;
    amountMinor: string;
    currency: string;
  }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();
  const cart = useCart();
  const { refreshUser } = useAuth();
  const [done, setDone] = useState(false);
  const verifiedRef = useRef(false);

  const isRealPaystack = (params.url ?? '').includes('checkout.paystack.com');
  const amount = Number(params.amountMinor ?? 0);
  const currency = (params.currency ?? 'GHS') as Currency;

  const verify = useMutation({
    mutationFn: async () => {
      if (params.kind === 'subscription') {
        return api.post<User>('/subscription/verify', { reference: params.reference });
      }
      return api.post<Order>(`/orders/${params.orderId}/verify`, {
        reference: params.reference,
      });
    },
    onSuccess: async () => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      if (params.kind === 'order') cart.clear();
      if (params.kind === 'subscription') await refreshUser();
      queryClient.invalidateQueries();
      setDone(true);
    },
  });

  const runVerify = () => {
    if (verifiedRef.current) return;
    verifiedRef.current = true;
    verify.mutate();
  };

  if (done) {
    return (
      <View style={[styles.center, { paddingTop: insets.top }]}>
        <Animated.View entering={ZoomIn.springify().damping(12)} style={styles.successBadge}>
          <Ionicons name="checkmark" size={44} color="#FFFFFF" />
        </Animated.View>
        <Animated.View entering={FadeInDown.delay(150)} style={{ alignItems: 'center' }}>
          <Text style={styles.successTitle}>
            {params.kind === 'subscription' ? 'Welcome to Premium!' : 'Payment successful'}
          </Text>
          <Text style={styles.successSub}>
            {params.kind === 'subscription'
              ? 'Ask Dishaspora, video guides and vendor chat are now unlocked.'
              : `Your order is confirmed. Reference ${params.reference}.`}
          </Text>
        </Animated.View>
        <Animated.View entering={FadeInDown.delay(280)} style={{ alignSelf: 'stretch', gap: 12, marginTop: 32 }}>
          {params.kind === 'order' ? (
            <PrimaryButton
              title="View my orders"
              onPress={() => router.replace('/orders')}
            />
          ) : (
            <PrimaryButton
              title="Ask Dishaspora"
              onPress={() => router.replace('/assistant')}
            />
          )}
          <PrimaryButton
            title="Back to home"
            variant="outline"
            onPress={() => router.dismissAll()}
          />
        </Animated.View>
      </View>
    );
  }

  if (!isRealPaystack) {
    // Mock/dev payment page
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, paddingTop: insets.top + 6 }}>
        <ScreenHeader title="Test payment" />
        <View style={styles.center}>
          <View style={styles.mockCard}>
            <View style={styles.mockLogo}>
              <Ionicons name="card-outline" size={26} color={colors.brandDark} />
            </View>
            <Text style={styles.mockAmount}>{formatMoney(amount, currency)}</Text>
            <Text style={styles.mockRef}>Ref {params.reference}</Text>
            <Text style={styles.mockNote}>
              Paystack is running in test mode — no real money moves. Tap below to
              simulate a successful charge.
            </Text>
            <PrimaryButton
              title="Simulate successful payment"
              loading={verify.isPending}
              onPress={runVerify}
              style={{ alignSelf: 'stretch', marginTop: 22 }}
            />
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, paddingTop: insets.top + 6 }}>
      <ScreenHeader title="Secure checkout" />
      <WebView
        source={{ uri: params.url! }}
        style={{ flex: 1 }}
        onNavigationStateChange={(nav) => {
          // Paystack redirects to the callback / closes the checkout when done
          if (
            nav.url.includes('callback') ||
            nav.url.includes('paystack.co/close') ||
            nav.url.includes('success')
          ) {
            runVerify();
          }
        }}
      />
      <View style={{ padding: 16, paddingBottom: Math.max(insets.bottom, 16) }}>
        <PrimaryButton
          title="I have completed payment"
          variant="outline"
          loading={verify.isPending}
          onPress={runVerify}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 28,
    backgroundColor: colors.background,
  },
  successBadge: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 22,
  },
  successTitle: { fontSize: 22, fontWeight: '800', color: colors.ink },
  successSub: {
    fontSize: 14,
    color: colors.inkSoft,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 21,
  },
  mockCard: {
    alignSelf: 'stretch',
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 26,
    alignItems: 'center',
    ...shadow,
  },
  mockLogo: {
    width: 56,
    height: 56,
    borderRadius: 20,
    backgroundColor: colors.brandLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mockAmount: { fontSize: 30, fontWeight: '800', color: colors.ink, marginTop: 16 },
  mockRef: { fontSize: 12.5, color: colors.inkFaint, marginTop: 4 },
  mockNote: {
    fontSize: 13,
    color: colors.inkSoft,
    textAlign: 'center',
    marginTop: 14,
    lineHeight: 19,
  },
});
