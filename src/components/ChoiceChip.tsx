import React from 'react';
import { StyleSheet, Text, TouchableOpacity, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';

/** Rounded-full outline chip; selected = solid ink (black) with white text. */
export default function ChoiceChip({
  label,
  selected,
  onPress,
  onRemove,
  left,
  style,
}: {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  onRemove?: () => void;
  /** Optional leading node (e.g. a Flag badge). */
  left?: React.ReactNode;
  style?: ViewStyle;
}) {
  return (
    <TouchableOpacity
      onPress={onPress ?? onRemove}
      activeOpacity={0.8}
      style={[styles.chip, selected && styles.selected, style]}
    >
      {left ? <>{left}</> : null}
      <Text style={[styles.label, selected && styles.labelSelected, left ? { marginLeft: 6 } : null]}>
        {label}
      </Text>
      {onRemove ? (
        <Ionicons
          name="close"
          size={14}
          color={selected ? '#FFFFFF' : colors.inkSoft}
          style={{ marginLeft: 4 }}
        />
      ) : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.surfaceAlt,
    backgroundColor: '#FFFFFF',
    paddingVertical: 9,
    paddingHorizontal: 16,
  },
  selected: { backgroundColor: colors.ink, borderColor: colors.ink },
  label: { fontSize: 13, color: colors.inkSoft, fontWeight: '500' },
  labelSelected: { color: '#FFFFFF' },
});
