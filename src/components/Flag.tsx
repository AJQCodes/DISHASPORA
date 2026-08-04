import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';
import { colors } from '../theme';

/**
 * Small inline vector flag badge (NO emoji per design rule).
 * Ghana: red/gold/green horizontal bands + black star. Nigeria: green/white/green
 * vertical bands. Any other country renders a small text pill with the code.
 */
export default function Flag({
  country,
  size = 18,
  style,
}: {
  country: string;
  size?: number;
  style?: ViewStyle;
}) {
  const w = size * 1.4;
  const h = size;
  if (country === 'GH') {
    const bandH = 300 / 3;
    const cx = 210;
    const cy = 150;
    const r = 42;
    const star = starPath(cx, cy, r);
    return (
      <View style={[styles.wrap, { width: w, height: h, borderRadius: h * 0.24 }, style]}>
        <Svg width={w} height={h} viewBox="0 0 420 300">
          <Rect x={0} y={0} width={420} height={bandH} fill="#CE1126" />
          <Rect x={0} y={bandH} width={420} height={bandH} fill="#FCD116" />
          <Rect x={0} y={bandH * 2} width={420} height={bandH} fill="#006B3F" />
          <Path d={star} fill="#000000" />
        </Svg>
      </View>
    );
  }
  if (country === 'NG') {
    return (
      <View style={[styles.wrap, { width: w, height: h, borderRadius: h * 0.24 }, style]}>
        <Svg width={w} height={h} viewBox="0 0 420 300">
          <Rect x={0} y={0} width={140} height={300} fill="#008751" />
          <Rect x={140} y={0} width={140} height={300} fill="#FFFFFF" />
          <Rect x={280} y={0} width={140} height={300} fill="#008751" />
        </Svg>
      </View>
    );
  }
  return (
    <View style={[styles.pill, { height: h, borderRadius: h / 2 }, style]}>
      <Text style={[styles.pillText, { fontSize: h * 0.5 }]}>{country}</Text>
    </View>
  );
}

function starPath(cx: number, cy: number, r: number): string {
  const points: string[] = [];
  for (let i = 0; i < 10; i++) {
    const radius = i % 2 === 0 ? r : r * 0.42;
    const angle = (Math.PI / 5) * i - Math.PI / 2;
    const x = cx + radius * Math.cos(angle);
    const y = cy + radius * Math.sin(angle);
    points.push(`${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`);
  }
  return points.join(' ') + ' Z';
}

const styles = StyleSheet.create({
  wrap: {
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(23,37,42,0.15)',
  },
  pill: {
    paddingHorizontal: 7,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillText: { fontWeight: '800', color: colors.inkSoft, letterSpacing: 0.5 },
});
