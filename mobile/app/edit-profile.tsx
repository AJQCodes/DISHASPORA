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
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useMutation } from '@tanstack/react-query';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { api } from '@/api';
import Avatar from '@/components/Avatar';
import ChoiceChip from '@/components/ChoiceChip';
import Flag from '@/components/Flag';
import Input from '@/components/Input';
import PrimaryButton from '@/components/PrimaryButton';
import ScreenHeader from '@/components/ScreenHeader';
import { useAuth } from '@/context/AuthContext';
import { colors } from '@/theme';
import type { Country, User } from '@/types';

export default function EditProfile() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user?.name ?? '');
  const [country, setCountry] = useState<Country>(user?.country ?? 'GH');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(user?.avatarUrl ?? null);
  const [uploading, setUploading] = useState(false);

  const pickAvatar = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (result.canceled || !result.assets[0]) return;
    const asset = result.assets[0];
    setUploading(true);
    try {
      const { url } = await api.upload({
        uri: asset.uri,
        name: asset.fileName ?? 'avatar.jpg',
        mimeType: asset.mimeType ?? 'image/jpeg',
      });
      setAvatarUrl(url);
    } catch {
      Alert.alert('Upload failed', 'Could not upload the image.');
    } finally {
      setUploading(false);
    }
  };

  const save = useMutation({
    mutationFn: () =>
      api.put<User>('/users/me', { name: name.trim(), country, avatarUrl }),
    onSuccess: async (fresh) => {
      await updateUser(fresh);
      router.back();
    },
    onError: (e: any) => Alert.alert('Could not save', e?.message ?? 'Please try again.'),
  });

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={{ flex: 1, paddingTop: insets.top + 6 }}>
        <ScreenHeader title="Edit profile" />
        <ScrollView contentContainerStyle={{ padding: 20, gap: 16 }} keyboardShouldPersistTaps="handled">
          <TouchableOpacity style={styles.avatarWrap} onPress={pickAvatar} disabled={uploading}>
            <Avatar url={avatarUrl} name={name} size={92} />
            <View style={styles.avatarEdit}>
              <Ionicons name="camera-outline" size={15} color="#FFFFFF" />
            </View>
          </TouchableOpacity>
          {uploading ? <Text style={styles.uploading}>Uploading photo...</Text> : null}
          <Input icon="person-outline" placeholder="Full name" value={name} onChangeText={setName} />
          <Text style={styles.label}>Country</Text>
          <View style={styles.chips}>
            <ChoiceChip
              label="Ghana"
              left={<Flag country="GH" size={16} />}
              selected={country === 'GH'}
              onPress={() => setCountry('GH')}
              style={{ flex: 1, justifyContent: 'center' }}
            />
            <ChoiceChip
              label="Nigeria"
              left={<Flag country="NG" size={16} />}
              selected={country === 'NG'}
              onPress={() => setCountry('NG')}
              style={{ flex: 1, justifyContent: 'center' }}
            />
          </View>
          <PrimaryButton
            title="Save changes"
            loading={save.isPending}
            disabled={!name.trim()}
            onPress={() => save.mutate()}
            style={{ marginTop: 8 }}
          />
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  avatarWrap: { alignSelf: 'center' },
  avatarEdit: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  uploading: { textAlign: 'center', fontSize: 12.5, color: colors.inkSoft },
  label: { fontSize: 14, fontWeight: '600', color: colors.ink },
  chips: { flexDirection: 'row', gap: 12 },
});
