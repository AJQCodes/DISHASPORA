import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';

const INITIAL_CART = [
  { id: '1', name: 'Jollof Rice (Party Size)', vendor: 'Mama Akua Kitchen', price: 85, currency: 'GHS', emoji: '🍛', quantity: 1 },
  { id: '2', name: 'Fresh Tomatoes (1kg)', vendor: 'Kumasi Market', price: 12, currency: 'GHS', emoji: '🍅', quantity: 2 },
  { id: '3', name: 'Palm Oil (1 litre)', vendor: 'Nature\'s Best GH', price: 28, currency: 'GHS', emoji: '🫙', quantity: 1 },
];

export default function CartScreen({ navigation }: any) {
  const [cart, setCart] = useState(INITIAL_CART);

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev
      .map(item => item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item)
      .filter(item => item.quantity > 0)
    );
  };

  const removeItem = (id: string) => {
    Alert.alert('Remove Item', 'Remove this item from your cart?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => setCart(prev => prev.filter(i => i.id !== id)) },
    ]);
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const delivery = 15;
  const total = subtotal + delivery;

  if (cart.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.emptyBack}>
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>
        <Text style={styles.emptyEmoji}>🛒</Text>
        <Text style={styles.emptyTitle}>Your cart is empty</Text>
        <Text style={styles.emptySubtitle}>Add items from the marketplace to get started.</Text>
        <TouchableOpacity
          style={styles.browseBtn}
          onPress={() => navigation.navigate('Marketplace')}
        >
          <Text style={styles.browseBtnText}>Browse Marketplace</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>My Cart</Text>
        <Text style={styles.itemCount}>{cart.length} items</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 160 }}>
        {/* Cart Items */}
        {cart.map(item => (
          <View key={item.id} style={styles.card}>
            <Text style={styles.cardEmoji}>{item.emoji}</Text>
            <View style={styles.cardInfo}>
              <Text style={styles.cardName}>{item.name}</Text>
              <Text style={styles.cardVendor}>{item.vendor}</Text>
              <Text style={styles.cardPrice}>{item.currency} {item.price}</Text>
            </View>
            <View style={styles.cardActions}>
              <TouchableOpacity onPress={() => removeItem(item.id)}>
                <Text style={styles.removeBtn}>🗑</Text>
              </TouchableOpacity>
              <View style={styles.quantityRow}>
                <TouchableOpacity
                  style={styles.quantityBtn}
                  onPress={() => updateQuantity(item.id, -1)}
                >
                  <Text style={styles.quantityBtnText}>−</Text>
                </TouchableOpacity>
                <Text style={styles.quantityCount}>{item.quantity}</Text>
                <TouchableOpacity
                  style={styles.quantityBtn}
                  onPress={() => updateQuantity(item.id, 1)}
                >
                  <Text style={styles.quantityBtnText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}

        {/* Order Summary */}
        <View style={styles.summaryBox}>
          <Text style={styles.summaryTitle}>Order Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>GHS {subtotal.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Delivery Fee</Text>
            <Text style={styles.summaryValue}>GHS {delivery.toFixed(2)}</Text>
          </View>
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>GHS {total.toFixed(2)}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Checkout Button */}
      <View style={styles.checkoutBox}>
        <TouchableOpacity
          style={styles.checkoutBtn}
          onPress={() => navigation.navigate('Checkout', { cart, total })}
        >
          <Text style={styles.checkoutBtnText}>Proceed to Checkout · GHS {total.toFixed(2)}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 16 },
  header: { flexDirection: 'row', alignItems: 'center', paddingTop: 60, marginBottom: 20, gap: 16 },
  back: { color: '#E85D04', fontSize: 22 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#1A1A1A', flex: 1 },
  itemCount: { fontSize: 13, color: '#888' },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F5F5F5', borderRadius: 12, padding: 14, marginBottom: 12 },
  cardEmoji: { fontSize: 36, marginRight: 12 },
  cardInfo: { flex: 1 },
  cardName: { fontSize: 14, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 2 },
  cardVendor: { fontSize: 12, color: '#888', marginBottom: 4 },
  cardPrice: { fontSize: 15, fontWeight: 'bold', color: '#E85D04' },
  cardActions: { alignItems: 'flex-end', gap: 8 },
  removeBtn: { fontSize: 18 },
  quantityRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  quantityBtn: { backgroundColor: '#FFF3EC', width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  quantityBtnText: { fontSize: 18, color: '#E85D04', fontWeight: 'bold' },
  quantityCount: { fontSize: 16, fontWeight: 'bold', color: '#1A1A1A', minWidth: 24, textAlign: 'center' },
  summaryBox: { backgroundColor: '#FFF3EC', borderRadius: 16, padding: 16, marginTop: 8 },
  summaryTitle: { fontSize: 16, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 12 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  summaryLabel: { fontSize: 14, color: '#666' },
  summaryValue: { fontSize: 14, color: '#1A1A1A', fontWeight: '500' },
  totalRow: { borderTopWidth: 1, borderTopColor: '#ddd', paddingTop: 10, marginTop: 4 },
  totalLabel: { fontSize: 16, fontWeight: 'bold', color: '#1A1A1A' },
  totalValue: { fontSize: 18, fontWeight: 'bold', color: '#E85D04' },
  checkoutBox: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 16, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#f0f0f0' },
  checkoutBtn: { backgroundColor: '#E85D04', padding: 16, borderRadius: 12, alignItems: 'center' },
  checkoutBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, backgroundColor: '#fff' },
  emptyBack: { position: 'absolute', top: 60, left: 16 },
  emptyEmoji: { fontSize: 64, marginBottom: 16 },
  emptyTitle: { fontSize: 22, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 8 },
  emptySubtitle: { fontSize: 14, color: '#888', textAlign: 'center', marginBottom: 24 },
  browseBtn: { backgroundColor: '#E85D04', padding: 16, borderRadius: 10, alignItems: 'center', paddingHorizontal: 32 },
  browseBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
});