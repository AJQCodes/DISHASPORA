import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Share,
} from 'react-native';

type ShoppingItem = {
  id: string;
  name: string;
  quantity: string;
  category: 'Produce' | 'Protein' | 'Grains' | 'Dairy' | 'Pantry' | 'Other';
  checked: boolean;
};

// Mock data derived from weekly plan — replace with real plan aggregation
const WEEKLY_SHOPPING_LIST: Omit<ShoppingItem, 'checked'>[] = [
  { id: '1', name: 'Bananas', quantity: '6 pcs', category: 'Produce' },
  { id: '2', name: 'Tomatoes', quantity: '500g', category: 'Produce' },
  { id: '3', name: 'Onions', quantity: '3 pcs', category: 'Produce' },
  { id: '4', name: 'Chicken breast', quantity: '800g', category: 'Protein' },
  { id: '5', name: 'Tilapia fillets', quantity: '600g', category: 'Protein' },
  { id: '6', name: 'Black-eyed peas', quantity: '400g', category: 'Protein' },
  { id: '7', name: 'Rice', quantity: '2kg', category: 'Grains' },
  { id: '8', name: 'Oats', quantity: '500g', category: 'Grains' },
  { id: '9', name: 'Yoghurt', quantity: '4 cups', category: 'Dairy' },
  { id: '10', name: 'Vegetable oil', quantity: '1L', category: 'Pantry' },
  { id: '11', name: 'Pepper & spices', quantity: '1 pack', category: 'Pantry' },
  { id: '12', name: 'Mixed nuts', quantity: '300g', category: 'Other' },
];

const CATEGORY_ORDER = ['Produce', 'Protein', 'Grains', 'Dairy', 'Pantry', 'Other'] as const;

export default function ShoppingListScreen({ navigation }: any) {
  const [items, setItems] = useState<ShoppingItem[]>(
    WEEKLY_SHOPPING_LIST.map(item => ({ ...item, checked: false }))
  );

  const groupedItems = useMemo(() => {
    return CATEGORY_ORDER.map(category => ({
      category,
      items: items.filter(item => item.category === category),
    })).filter(group => group.items.length > 0);
  }, [items]);

  const checkedCount = items.filter(i => i.checked).length;
  const totalCount = items.length;
  const progress = totalCount === 0 ? 0 : Math.round((checkedCount / totalCount) * 100);

  const toggleItem = (id: string) => {
    setItems(prev =>
      prev.map(item => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  const clearChecked = () => {
    setItems(prev => prev.filter(item => !item.checked));
  };

  const resetList = () => {
    Alert.alert('Reset List', 'Uncheck all items and restore the full weekly list?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Reset',
        onPress: () =>
          setItems(WEEKLY_SHOPPING_LIST.map(item => ({ ...item, checked: false }))),
      },
    ]);
  };

  const buildListText = () => {
    const lines = ['🛒 Weekly Shopping List', ''];

    groupedItems.forEach(group => {
      lines.push(`${group.category.toUpperCase()}`);
      group.items.forEach(item => {
        const mark = item.checked ? '✓' : '•';
        lines.push(`${mark} ${item.name} — ${item.quantity}`);
      });
      lines.push('');
    });

    lines.push(`${checkedCount}/${totalCount} items checked`);
    return lines.join('\n');
  };

  const handleDownload = async () => {
    try {
      await Share.share({
        message: buildListText(),
        title: 'Weekly Shopping List',
      });
    } catch {
      Alert.alert('Download failed', 'Could not export the shopping list.');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 60 }}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerTextWrap}>
          <Text style={styles.title}>Shopping List</Text>
          <Text style={styles.subtitle}>From your weekly meal plan</Text>
        </View>
      </View>

      {/* Progress */}
      <View style={styles.progressCard}>
        <View style={styles.progressTop}>
          <Text style={styles.progressLabel}>Shopping progress</Text>
          <Text style={styles.progressValue}>{checkedCount}/{totalCount}</Text>
        </View>
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.progressHint}>{progress}% complete</Text>
      </View>

      {/* Actions */}
      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.actionBtn} onPress={handleDownload}>
          <Text style={styles.actionBtnText}>⬇ Download / Share</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtnSecondary} onPress={clearChecked}>
          <Text style={styles.actionBtnSecondaryText}>Clear checked</Text>
        </TouchableOpacity>
      </View>

      {/* Grouped items */}
      {groupedItems.map(group => (
        <View key={group.category} style={styles.section}>
          <Text style={styles.sectionTitle}>{group.category}</Text>

          {group.items.map(item => (
            <TouchableOpacity
              key={item.id}
              style={[styles.itemCard, item.checked && styles.itemCardChecked]}
              onPress={() => toggleItem(item.id)}
              activeOpacity={0.8}
            >
              <View style={[styles.checkbox, item.checked && styles.checkboxChecked]}>
                {item.checked ? <Text style={styles.checkmark}>✓</Text> : null}
              </View>

              <View style={styles.itemInfo}>
                <Text style={[styles.itemName, item.checked && styles.itemNameChecked]}>
                  {item.name}
                </Text>
                <Text style={styles.itemQty}>{item.quantity}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      ))}

      {/* Footer actions */}
      <TouchableOpacity style={styles.resetBtn} onPress={resetList}>
        <Text style={styles.resetBtnText}>↺ Reset weekly list</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 16 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    marginBottom: 20,
    gap: 16,
  },
  back: { color: '#E85D04', fontSize: 22 },
  headerTextWrap: { flex: 1 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#1A1A1A' },
  subtitle: { fontSize: 13, color: '#888', marginTop: 2 },

  progressCard: {
    backgroundColor: '#FFF3EC',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  progressTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  progressLabel: { fontSize: 14, fontWeight: '600', color: '#1A1A1A' },
  progressValue: { fontSize: 14, fontWeight: 'bold', color: '#E85D04' },
  progressBarBg: {
    height: 8,
    backgroundColor: '#FFE5D9',
    borderRadius: 999,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#E85D04',
    borderRadius: 999,
  },
  progressHint: { fontSize: 12, color: '#888', marginTop: 8 },

  actionRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  actionBtn: {
    flex: 1.2,
    backgroundColor: '#E85D04',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  actionBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  actionBtnSecondary: {
    flex: 1,
    backgroundColor: '#FFF3EC',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  actionBtnSecondaryText: { color: '#E85D04', fontWeight: '600', fontSize: 14 },

  section: { marginBottom: 18 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 10,
  },

  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
  },
  itemCardChecked: { backgroundColor: '#FAFAFA', opacity: 0.85 },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#E85D04',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  checkboxChecked: { backgroundColor: '#E85D04' },
  checkmark: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 15, fontWeight: '600', color: '#1A1A1A' },
  itemNameChecked: { textDecorationLine: 'line-through', color: '#999' },
  itemQty: { fontSize: 12, color: '#666', marginTop: 2 },

  resetBtn: {
    backgroundColor: '#FFE5D9',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
  },
  resetBtnText: { color: '#E85D04', fontWeight: '600', fontSize: 15 },
});