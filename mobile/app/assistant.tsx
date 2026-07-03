import React, { useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useMutation } from '@tanstack/react-query';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { api, ApiError } from '@/api';
import PrimaryButton from '@/components/PrimaryButton';
import RecipeCard from '@/components/RecipeCard';
import ScreenHeader from '@/components/ScreenHeader';
import { useAuth } from '@/context/AuthContext';
import { colors, shadow } from '@/theme';
import type { AssistantMessage, AssistantResponse, Recipe } from '@/types';

const SUGGESTIONS: { text: string; img: string }[] = [
  {
    text: 'What can I cook with plantain?',
    img: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=96&h=96&fit=crop&q=80&auto=format',
  },
  {
    text: 'Fast meals under 30 min',
    img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=96&h=96&fit=crop&q=80&auto=format',
  },
  {
    text: 'Low calorie Nigerian dishes',
    img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=96&h=96&fit=crop&q=80&auto=format',
  },
];

interface Bubble {
  role: 'user' | 'assistant';
  content: string;
  recipes?: Recipe[];
}

export default function Assistant() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const [bubbles, setBubbles] = useState<Bubble[]>([
    {
      role: 'assistant',
      content:
        "Akwaaba! I'm Dishaspora — ask me anything about our recipes: ingredients you have, time you've got, cravings you can't name.",
    },
  ]);
  const [input, setInput] = useState('');
  const [gated, setGated] = useState(!user?.premium);
  const scrollRef = useRef<ScrollView>(null);

  const chat = useMutation({
    mutationFn: (message: string) => {
      const history: AssistantMessage[] = bubbles
        .slice(-6)
        .map((b) => ({ role: b.role, content: b.content }));
      return api.post<AssistantResponse>('/assistant/chat', { message, history });
    },
    onSuccess: (res) => {
      setBubbles((prev) => [
        ...prev,
        { role: 'assistant', content: res.reply, recipes: res.recipes },
      ]);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 80);
    },
    onError: (e) => {
      if (e instanceof ApiError && e.premiumRequired) {
        setGated(true);
        return;
      }
      setBubbles((prev) => [
        ...prev,
        { role: 'assistant', content: 'Sorry — I hit a snag. Try that again in a moment.' },
      ]);
    },
  });

  const send = (text: string) => {
    const message = text.trim();
    if (!message || chat.isPending) return;
    setBubbles((prev) => [...prev, { role: 'user', content: message }]);
    setInput('');
    chat.mutate(message);
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 80);
  };

  if (gated) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, paddingTop: insets.top + 6 }}>
        <ScreenHeader title="Ask Dishaspora" />
        <View style={styles.gate}>
          <View style={styles.gateBadge}>
            <Text style={styles.gateD}>D</Text>
          </View>
          <Text style={styles.gateTitle}>Your personal food guide</Text>
          <Text style={styles.gateSub}>
            Ask Dishaspora knows every recipe on the platform — what to cook with what you
            have, meals for your macros, dishes from home you half-remember. It's a Premium
            feature.
          </Text>
          <PrimaryButton
            title="Go Premium"
            onPress={() => router.push('/subscription')}
            style={{ alignSelf: 'stretch', marginTop: 26 }}
          />
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={{ flex: 1, paddingTop: insets.top + 6 }}>
        <ScreenHeader title="Ask Dishaspora" />
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={{ padding: 20, paddingBottom: 20, gap: 14 }}
          showsVerticalScrollIndicator={false}
        >
          {bubbles.map((bubble, i) =>
            bubble.role === 'user' ? (
              <Animated.View key={i} entering={FadeInUp.duration(250)} style={styles.userBubble}>
                <Text style={styles.userText}>{bubble.content}</Text>
              </Animated.View>
            ) : (
              <Animated.View key={i} entering={FadeInDown.duration(250)} style={styles.assistantRow}>
                <View style={styles.dAvatar}>
                  <Text style={styles.dAvatarText}>D</Text>
                </View>
                <View style={{ flex: 1, gap: 10 }}>
                  <View style={styles.assistantBubble}>
                    <Text style={styles.assistantText}>{bubble.content}</Text>
                  </View>
                  {bubble.recipes && bubble.recipes.length > 0 ? (
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                      <View style={{ flexDirection: 'row', gap: 12 }}>
                        {bubble.recipes.map((recipe) => (
                          <View key={recipe.id} style={{ width: 170 }}>
                            <RecipeCard recipe={recipe} />
                          </View>
                        ))}
                      </View>
                    </ScrollView>
                  ) : null}
                </View>
              </Animated.View>
            )
          )}
          {chat.isPending ? (
            <View style={styles.assistantRow}>
              <View style={styles.dAvatar}>
                <Text style={styles.dAvatarText}>D</Text>
              </View>
              <View style={[styles.assistantBubble, { paddingVertical: 14 }]}>
                <Text style={styles.typing}>Thinking about the pot...</Text>
              </View>
            </View>
          ) : null}
        </ScrollView>

        {/* Suggestion chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.suggestions}
        >
          {SUGGESTIONS.map((s) => (
            <TouchableOpacity
              key={s.text}
              style={styles.suggestionChip}
              onPress={() => send(s.text)}
              activeOpacity={0.8}
            >
              <Image source={{ uri: s.img }} style={styles.suggestionImg} contentFit="cover" />
              <Text style={styles.suggestionText} numberOfLines={1}>
                {s.text}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={[styles.inputRow, { paddingBottom: Math.max(insets.bottom, 12) }]}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="Ask about any dish..."
            placeholderTextColor={colors.inkFaint}
            onSubmitEditing={() => send(input)}
            returnKeyType="send"
          />
          <TouchableOpacity
            style={[styles.sendBtn, (!input.trim() || chat.isPending) && { opacity: 0.5 }]}
            onPress={() => send(input)}
            disabled={!input.trim() || chat.isPending}
          >
            <Ionicons name="arrow-up" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  gate: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  gateBadge: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: colors.brand,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow,
  },
  gateD: { color: '#FFFFFF', fontSize: 36, fontWeight: '800' },
  gateTitle: { fontSize: 21, fontWeight: '800', color: colors.ink, marginTop: 22 },
  gateSub: {
    fontSize: 13.5,
    color: colors.inkSoft,
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 20,
  },
  userBubble: {
    alignSelf: 'flex-end',
    maxWidth: '82%',
    backgroundColor: colors.accentLight,
    borderRadius: 20,
    borderBottomRightRadius: 6,
    paddingHorizontal: 16,
    paddingVertical: 11,
  },
  userText: { fontSize: 14, color: colors.ink, lineHeight: 20 },
  assistantRow: { flexDirection: 'row', gap: 8, alignItems: 'flex-end', maxWidth: '94%' },
  dAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.brand,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dAvatarText: { color: '#FFFFFF', fontSize: 13, fontWeight: '800' },
  assistantBubble: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    borderBottomLeftRadius: 6,
    paddingHorizontal: 16,
    paddingVertical: 11,
    alignSelf: 'flex-start',
  },
  assistantText: { fontSize: 14, color: colors.ink, lineHeight: 20 },
  typing: { fontSize: 13, color: colors.inkFaint, fontStyle: 'italic' },
  suggestions: { paddingHorizontal: 20, gap: 8, paddingVertical: 10, alignItems: 'center' },
  suggestionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 40,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: colors.surfaceAlt,
    borderRadius: 20,
    paddingLeft: 5,
    paddingRight: 14,
    ...shadow,
  },
  suggestionImg: { width: 30, height: 30, borderRadius: 15 },
  suggestionText: { fontSize: 12.5, color: colors.ink, fontWeight: '600' },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 20,
    paddingTop: 6,
  },
  input: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 999,
    paddingHorizontal: 18,
    height: 48,
    fontSize: 14,
    color: colors.ink,
  },
  sendBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
