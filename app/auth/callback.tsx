import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Platform } from 'react-native';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import * as Linking from 'expo-linking';
import { supabase } from '@/utils/supabase';
import { colors } from '@/constants/colors';

function parseParamsFromUrl(url: string): Record<string, string> {
  try {
    if (!url) return {};
    const hasHash = url.includes('#');
    const search = hasHash ? url.split('#')[1] : url.split('?')[1] ?? '';
    const sp = new URLSearchParams(search);
    const out: Record<string, string> = {};
    sp.forEach((v, k) => { out[k] = v; });
    return out;
  } catch (e) {
    console.log('[auth] parse params error', e);
    return {};
  }
}

export default function AuthCallback() {
  const [msg, setMsg] = useState<string>('Finishing sign-in…');
  const params = useLocalSearchParams<Record<string, string | string[]>>();
  const mobileUrl = useMemo(() => `myapp://auth/callback?${new URLSearchParams(params as Record<string, string>).toString()}` as const, [params]);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        if (Platform.OS === 'web') {
          const url = window?.location?.href ?? '';
          const hashParams = parseParamsFromUrl(url);
          if (hashParams.access_token && hashParams.refresh_token) {
            console.log('[auth] setSession via access_token (web magic link)');
            const { data, error } = await supabase.auth.setSession({
              access_token: hashParams.access_token,
              refresh_token: hashParams.refresh_token,
            });
            if (error) {
              console.log('[auth] setSession error', error.message);
              setMsg('Sign-in failed. You can close this and try again.');
              return;
            }
            console.log('[auth] session established', !!data?.session);
          } else {
            console.log('[auth] exchanging code for session (web)');
            const { data, error } = await supabase.auth.exchangeCodeForSession(url);
            if (error) {
              console.log('[auth] exchange error', error.message);
              setMsg('Sign-in failed. You can close this and try again.');
              return;
            }
            console.log('[auth] session established', !!data?.session);
          }
        } else {
          const initialUrl = (await Linking.getInitialURL()) ?? mobileUrl;
          const deepParams = parseParamsFromUrl(initialUrl);
          if (deepParams.access_token && deepParams.refresh_token) {
            console.log('[auth] setSession via access_token (mobile magic link)');
            const { data, error } = await supabase.auth.setSession({
              access_token: deepParams.access_token,
              refresh_token: deepParams.refresh_token,
            });
            if (error) {
              console.log('[auth] setSession error', error.message);
              setMsg('Sign-in failed. You can close this and try again.');
              return;
            }
            console.log('[auth] session established', !!data?.session);
          } else {
            console.log('[auth] exchanging code for session (mobile deep link)');
            const { data, error } = await supabase.auth.exchangeCodeForSession(initialUrl);
            if (error) {
              console.log('[auth] exchange error', error.message);
              setMsg('Sign-in failed. You can close this and try again.');
              return;
            }
            console.log('[auth] session established', !!data?.session);
          }
        }
        if (!active) return;
        setMsg('Signed in! Redirecting…');
        router.replace('/dashboard');
      } catch (e) {
        console.log('[auth] callback error', e);
        setMsg('Unexpected error. Close this screen and retry.');
      }
    })();
    return () => { active = false; };
  }, [mobileUrl]);

  return (
    <View style={styles.screen}>
      <Stack.Screen options={{ title: 'Authenticating…', headerShown: true }} />
      <ActivityIndicator color={colors.accent} />
      <Text style={styles.text} testID="authCallbackStatus">{msg}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 24 },
  text: { color: colors.text.primary, textAlign: 'center' },
});