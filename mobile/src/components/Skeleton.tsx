import React, { useEffect } from 'react';
import { DimensionValue, StyleSheet, View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { colors } from '../theme';

const AnimatedGradient = Animated.createAnimatedComponent(LinearGradient);

/** Shimmering skeleton block (reanimated, UI thread). */
export function Skeleton({
  width = '100%',
  height = 16,
  radius = 12,
  style,
}: {
  width?: DimensionValue;
  height?: DimensionValue;
  radius?: number;
  style?: ViewStyle;
}) {
  const x = useSharedValue(-1);

  useEffect(() => {
    x.value = withRepeat(
      withTiming(1, { duration: 1100, easing: Easing.inOut(Easing.ease) }),
      -1,
      false
    );
  }, [x]);

  const shimmer = useAnimatedStyle(() => ({
    transform: [{ translateX: x.value * 260 }],
  }));

  return (
    <View
      style={[
        { width, height, borderRadius: radius, backgroundColor: colors.surfaceAlt, overflow: 'hidden' },
        style,
      ]}
    >
      <AnimatedGradient
        colors={['transparent', 'rgba(255,255,255,0.75)', 'transparent']}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={[StyleSheet.absoluteFill, shimmer]}
      />
    </View>
  );
}

/** 2-col grid of card skeletons for list screens. */
export function SkeletonGrid({ count = 4 }: { count?: number }) {
  return (
    <View style={sg.grid}>
      {Array.from({ length: count }).map((_, i) => (
        <View key={i} style={sg.cell}>
          <Skeleton height={160} radius={20} />
          <Skeleton width="75%" height={13} style={{ marginTop: 10 }} />
          <Skeleton width="45%" height={11} style={{ marginTop: 6 }} />
        </View>
      ))}
    </View>
  );
}

/** Horizontal row of card skeletons. */
export function SkeletonRow({ count = 3, cardWidth = 180 }: { count?: number; cardWidth?: number }) {
  return (
    <View style={{ flexDirection: 'row', gap: 14 }}>
      {Array.from({ length: count }).map((_, i) => (
        <View key={i} style={{ width: cardWidth }}>
          <Skeleton height={120} radius={20} />
          <Skeleton width="70%" height={12} style={{ marginTop: 8 }} />
        </View>
      ))}
    </View>
  );
}

const sg = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 14 },
  cell: { width: '47%', flexGrow: 1 },
});
