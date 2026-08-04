import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { api } from '@/api';
import ChoiceChip from '@/components/ChoiceChip';
import Input from '@/components/Input';
import PrimaryButton from '@/components/PrimaryButton';
import ScreenHeader from '@/components/ScreenHeader';
import { IMG } from '@/config';
import { useAuth } from '@/context/AuthContext';
import { colors, shadow } from '@/theme';
import type { Listing, ListingType } from '@/types';

export default function ListingForm() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const [type, setType] = useState<ListingType>('FOOD');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [compareAt, setCompareAt] = useState('');
  const [stockQty, setStockQty] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [unit, setUnit] = useState('pack');
  const [prepMinutes, setPrepMinutes] = useState('');
  const [linkedRecipeId, setLinkedRecipeId] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const currencyLabel = user?.country === 'NG' ? 'NGN (naira)' : 'GHS (cedis)';

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
    });
    if (result.canceled || !result.assets[0]) return;
    const asset = result.assets[0];
    setUploading(true);
    try {
      const { url } = await api.upload({
        uri: asset.uri,
        name: asset.fileName ?? 'listing.jpg',
        mimeType: asset.mimeType ?? 'image/jpeg',
      });
      setImageUrl(url);
    } catch {
      Alert.alert('Upload failed', 'Could not upload the image.');
    } finally {
      setUploading(false);
    }
  };

  const submit = useMutation({
    mutationFn: () =>
      api.post<Listing>('/listings', {
        type,
        title: title.trim(),
        description: description.trim(),
        imageUrl,
        // price entered in major units; contract wants minor units
        amountMinor: Math.round(parseFloat(price || '0') * 100),
        compareAtMinor: compareAt ? Math.round(parseFloat(compareAt) * 100) : null,
        available: true,
        stockQty: Number(stockQty) || 0,
        quantity: quantity.trim() || '1',
        unit: unit.trim() || 'pack',
        prepMinutes: type === 'FOOD' && prepMinutes ? Number(prepMinutes) : null,
        linkedRecipeId: linkedRecipeId ? Number(linkedRecipeId) : null,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendor-listings'] });
      Alert.alert('Listing submitted', 'Your listing is pending review.', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    },
    onError: (e: any) => Alert.alert('Submission failed', e?.message ?? 'Please try again.'),
  });

  const valid = title.trim() && parseFloat(price || '0') > 0;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={{ flex: 1, paddingTop: insets.top + 6 }}>
        <ScreenHeader title="Add listing" />
        <ScrollView
          contentContainerStyle={{ padding: 20, paddingBottom: 80, gap: 14 }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.chips}>
            <ChoiceChip label="Cooked meal" selected={type === 'FOOD'} onPress={() => setType('FOOD')} />
            <ChoiceChip label="Ingredient" selected={type === 'INGREDIENT'} onPress={() => setType('INGREDIENT')} />
          </View>

          <TouchableOpacity style={styles.imagePick} onPress={pickImage}>
            {imageUrl ? (
              <Image source={{ uri: IMG(imageUrl) }} style={styles.imagePreview} contentFit="cover" />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Ionicons name="image-outline" size={28} color={colors.inkFaint} />
                <Text style={styles.imageHint}>{uploading ? 'Uploading...' : 'Add a photo'}</Text>
              </View>
            )}
          </TouchableOpacity>

          <Input placeholder="Title" value={title} onChangeText={setTitle} />
          <Input placeholder="Description" value={description} onChangeText={setDescription} multiline />

          <Text style={styles.label}>Price in {currencyLabel}</Text>
          <View style={styles.row2}>
            <Input placeholder="Price (e.g. 45.00)" value={price} onChangeText={setPrice} keyboardType="decimal-pad" style={{ flex: 1 }} />
            <Input placeholder="Was-price (optional)" value={compareAt} onChangeText={setCompareAt} keyboardType="decimal-pad" style={{ flex: 1 }} />
          </View>
          <View style={styles.row2}>
            <Input placeholder="Stock qty" value={stockQty} onChangeText={setStockQty} keyboardType="number-pad" style={{ flex: 1 }} />
            <Input placeholder="Qty per unit" value={quantity} onChangeText={setQuantity} style={{ flex: 1 }} />
            <Input placeholder="Unit" value={unit} onChangeText={setUnit} style={{ flex: 1 }} />
          </View>
          {type === 'FOOD' ? (
            <View style={styles.row2}>
              <Input
                placeholder="Prep minutes"
                value={prepMinutes}
                onChangeText={setPrepMinutes}
                keyboardType="number-pad"
                style={{ flex: 1 }}
              />
              <Input
                placeholder="Linked recipe ID (optional)"
                value={linkedRecipeId}
                onChangeText={setLinkedRecipeId}
                keyboardType="number-pad"
                style={{ flex: 1 }}
              />
            </View>
          ) : null}

          <PrimaryButton
            title="Submit for review"
            disabled={!valid || uploading}
            loading={submit.isPending}
            onPress={() => submit.mutate()}
            style={{ marginTop: 8 }}
          />
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  chips: { flexDirection: 'row', gap: 8 },
  imagePick: { borderRadius: 20, overflow: 'hidden', ...shadow },
  imagePreview: { width: '100%', height: 170 },
  imagePlaceholder: {
    height: 150,
    borderRadius: 20,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: colors.inkFaint,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  imageHint: { fontSize: 13, color: colors.inkFaint },
  label: { fontSize: 14, fontWeight: '600', color: colors.ink },
  row2: { flexDirection: 'row', gap: 10 },
});
