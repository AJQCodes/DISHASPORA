import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';

export default function FoodListingDetailScreen({ navigation, route }: any) {
  const { item } = route.params || {};
  const [quantity, setQuantity] = useState(1);

  const totalPrice = (item?.price * quantity).toFixed(2);

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 60 }}>
      {/* Hero */}
      <View style={styles.heroBox}>
        <Text style={styles.heroEmoji}>{item?.emoji || '🍛'}</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {/* Title */}
        <Text style={styles.title}>{item?.name || 'Food Item'}</Text>
        <Text style={styles.vendor}>🏪 {item?.vendor || 'Vendor'}</Text>
        <View style={styles.ratingRow}>
          <Text style={styles.rating}>⭐ {item?.rating || 4.5}</Text>
          <Text style={styles.ratingCount}>(128 reviews)</Text>
          <View style={styles.foodBadge}>
            <Text style={styles.foodBadgeText}>Ready to Eat</Text>
          </View>
        </View>

        {/* Description */}
        <Text style={styles.sectionTitle}>About this dish</Text>
        <Text style={styles.description}>
          A freshly prepared authentic dish made with locally sourced ingredients.
          Prepared fresh daily by our certified kitchen. Comes with packaging that
          keeps it warm for up to 2 hours after delivery.
        </Text>

        {/* Details */}
        <View style={styles.detailsRow}>
          {[
            { label: 'Prep Time', value: '30 min' },
            { label: 'Calories', value: '420 kcal' },
            { label: 'Serves', value: '1 person' },
            { label: 'Delivery', value: '45 min' },
          ].map(d => (
            <View key={d.label} style={styles.detailCard}>
              <Text style={styles.detailValue}>{d.value}</Text>
              <Text style={styles.detailLabel}>{d.label}</Text>
            </View>
          ))}
        </View>

        {/* Vendor Info */}
        <Text style={styles.sectionTitle}>About the Vendor</Text>
        <TouchableOpacity
          style={styles.vendorCard}
          onPress={() => navigation.navigate('VendorProfile', { vendor: item?.vendor })}
        >
          <Text style={styles.vendorEmoji}>🏪</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.vendorName}>{item?.vendor || 'Vendor Name'}</Text>
            <Text style={styles.vendorMeta}>⭐ 4.8 · 200+ orders · Accra, Ghana</Text>
          </View>
          <Text style={styles.vendorArrow}>›</Text>
        </TouchableOpacity>

        {/* Quantity */}
        <Text style={styles.sectionTitle}>Quantity</Text>
        <View style={styles.quantityRow}>
          <TouchableOpacity
            style={styles.quantityBtn}
            onPress={() => setQuantity(prev => Math.max(1, prev - 1))}
          >
            <Text style={styles.quantityBtnText}>−</Text>
          </TouchableOpacity>
          <Text style={styles.quantityCount}>{quantity}</Text>
          <TouchableOpacity
            style={styles.quantityBtn}
            onPress={() => setQuantity(prev => prev + 1)}
          >
            <Text style={styles.quantityBtnText}>+</Text>
          </TouchableOpacity>
        </View>

        {/* Add to Cart */}
        <View style={styles.bottomRow}>
          <View>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalPrice}>{item?.currency || 'GHS'} {totalPrice}</Text>
          </View>
          <TouchableOpacity
            style={styles.addToCartBtn}
            onPress={() => {
              Alert.alert('Added!', `${item?.name} added to cart.`, [
                { text: 'View Cart', onPress: () => navigation.navigate('Cart') },
                { text: 'Continue Shopping', style: 'cancel' },
              ]);
            }}
          >
            <Text style={styles.addToCartText}>🛒 Add to Cart</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  heroBox: { backgroundColor: '#FFF3EC', height: 220, alignItems: 'center', justifyContent: 'center' },
  heroEmoji: { fontSize: 90 },
  backBtn: { position: 'absolute', top: 50, left: 16, backgroundColor: '#fff', padding: 8, borderRadius: 20 },
  backText: { fontSize: 18, color: '#E85D04' },
  content: { padding: 20 },
  title: { fontSize: 26, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 4 },
  vendor: { fontSize: 14, color: '#666', marginBottom: 8 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 20 },
  rating: { fontSize: 14, color: '#666' },
  ratingCount: { fontSize: 13, color: '#888' },
  foodBadge: { backgroundColor: '#E8F5E9', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  foodBadgeText: { fontSize: 11, color: '#4CAF50', fontWeight: '600' },
  sectionTitle: { fontSize: 17, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 10, marginTop: 8 },
  description: { fontSize: 14, color: '#555', lineHeight: 22, marginBottom: 20 },
  detailsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
  detailCard: { flex: 1, backgroundColor: '#F5F5F5', borderRadius: 10, padding: 12, alignItems: 'center', marginHorizontal: 3 },
  detailValue: { fontSize: 13, fontWeight: 'bold', color: '#1A1A1A', textAlign: 'center' },
  detailLabel: { fontSize: 10, color: '#888', marginTop: 2 },
  vendorCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F5F5F5', borderRadius: 12, padding: 14, marginBottom: 20, gap: 12 },
  vendorEmoji: { fontSize: 32 },
  vendorName: { fontSize: 15, fontWeight: '600', color: '#1A1A1A' },
  vendorMeta: { fontSize: 12, color: '#888', marginTop: 2 },
  vendorArrow: { fontSize: 22, color: '#E85D04' },
  quantityRow: { flexDirection: 'row', alignItems: 'center', gap: 20, marginBottom: 24 },
  quantityBtn: { backgroundColor: '#FFF3EC', width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  quantityBtnText: { fontSize: 24, color: '#E85D04', fontWeight: 'bold' },
  quantityCount: { fontSize: 28, fontWeight: 'bold', color: '#1A1A1A', minWidth: 40, textAlign: 'center' },
  bottomRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFF3EC', borderRadius: 16, padding: 16 },
  totalLabel: { fontSize: 12, color: '#888' },
  totalPrice: { fontSize: 22, fontWeight: 'bold', color: '#E85D04' },
  addToCartBtn: { backgroundColor: '#E85D04', paddingHorizontal: 24, paddingVertical: 14, borderRadius: 12 },
  addToCartText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
});