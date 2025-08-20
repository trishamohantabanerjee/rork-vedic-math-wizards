import React, { useCallback, useMemo, useState } from 'react';
import { View, Text, TextInput, StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { Stack } from 'expo-router';
import GradientButton from '@/components/GradientButton';
import { colors } from '@/constants/colors';
import { supabase } from '@/utils/supabase';

export default function LoginScreen() {
  const [email, setEmail] = useState<string>('');
  const [isSending, setIsSending] = useState<boolean>(false);
  const [status, setStatus] = useState<string>('');

  const isEmailValid = useMemo(() => /[^\s@]+@[^\s@]+\.[^\s@]+/.test(email), [email]);

  const onSend = useCallback(async () => {
    if (!isEmailValid) {
      setStatus('Enter a valid email');
      return;
    }
    try {
      setIsSending(true);
      setStatus('');
      const redirectTo = Platform.OS === 'web'
        ? `${window.location.origin}/auth/callback`
        : 'myapp://auth/callback';
      console.log('[auth] sending magic link', { redirectTo });
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: redirectTo },
      });
      if (error) {
        console.log('[auth] signInWithOtp error', error.message);
        setStatus('Failed to send link. Try again.');
        return;
      }
      setStatus('Check your email for the magic link.');
    } catch (e) {
      console.log('[auth] send error', e);
      setStatus('Unexpected error. Please retry.');
    } finally {
      setIsSending(false);
    }
  }, [email, isEmailValid]);

  return (
    <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Stack.Screen options={{ title: 'Sign In', headerShown: true }} />
      <View style={styles.container}>
        <Text style={styles.title} testID="loginTitle">Welcome back</Text>
        <Text style={styles.subtitle}>Sign in with a magic link</Text>

        <View style={styles.inputWrap}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            placeholder="you@example.com"
            placeholderTextColor={colors.text.secondary}
            style={styles.input}
            editable={!isSending}
            testID="emailInput"
          />
        </View>

        {status ? (
          <Text style={styles.status} testID="statusText">{status}</Text>
        ) : null}

        {isSending ? (
          <View style={styles.loader}>
            <ActivityIndicator color={colors.accent} />
            <Text style={styles.loadingText}>Sending link…</Text>
          </View>
        ) : null}

        <GradientButton
          title="Send magic link"
          onPress={onSend}
          disabled={!isEmailValid || isSending}
          testID="sendMagicLinkButton"
          align="center"
          size="large"
          style={styles.cta}
          gradient={colors.gradients.secondary}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, padding: 24, gap: 16, justifyContent: 'center' },
  title: { fontSize: 28, fontWeight: '700', color: colors.text.primary, textAlign: 'center' },
  subtitle: { fontSize: 16, color: colors.text.secondary, textAlign: 'center', marginBottom: 8 },
  inputWrap: { gap: 8 },
  label: { color: colors.text.secondary, fontSize: 14 },
  input: {
    borderWidth: 1,
    borderColor: '#1F2A44',
    backgroundColor: '#0F2236',
    color: colors.text.primary,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
  status: { color: colors.text.light, textAlign: 'center' },
  loader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  loadingText: { color: colors.text.secondary },
  cta: { marginTop: 8 },
});