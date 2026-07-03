import React from 'react';
import { StyleSheet, TextInput, TextInputProps, View, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';

/** Rounded surface input with a leading icon (auth/forms). */
export default function Input({
  icon,
  style,
  multiline,
  ...props
}: TextInputProps & { icon?: keyof typeof Ionicons.glyphMap; style?: ViewStyle }) {
  return (
    <View style={[styles.wrap, multiline ? styles.multiline : styles.single, style]}>
      {icon ? (
        <Ionicons name={icon} size={18} color={colors.inkFaint} style={multiline && { marginTop: 2 }} />
      ) : null}
      <TextInput
        style={[styles.input, multiline && styles.inputMultiline]}
        placeholderTextColor={colors.inkFaint}
        multiline={multiline}
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.surface,
    paddingHorizontal: 18,
  },
  single: { borderRadius: 999, height: 52 },
  multiline: { borderRadius: 20, paddingVertical: 14, alignItems: 'flex-start' },
  input: { flex: 1, fontSize: 14.5, color: colors.ink, paddingVertical: 0 },
  inputMultiline: { minHeight: 80, textAlignVertical: 'top' },
});
