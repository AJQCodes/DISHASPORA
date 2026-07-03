import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme';
import PrimaryButton from './PrimaryButton';

export function LoadingView() {
  return (
    <View style={styles.center}>
      <ActivityIndicator size="large" color={colors.brandDark} />
    </View>
  );
}

export function ErrorView({
  message = 'Something went wrong.',
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <View style={styles.center}>
      <Text style={styles.errorText}>{message}</Text>
      {onRetry ? (
        <PrimaryButton title="Try again" onPress={onRetry} style={{ marginTop: 16, paddingHorizontal: 40 }} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    backgroundColor: colors.background,
  },
  errorText: { color: colors.inkSoft, fontSize: 14, textAlign: 'center', lineHeight: 21 },
});
