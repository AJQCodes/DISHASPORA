import React from 'react';
import { Redirect } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { LoadingView } from '@/components/StatusViews';

export default function Index() {
  const { loading, token, onboarded } = useAuth();
  if (loading) return <LoadingView />;
  if (!onboarded) return <Redirect href="/onboarding" />;
  if (!token) return <Redirect href="/(auth)/login" />;
  return <Redirect href="/(tabs)" />;
}
