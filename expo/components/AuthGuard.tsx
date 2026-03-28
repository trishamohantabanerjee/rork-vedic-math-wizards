import React, { ReactNode, useEffect, useState } from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { supabase } from '@/utils/supabase';
import { colors } from '@/constants/colors';

interface AuthGuardProps {
  children: ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const [checking, setChecking] = useState<boolean>(true);
  const [isAuthed, setIsAuthed] = useState<boolean>(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        console.log('[AuthGuard] Checking session');
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.log('[AuthGuard] getSession error', error.message);
        }
        const hasSession = !!data?.session;
        if (!mounted) return;
        setIsAuthed(hasSession);
        setChecking(false);
        if (!hasSession) {
          console.log('[AuthGuard] No session, redirecting to /auth/login');
          router.replace('/auth/login');
        }
      } catch (e) {
        console.log('[AuthGuard] Unexpected error', e);
        if (!mounted) return;
        setChecking(false);
        setIsAuthed(false);
        router.replace('/auth/login');
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  if (checking) {
    return (
      <View style={styles.center} testID="authGuardLoading">
        <ActivityIndicator color={colors.accent} />
        <Text style={styles.text}>Checking authentication…</Text>
      </View>
    );
  }

  if (!isAuthed) {
    return (
      <View style={styles.center} testID="authGuardRedirecting">
        <Text style={styles.text}>Redirecting to sign in…</Text>
      </View>
    );
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background, gap: 8 },
  text: { color: colors.text.secondary },
});