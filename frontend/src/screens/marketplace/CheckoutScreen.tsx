import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, Alert } from 'react-native';

const PAYMENT_METHODS = [
  { id: 'momo', label: 'Mobile Money', emoji: '📱' },
  { id: 'card', label: 'Debit/Credit Card', emoji: '💳' },
  { id: 'cash', label: 'Cash on Delivery', emoji: '💵' },
];

export default function CheckoutScreen({ navigation, route }: any) {
  const { cart = [], total = 0 } = route.params || {};
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('momo');
  const [momoNumber, setMomoNumber] = useState('');
  const [note, setNote] = useState('');

  const handlePlaceOrder = () => {
    if (!address || !phone) {
      Alert.alert('Missing Info', 'Please fill in your delivery address and phone number.');
      return;
    }
    if (paymentMethod === 'momo' && !momoNumber) {
      Alert.alert('Missing Info', 'Please enter your Mobile Money number.');
      return;
    }
    navigation.navigate('OrderConfirmation', { total, paymentMethod });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Checkout</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 160 }}>
        {/* Delivery Details */}
        <Text style={styles.sectionTitle}>📍 Delivery Details</Text>
        <TextInput
          style={styles.input}
          placeholder="Delivery address"
          value={address}
          onChangeText={setAddress}
          multiline
        />
        <TextInput
          style={styles.input}
          placeholder="Phone number"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />
        <TextInput
          style={[styles.input, styles.multiline]}
          placeholder="Delivery note (optional) e.g. Gate color, landmark..."
          value={note}
          onChangeText={setNote}
          multiline
          numberOfLines={2}
        />

        {/* Payment Method */}
        <Text style={styles.sectionTitle}>💳 Payment Method</Text>
        {PAYMENT_METHODS.map(method => (
          <TouchableOpacity
            key={method.id}
            style={[styles.paymentCard, paymentMethod === method.id && styles.paymentCardActive]}
            onPress={() => setPaymentMethod(method.id)}
          >
            <Text style={styles.paymentEmoji}>{method.emoji}</Text>
            <Text style={[styles.paymentLabel, paymentMethod === method.id && styles.paymentLabelActive]}>
              {method.label}
            </Text>
            <View style={[styles.radio, paymentMethod === method.id && styles.radioActive]}>
              {paymentMethod === method.id && <View style={styles.radioDot} />}
            </View>
          </TouchableOpacity>
        ))}

        {/* MoMo Number */}
        {paymentMethod === 'momo' && (
          <TextInput
            style={styles.input}
            placeholder="Mobile Money number (e.g. 024XXXXXXX)"
            value={momoNumber}
            onChangeText={setMomoNumber}
            keyboardType="phone-pad"
          />
        )}

        {/* Order Summary */}
        <Text style={styles.sectionTitle}>🧾 Order Summary</Text>
        <View style={styles.summaryBox}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Items ({cart.length})</Text>
            <Text style={styles.summaryValue}>GHS {(total - 15).toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Delivery Fee</Text>
            <Text style={styles.summaryValue}>GHS 15.00</Text>
          </View>
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>GHS {total.toFixed(2)}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Place Order Button */}
      <View style={styles.bottomBox}>
        <TouchableOpacity style={styles.orderBtn} onPress={handlePlaceOrder}>
          <Text style={styles.orderBtnText}>Place Order · GHS {total.toFixed(2)}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 16 },
  header: { flexDirection: 'row', alignItems: 'center', paddingTop: 60, marginBottom: 20, gap: 16 },
  back: { color: '#E85D04', fontSize: 22 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#1A1A1A' },
  sectionTitle: { fontSize: 17, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 12, marginTop: 8 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 10, padding: 14, fontSize: 15, marginBottom: 12 },
  multiline: { minHeight: 70, textAlignVertical: 'top' },
  paymentCard: { flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderColor: '#ddd', borderRadius: 12, padding: 14, marginBottom: 10, gap: 12 },
  paymentCardActive: { borderColor: '#E85D04', backgroundColor: '#FFF3EC' },
  paymentEmoji: { fontSize: 24 },
  paymentLabel: { flex: 1, fontSize: 15, color: '#444', fontWeight: '500' },
  paymentLabelActive: { color: '#E85D04', fontWeight: '600' },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: '#ddd', alignItems: 'center', justifyContent: 'center' },
  radioActive: { borderColor: '#E85D04' },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#E85D04' },
  summaryBox: { backgroundColor: '#FFF3EC', borderRadius: 16, padding: 16, marginBottom: 8 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  summaryLabel: { fontSize: 14, color: '#666' },
  summaryValue: { fontSize: 14, color: '#1A1A1A', fontWeight: '500' },
  totalRow: { borderTopWidth: 1, borderTopColor: '#ddd', paddingTop: 10, marginTop: 4 },
  totalLabel: { fontSize: 16, fontWeight: 'bold', color: '#1A1A1A' },
  totalValue: { fontSize: 18, fontWeight: 'bold', color: '#E85D04' },
  bottomBox: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 16, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#f0f0f0' },
  orderBtn: { backgroundColor: '#E85D04', padding: 16, borderRadius: 12, alignItems: 'center' },
  orderBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});