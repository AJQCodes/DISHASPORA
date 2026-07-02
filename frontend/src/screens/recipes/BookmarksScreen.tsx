import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';

const INITIAL_BOOKMARKS = [
  { id: '1', name: 'Jollof Rice', country: 'Ghana 🇬🇭', calories: 420, time: '45 min', emoji: '🍛' },
  { id: '2', name: 'Injera', country: 'Ethiopia 🇪🇹', calories: 270, time: '30 min', emoji: '🫓' },
  { id: '3', name: 'Tagine', country: 'Morocco 🇲🇦', calories: 510, time: '90 min', emoji: '🍲' },
];

export default function BookmarksScreen({ navigation }: any) {
  const [bookmarks, setBookmarks] = useState(INITIAL_BOOKMARKS);

  const removeBookmark = (id: string) => {
    setBookmarks(prev => prev.filter(b => b.id !== id));
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Saved Recipes</Text>
      </View>

      {bookmarks.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyEmoji}>🏷️</Text>
          <Text style={styles.emptyTitle}>No saved recipes yet</Text>
          <Text style={styles.emptySubtitle}>
            Tap the bookmark icon on any recipe to save it here.
          </Text>
          <TouchableOpacity
            style={styles.browseBtn}
            onPress={() => navigation.navigate('HomeFeed')}
          >
            <Text style={styles.browseBtnText}>Browse Recipes</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ paddingBottom: 60 }}>
          <Text style={styles.count}>{bookmarks.length} saved recipe{bookmarks.length !== 1 ? 's' : ''}</Text>
          {bookmarks.map(recipe => (
            <View key={recipe.id} style={styles.card}>
              <TouchableOpacity
                style={styles.cardContent}
                onPress={() => navigation.navigate('RecipeDetail', { recipe })}
              >
                <Text style={styles.cardEmoji}>{recipe.emoji}</Text>
                <View style={styles.cardInfo}>
                  <Text style={styles.cardName}>{recipe.name}</Text>
                  <Text style={styles.cardMeta}>{recipe.country}</Text>
                  <Text style={styles.cardMeta}>🔥 {recipe.calories} cal · ⏱ {recipe.time}</Text>
                </View>
                <Text style={styles.arrow}>›</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.removeBtn}
                onPress={() => removeBookmark(recipe.id)}
              >
                <Text style={styles.removeBtnText}>🗑 Remove</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 16 },
  header: { flexDirection: 'row', alignItems: 'center', paddingTop: 60, marginBottom: 24, gap: 16 },
  back: { color: '#E85D04', fontSize: 22 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#1A1A1A' },
  count: { fontSize: 13, color: '#888', marginBottom: 16 },
  card: { backgroundColor: '#FFF3EC', borderRadius: 12, marginBottom: 12, overflow: 'hidden' },
  cardContent: { flexDirection: 'row', alignItems: 'center', padding: 14 },
  cardEmoji: { fontSize: 36, marginRight: 14 },
  cardInfo: { flex: 1 },
  cardName: { fontSize: 16, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 4 },
  cardMeta: { fontSize: 12, color: '#666', marginBottom: 2 },
  arrow: { fontSize: 22, color: '#E85D04' },
  removeBtn: { backgroundColor: '#FFE5D9', padding: 10, alignItems: 'center' },
  removeBtnText: { color: '#E85D04', fontSize: 13, fontWeight: '600' },
  emptyBox: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: 60 },
  emptyEmoji: { fontSize: 64, marginBottom: 16 },
  emptyTitle: { fontSize: 20, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 8 },
  emptySubtitle: { fontSize: 14, color: '#888', textAlign: 'center', marginBottom: 24, lineHeight: 20 },
  browseBtn: { backgroundColor: '#E85D04', padding: 14, borderRadius: 10, alignItems: 'center', paddingHorizontal: 32 },
  browseBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
});