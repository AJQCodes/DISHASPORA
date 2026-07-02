import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';

const ORDER_STEPS = [
  { id: 1, label: 'Order Placed', emoji: '✅', desc: 'Your order has been received' },
  { id: 2, label: 'Confirmed', emoji: '🏪', desc: 'Vendor is preparing your order' },
  { id: 3, label: 'On the Way', emoji: '🛵', desc: 'Your order is out for delivery' },
  { id: 4, label: 'Delivered', emoji: '🎉', desc: 'Enjoy your meal!' },
];

export default function OrderConfirmationScreen({ navigation, route }: any) {
  const { total = 0, paymentMethod = 'momo' } = route.params || {};
  const [currentStep, setCurrentStep] = useState(1);
  const orderNumber = 'DSP-' + Math.floor(10000 + Math.random() * 90000);

  useEffect(() => {
    // Simulate order progress
    const timers = [
      setTimeout(() => setCurrentStep(2), 3000),
      setTimeout(() => setCurrentStep(3), 6000),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const paymentLabel: any = {
    momo: 'Mobile Money',
    card: 'Debit/Credit Card',
    cash: 'Cash on Delivery',
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 60 }}>
      {/* Success Header */}
      <View style={styles.successBox}>
        <Text style={styles.successEmoji}>🎉</Text>
        <Text style={styles.successTitle}>Order Placed!</Text>
        <Text style={styles.orderNumber}>Order #{orderNumber}</Text>
        <Text style={styles.successSubtitle}>
          Your order has been placed successfully. Estimated delivery time is 45 minutes.
        </Text>
      </View>

      {/* Order Details */}
      <View style={styles.detailsBox}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Total Paid</Text>
          <Text style={styles.detailValue}>GHS {total.toFixed(2)}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Payment Method</Text>
          <Text style={styles.detailValue}>{paymentLabel[paymentMethod]}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Estimated Delivery</Text>
          <Text style={styles.detailValue}>45 minutes</Text>
        </View>
      </View>

      {/* Tracking */}
      <Text style={styles.sectionTitle}>Order Tracking</Text>
      <View style={styles.trackingBox}>
        {ORDER_STEPS.map((step, i) => (
          <View key={step.id}>
            <View style={styles.stepRow}>
              <View style={[
                styles.stepCircle,
                currentStep >= step.id && styles.stepCircleActive,
                currentStep === step.id && styles.stepCircleCurrent,
              ]}>
                <Text style={styles.stepEmoji}>
                  {currentStep >= step.id ? step.emoji : '○'}
                </Text>
              </View>
              <View style={styles.stepInfo}>
                <Text style={[
                  styles.stepLabel,
                  currentStep >= step.id && styles.stepLabelActive,
                ]}>
                  {step.label}
                </Text>
                <Text style={styles.stepDesc}>{step.desc}</Text>
              </View>
              {currentStep === step.id && (
                <View style={styles.activeBadge}>
                  <Text style={styles.activeBadgeText}>Now</Text>
                </View>
              )}
            </View>
            {i < ORDER_STEPS.length - 1 && (
              <View style={[
                styles.stepLine,
                currentStep > step.id && styles.stepLineActive,
              ]} />
            )}
          </View>
        ))}
      </View>

      {/* Delivery Info */}
      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>🛵 Delivery Info</Text>
        <Text style={styles.infoText}>
          Your rider will contact you when they are nearby. Make sure your phone is reachable.
        </Text>
      </View>

      {/* Action Buttons */}
      <TouchableOpacity
        style={styles.primaryBtn}
        onPress={() => navigation.navigate('Marketplace')}
      >
        <Text style={styles.primaryBtnText}>Continue Shopping</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.secondaryBtn}
        onPress={() => navigation.navigate('HomeFeed')}
      >
        <Text style={styles.secondaryBtnText}>Back to Home</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 16 },
  successBox: { backgroundColor: '#FFF3EC', borderRadius: 20, padding: 28, alignItems: 'center', marginTop: 60, marginBottom: 20 },
  successEmoji: { fontSize: 64, marginBottom: 12 },
  successTitle: { fontSize: 28, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 4 },
  orderNumber: { fontSize: 14, color: '#E85D04', fontWeight: '600', marginBottom: 12 },
  successSubtitle: { fontSize: 14, color: '#666', textAlign: 'center', lineHeight: 20 },
  detailsBox: { backgroundColor: '#F5F5F5', borderRadius: 16, padding: 16, marginBottom: 24 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#eee' },
  detailLabel: { fontSize: 14, color: '#666' },
  detailValue: { fontSize: 14, fontWeight: '600', color: '#1A1A1A' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 16 },
  trackingBox: { backgroundColor: '#F5F5F5', borderRadius: 16, padding: 16, marginBottom: 24 },
  stepRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  stepCircle: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#ddd', alignItems: 'center', justifyContent: 'center' },
  stepCircleActive: { backgroundColor: '#FFF3EC' },
  stepCircleCurrent: { backgroundColor: '#E85D04' },
  stepEmoji: { fontSize: 20 },
  stepInfo: { flex: 1 },
  stepLabel: { fontSize: 15, fontWeight: '600', color: '#888' },
  stepLabelActive: { color: '#1A1A1A' },
  stepDesc: { fontSize: 12, color: '#888', marginTop: 2 },
  activeBadge: { backgroundColor: '#E85D04', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  activeBadgeText: { color: '#fff', fontSize: 11, fontWeight: 'bold' },
  stepLine: { width: 2, height: 24, backgroundColor: '#ddd', marginLeft: 21, marginVertical: 4 },
  stepLineActive: { backgroundColor: '#E85D04' },
  infoBox: { backgroundColor: '#FFF3EC', borderRadius: 12, padding: 16, marginBottom: 24 },
  infoTitle: { fontSize: 15, fontWeight: 'bold', color: '#E85D04', marginBottom: 8 },
  infoText: { fontSize: 14, color: '#555', lineHeight: 20 },
  primaryBtn: { backgroundColor: '#E85D04', padding: 16, borderRadius: 10, alignItems: 'center', marginBottom: 12 },
  primaryBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  secondaryBtn: { backgroundColor: '#FFF3EC', padding: 16, borderRadius: 10, alignItems: 'center', marginBottom: 12 },
  secondaryBtnText: { color: '#E85D04', fontSize: 16, fontWeight: '600' },
});