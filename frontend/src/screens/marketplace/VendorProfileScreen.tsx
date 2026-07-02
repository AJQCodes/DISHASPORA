import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';

const MENU_ITEMS = [
  { id: '1', name: 'Jollof Rice (Party Size)', price: 85, emoji: '🍛', rating: 4.8, category: 'Rice Dishes' },
  { id: '2', name: 'Grilled Tilapia', price: 60, emoji: '🐟', rating: 4.6, category: 'Grills' },
  { id: '3', name: 'Kelewele Pack', price: 25, emoji: '🍌', rating: 4.9, category: 'Snacks' },
  { id: '4', name: 'Fufu & Light Soup', price: 45, emoji: '🍲', rating: 4.7, category: 'Soups' },
  { id: '5', name: 'Waakye Special', price: 35, emoji: '🍚', rating: 4.5, category: 'Rice Dishes' },
];

const REVIEWS = [
  { id: '1', name: 'Abena K.', rating: 5, comment: 'Best Jollof in Accra! Always fresh and on time.', date: 'June 10, 2026' },
  { id: '2', name: 'Kofi A.', rating: 4, comment: 'Great food, packaging could be better.', date: 'June 5, 2026' },
  { id: '3', name: 'Fatima M.', rating: 5, comment: 'Authentic taste, reminds me of home cooking!', date: 'May 28, 2026' },
];

const SPECIALTIES = ['Ghanaian Cuisine', 'West African', 'Halal', 'Party Catering', 'Home Delivery'];
const TABS = ['Menu', 'Reviews', 'Info'];

export default function VendorProfileScreen({ navigation, route }: any) {
  const { vendor } = route.params || {};
  const [activeTab, setActiveTab] = useState('Menu');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', ...new Set(MENU_ITEMS.map(i => i.category))];
  const filteredMenu = activeCategory === 'All'
    ? MENU_ITEMS
    : MENU_ITEMS.filter(i => i.category === activeCategory);

  return (
    <View style={styles.container}>
      {/* Hero */}
      <View style={styles.heroBox}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.heroEmoji}>🏪</Text>
        <Text style={styles.heroName}>{vendor || 'Mama Akua Kitchen'}</Text>
        <Text style={styles.heroLocation}>📍 Accra, Ghana</Text>
        <View style={styles.heroStats}>
          <View style={styles.heroStat}>
            <Text style={styles.heroStatValue}>⭐ 4.8</Text>
            <Text style={styles.heroStatLabel}>Rating</Text>
          </View>
          <View style={styles.heroStat}>
            <Text style={styles.heroStatValue}>200+</Text>
            <Text style={styles.heroStatLabel}>Orders</Text>
          </View>
          <View style={styles.heroStat}>
            <Text style={styles.heroStatValue}>45 min</Text>
            <Text style={styles.heroStatLabel}>Delivery</Text>
          </View>
          <View style={styles.heroStat}>
            <Text style={styles.heroStatValue}>✅ Open</Text>
            <Text style={styles.heroStatLabel}>Status</Text>
          </View>
        </View>
      </View>

      {/* Specialties */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.specialtiesRow}>
        {SPECIALTIES.map(s => (
          <View key={s} style={styles.specialtyChip}>
            <Text style={styles.specialtyText}>{s}</Text>
          </View>
        ))}
      </ScrollView>

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

      <ScrollView contentContainerStyle={{ paddingBottom: 60, paddingHorizontal: 16 }}>
        {/* Menu Tab */}
        {activeTab === 'Menu' && (
          <>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryRow}>
              {categories.map(cat => (
                <TouchableOpacity
                  key={cat}
                  style={[styles.categoryChip, activeCategory === cat && styles.categoryChipActive]}
                  onPress={() => setActiveCategory(cat)}
                >
                  <Text style={[styles.categoryText, activeCategory === cat && styles.categoryTextActive]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            {filteredMenu.map(item => (
              <View key={item.id} style={styles.menuCard}>
                <Text style={styles.menuEmoji}>{item.emoji}</Text>
                <View style={styles.menuInfo}>
                  <Text style={styles.menuName}>{item.name}</Text>
                  <Text style={styles.menuCategory}>{item.category}</Text>
                  <Text style={styles.menuRating}>⭐ {item.rating}</Text>
                </View>
                <View style={styles.menuRight}>
                  <Text style={styles.menuPrice}>GHS {item.price}</Text>
                  <TouchableOpacity
                    style={styles.addBtn}
                    onPress={() => navigation.navigate('Cart')}
                  >
                    <Text style={styles.addBtnText}>+ Add</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </>
        )}

        {/* Reviews Tab */}
        {activeTab === 'Reviews' && (
          <>
            <View style={styles.avgBox}>
              <Text style={styles.avgNumber}>4.8</Text>
              <Text style={styles.avgStars}>★★★★★</Text>
              <Text style={styles.avgCount}>{REVIEWS.length} reviews</Text>
            </View>
            {REVIEWS.map(review => (
              <View key={review.id} style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{review.name[0]}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.reviewName}>{review.name}</Text>
                    <Text style={styles.reviewDate}>{review.date}</Text>
                  </View>
                  <Text style={styles.reviewRating}>{'★'.repeat(review.rating)}</Text>
                </View>
                <Text style={styles.reviewComment}>{review.comment}</Text>
              </View>
            ))}
          </>
        )}

        {/* Info Tab */}
        {activeTab === 'Info' && (
          <View style={styles.infoBox}>
            {[
              { label: 'Business Name', value: vendor || 'Mama Akua Kitchen' },
              { label: 'Category', value: 'Home Kitchen' },
              { label: 'Location', value: 'Accra, Ghana' },
              { label: 'Phone', value: '024XXXXXXX' },
              { label: 'Email', value: 'mamakua@email.com' },
              { label: 'Hours', value: 'Mon–Sat, 8am–8pm' },
              { label: 'Delivery Fee', value: 'GHS 15.00' },
              { label: 'Min Order', value: 'GHS 30.00' },
            ].map(info => (
              <View key={info.label} style={styles.infoRow}>
                <Text style={styles.infoLabel}>{info.label}</Text>
                <Text style={styles.infoValue}>{info.value}</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  heroBox: { backgroundColor: '#FFF3EC', paddingTop: 60, paddingBottom: 20, alignItems: 'center', paddingHorizontal: 16 },
  backBtn: { position: 'absolute', top: 50, left: 16, backgroundColor: '#fff', padding: 8, borderRadius: 20 },
  backText: { fontSize: 18, color: '#E85D04' },
  heroEmoji: { fontSize: 56, marginBottom: 8 },
  heroName: { fontSize: 22, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 4 },
  heroLocation: { fontSize: 13, color: '#666', marginBottom: 16 },
  heroStats: { flexDirection: 'row', justifyContent: 'space-around', width: '100%' },
  heroStat: { alignItems: 'center' },
  heroStatValue: { fontSize: 14, fontWeight: 'bold', color: '#1A1A1A' },
  heroStatLabel: { fontSize: 11, color: '#888', marginTop: 2 },
  specialtiesRow: { paddingHorizontal: 16, paddingVertical: 12 },
  specialtyChip: { backgroundColor: '#FFF3EC', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6, marginRight: 8 },
  specialtyText: { fontSize: 12, color: '#E85D04', fontWeight: '600' },
  tabRow: { flexDirection: 'row', backgroundColor: '#F5F5F5', marginHorizontal: 16, borderRadius: 10, padding: 4, marginBottom: 16 },
  tab: { flex: 1, padding: 10, borderRadius: 8, alignItems: 'center' },
  tabActive: { backgroundColor: '#fff', elevation: 2 },
  tabText: { fontSize: 14, color: '#888', fontWeight: '600' },
  tabTextActive: { color: '#E85D04' },
  categoryRow: { marginBottom: 12 },
  categoryChip: { borderWidth: 1.5, borderColor: '#ddd', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6, marginRight: 8 },
  categoryChipActive: { backgroundColor: '#E85D04', borderColor: '#E85D04' },
  categoryText: { fontSize: 12, color: '#444' },
  categoryTextActive: { color: '#fff', fontWeight: '600' },
  menuCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F5F5F5', borderRadius: 12, padding: 12, marginBottom: 10 },
  menuEmoji: { fontSize: 32, marginRight: 12 },
  menuInfo: { flex: 1 },
  menuName: { fontSize: 14, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 2 },
  menuCategory: { fontSize: 11, color: '#888', marginBottom: 2 },
  menuRating: { fontSize: 12, color: '#666' },
  menuRight: { alignItems: 'flex-end', gap: 8 },
  menuPrice: { fontSize: 15, fontWeight: 'bold', color: '#E85D04' },
  addBtn: { backgroundColor: '#E85D04', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  addBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
  avgBox: { alignItems: 'center', backgroundColor: '#FFF3EC', borderRadius: 16, padding: 20, marginBottom: 16 },
  avgNumber: { fontSize: 48, fontWeight: 'bold', color: '#E85D04' },
  avgStars: { fontSize: 24, color: '#E85D04' },
  avgCount: { fontSize: 13, color: '#888', marginTop: 4 },
  reviewCard: { backgroundColor: '#F5F5F5', borderRadius: 12, padding: 14, marginBottom: 10 },
  reviewHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: 10 },
  avatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#E85D04', alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  reviewName: { fontSize: 14, fontWeight: '600', color: '#1A1A1A' },
  reviewDate: { fontSize: 11, color: '#888' },
  reviewRating: { color: '#E85D04', fontSize: 14 },
  reviewComment: { fontSize: 13, color: '#555', lineHeight: 20 },
  infoBox: { backgroundColor: '#F5F5F5', borderRadius: 16, padding: 16 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#eee' },
  infoLabel: { fontSize: 14, color: '#666' },
  infoValue: { fontSize: 14, fontWeight: '600', color: '#1A1A1A' },
});