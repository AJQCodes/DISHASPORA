import React from 'react';
import { StyleSheet, Text, TextStyle } from 'react-native';
import { colors } from '../theme';

/** "Grilled chicken breast" — first word bold ink, rest inkSoft light. */
export default function TwoToneTitle({
  text,
  size = 28,
  style,
}: {
  text: string;
  size?: number;
  style?: TextStyle;
}) {
  const words = text.trim().split(/\s+/);
  const first = words[0] ?? '';
  const rest = words.slice(1).join(' ');
  return (
    <Text style={[styles.base, { fontSize: size, lineHeight: size * 1.2 }, style]}>
      <Text style={styles.first}>{first}</Text>
      {rest ? <Text style={styles.rest}> {rest}</Text> : null}
    </Text>
  );
}

const styles = StyleSheet.create({
  base: { flexWrap: 'wrap' },
  first: { color: colors.ink, fontWeight: '700' },
  rest: { color: colors.inkSoft, fontWeight: '300' },
});
