import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput } from 'react-native';

const FOOD_LISTINGS = [
  { id: '1', name: 'Jollof Rice (Party Size)', vendor: 'Mama Akua Kitchen', price: 85, currency: 'GHS', emoji: '🍛', rating: 4.8, category: 'Food' },
  { id: '2', name: 'Grilled Tilapia', vendor: 'Accra Fish House', price: 60, currency: 'GHS', emoji: '🐟', rating: 4.6, category: 'Food' },
  { id: '3', name: 'Kelewele Pack', vendor: 'Street Bites GH', price: 25, currency: 'GHS', emoji: '🍌', rating: 4.9, category: 'Food' },
  { id: '4', name: 'Fufu & Light Soup', vendor: 'Nana\'s Kitchen', price: 45, currency: 'GHS', emoji: '🍲', rating: 4.7, category: 'Food' },
];

const INGREDIENT_LISTINGS = [
  { id: '5', name: 'Fresh Tomatoes (1kg)', vendor: 'Kumasi Market', price: 12, currency: 'GHS', emoji: '🍅', rating: 4.5, category: 'Ingredient' },
  { id: '6', name: 'Palm Oil (1 litre)', vendor: 'Nature\'s Best GH', price: 28, currency: 'GHS', emoji: '🫙', rating: 4.3, category: 'Ingredient' },
  { id: '7', name: 'Dried Egusi (500g)', vendor: 'Spice World', price: 35, currency: 'GHS', emoji: '🌰', rating: 4.6, category: 'Ingredient' },
  { id: '8', name: 'Suya Spice Mix', vendor: 'Spice World', price: 18, currency: 'GHS', emoji: '🌶️', rating: 4.8, category: 'Ingredient' },
];

const TABS = ['All', 'Food', 'Ingredients'];

export default function MarketplaceHomeScreen({ navigation }: any) {
  const [activeTab, setActiveTab] = useState('All');
  const [search, setSearch] = useState('');

  const allListings = [...FOOD_LISTINGS, ...INGREDIENT_LISTINGS];
  const listings = allListings.filter(l => {
    const tabMatch = activeTab === 'All' || l.category === activeTab.slice(0, -1) || l.category === activeTab;
    const searchMatch = l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.vendor.toLowerCase().includes(search.toLowerCase());
    return tabMatch && searchMatch;
  });

  return (
    <View style={styles.container}>
     {/* Header */}
<View style={styles.header}>
  <TouchableOpacity onPress={() => navigation.goBack()}>
    <Text style={styles.back}>←</Text>
  </TouchableOpacity>
  <View style={{ flex: 1, marginLeft: 12 }}>
    <Text style={styles.title}>Marketplace 🛍️</Text>
    <Text style={styles.subtitle}>Order food & ingredients near you</Text>
  </View>
  <TouchableOpacity
    style={styles.cartBtn}
    onPress={() => navigation.navigate('Cart')}
  >
    <Text style={styles.cartEmoji}>🛒</Text>
  </TouchableOpacity>
</View>

      {/* Search */}
      <View style={styles.searchBox}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search food, ingredients, vendors..."
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Tabs */}
      <View style={styles.tabRow}>
        {TABS.map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Listings */}
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>

        {/* Vendor CTA */}
        <TouchableOpacity
          style={styles.vendorCTA}
          onPress={() => navigation.navigate('VendorRegistration')}
        >
          <Text style={styles.vendorCTAEmoji}>🏪</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.vendorCTATitle}>Become a Vendor</Text>
            <Text style={styles.vendorCTASubtitle}>Sell your food or ingredients on Dishaspora</Text>
          </View>
          <Text style={styles.vendorCTAArrow}>›</Text>
        </TouchableOpacity>

        {/* Results */}
        <Text style={styles.resultsLabel}>{listings.length} listings found</Text>
        {listings.map(item => (
          <TouchableOpacity
            key={item.id}
            style={styles.card}
            onPress={() => navigation.navigate(
              item.category === 'Food' ? 'FoodListingDetail' : 'IngredientListingDetail',
              { item }
            )}
          >
            <Text style={styles.cardEmoji}>{item.emoji}</Text>
            <View style={styles.cardInfo}>
              <Text style={styles.cardName}>{item.name}</Text>
              <Text style={styles.cardVendor}>🏪 {item.vendor}</Text>
              <View style={styles.cardMeta}>
                <Text style={styles.cardRating}>⭐ {item.rating}</Text>
                <Text style={[styles.cardCategory,
                  item.category === 'Food' ? styles.foodBadge : styles.ingredientBadge
                ]}>
                  {item.category}
                </Text>
              </View>
            </View>
            <View style={styles.priceBox}>
              <Text style={styles.priceText}>{item.currency} {item.price}</Text>
              <TouchableOpacity style={styles.addBtn}
                onPress={() => navigation.navigate('Cart')}
              >
                <Text style={styles.addBtnText}>+ Add</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 60, marginBottom: 16 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#1A1A1A' },
  subtitle: { fontSize: 13, color: '#666', marginTop: 2 },
  cartBtn: { backgroundColor: '#FFF3EC', padding: 12, borderRadius: 50 },
  cartEmoji: { fontSize: 22 },
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F5F5F5', borderRadius: 12, paddingHorizontal: 14, marginBottom: 16 },
  searchIcon: { fontSize: 16, marginRight: 8 },
  searchInput: { flex: 1, paddingVertical: 12, fontSize: 15 },
  tabRow: { flexDirection: 'row', backgroundColor: '#F5F5F5', borderRadius: 10, padding: 4, marginBottom: 16 },
  tab: { flex: 1, padding: 10, borderRadius: 8, alignItems: 'center' },
  tabActive: { backgroundColor: '#fff', elevation: 2 },
  tabText: { fontSize: 14, color: '#888', fontWeight: '600' },
  tabTextActive: { color: '#E85D04' },
  vendorCTA: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1A1A1A', borderRadius: 12, padding: 16, marginBottom: 16, gap: 12 },
  vendorCTAEmoji: { fontSize: 28 },
  vendorCTATitle: { fontSize: 15, fontWeight: 'bold', color: '#fff' },
  vendorCTASubtitle: { fontSize: 12, color: '#aaa', marginTop: 2 },
  vendorCTAArrow: { fontSize: 22, color: '#E85D04' },
  resultsLabel: { fontSize: 13, color: '#888', marginBottom: 12 },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F5F5F5', borderRadius: 12, padding: 14, marginBottom: 12 },
  cardEmoji: { fontSize: 36, marginRight: 12 },
  cardInfo: { flex: 1 },
  cardName: { fontSize: 15, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 2 },
  cardVendor: { fontSize: 12, color: '#666', marginBottom: 4 },
  cardMeta: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  cardRating: { fontSize: 12, color: '#666' },
  cardCategory: { fontSize: 10, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10, fontWeight: '600' },
  foodBadge: { backgroundColor: '#FFF3EC', color: '#E85D04' },
  ingredientBadge: { backgroundColor: '#E8F5E9', color: '#4CAF50' },
  priceBox: { alignItems: 'flex-end', gap: 8 },
  priceText: { fontSize: 15, fontWeight: 'bold', color: '#1A1A1A' },
  addBtn: { backgroundColor: '#E85D04', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  addBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
  back: { color: '#E85D04', fontSize: 22 },
});