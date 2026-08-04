import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useMutation } from '@tanstack/react-query';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { api } from '@/api';
import ChoiceChip from '@/components/ChoiceChip';
import Input from '@/components/Input';
import PrimaryButton from '@/components/PrimaryButton';
import ScreenHeader from '@/components/ScreenHeader';
import { useAuth } from '@/context/AuthContext';
import { colors } from '@/theme';
import type { Vendor, VendorType } from '@/types';

const TYPES: { label: string; value: VendorType }[] = [
  { label: 'Cooked food', value: 'FOOD' },
  { label: 'Ingredients', value: 'INGREDIENT' },
  { label: 'Both', value: 'BOTH' },
];

export default function VendorApply() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { refreshUser } = useAuth();
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [type, setType] = useState<VendorType>('FOOD');
  const [specialty, setSpecialty] = useState('');
  const [location, setLocation] = useState('');
  const [phone, setPhone] = useState('');

  const apply = useMutation({
    mutationFn: () =>
      api.post<Vendor>('/vendors/apply', {
        name: name.trim(),
        bio: bio.trim(),
        type,
        specialty: specialty.trim(),
        location: location.trim(),
        phone: phone.trim(),
      }),
    onSuccess: async () => {
      await refreshUser();
      Alert.alert(
        'Application submitted',
        'Your vendor profile is pending review. We will notify you once it is approved.',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    },
    onError: (e: any) => Alert.alert('Could not apply', e?.message ?? 'Please try again.'),
  });

  const valid = name.trim() && bio.trim() && specialty.trim() && location.trim() && phone.trim();

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={{ flex: 1, paddingTop: insets.top + 6 }}>
        <ScreenHeader title="Become a vendor" />
        <ScrollView
          contentContainerStyle={{ padding: 20, paddingBottom: 60, gap: 14 }}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.intro}>
            Sell your cooking or ingredients on Dishaspora. Applications are reviewed by our
            team, usually within 48 hours.
          </Text>
          <Input icon="storefront-outline" placeholder="Business name" value={name} onChangeText={setName} />
          <Input
            icon="document-text-outline"
            placeholder="Tell buyers about your kitchen..."
            value={bio}
            onChangeText={setBio}
            multiline
          />
          <Text style={styles.label}>What will you sell?</Text>
          <View style={styles.chips}>
            {TYPES.map((t) => (
              <ChoiceChip
                key={t.value}
                label={t.label}
                selected={type === t.value}
                onPress={() => setType(t.value)}
              />
            ))}
          </View>
          <Input
            icon="ribbon-outline"
            placeholder="Specialty (e.g. Ghanaian classics)"
            value={specialty}
            onChangeText={setSpecialty}
          />
          <Input icon="location-outline" placeholder="Location" value={location} onChangeText={setLocation} />
          <Input
            icon="call-outline"
            placeholder="Phone number"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
          <PrimaryButton
            title="Submit application"
            disabled={!valid}
            loading={apply.isPending}
            onPress={() => apply.mutate()}
            style={{ marginTop: 8 }}
          />
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  intro: { fontSize: 13.5, color: colors.inkSoft, lineHeight: 20 },
  label: { fontSize: 14, fontWeight: '600', color: colors.ink, marginTop: 4 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
});
