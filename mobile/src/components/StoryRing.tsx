import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Image } from 'expo-image';
import { IMG } from '../config';
import { colors } from '../theme';
import type { Story } from '../types';

/** Story circle with cyan ring for the home strip. */
export default function StoryRing({
  story,
  onPress,
}: {
  story: Story;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.wrap} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.ring}>
        <Image
          source={{ uri: IMG(story.imageUrl) }}
          style={styles.image}
          contentFit="cover"
        />
      </View>
      <Text style={styles.label} numberOfLines={1}>
        {story.title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', width: 72 },
  ring: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2.5,
    borderColor: colors.brand,
    padding: 2.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 28,
    backgroundColor: colors.surfaceAlt,
  },
  label: {
    fontSize: 10.5,
    color: colors.inkSoft,
    marginTop: 5,
    textAlign: 'center',
  },
});
