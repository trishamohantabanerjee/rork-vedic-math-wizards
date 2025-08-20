import React, { useEffect, useMemo } from 'react';
import { View, StyleSheet, Platform, TouchableOpacity, Text, Image, useWindowDimensions } from 'react-native';
import { router, Stack } from 'expo-router';
import { useUser } from '@/hooks/user-store';
import { colors } from '@/constants/colors';

const HERO_URI = 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/k40eny8utgum79wr3nfoq';

export default function IndexScreen() {
  const { user, isLoading } = useUser();
  const { width, height } = useWindowDimensions();

  useEffect(() => {
    console.log('[index] mount');

    if (Platform.OS === 'web') {
      const hash = window.location.hash ?? '';
      if (hash.includes('access_token=')) {
        const params = new URLSearchParams(hash.replace(/^#/, ''));
        const obj: Record<string, string> = {};
        params.forEach((v, k) => { obj[k] = v; });
        console.log('[index] found access_token in hash → forwarding to /auth/callback');
        router.replace({ pathname: '/auth/callback', params: obj });
        return;
      }
    }

    if (!isLoading && user) {
      console.log('[index] redirecting for user role', user.role);
      if (user.role === 'kid') {
        router.replace('/dashboard');
      } else {
        router.replace('/parent');
      }
    }
  }, [user, isLoading]);

  const heroSize = useMemo(() => {
    const max = 360;
    const byWidth = Math.round(width * 0.6);
    const byHeight = Math.round(height * 0.32);
    const computed = Math.min(max, byWidth, byHeight);
    return Math.max(160, computed);
  }, [width, height]);

  return (
    <View style={[styles.container, Platform.OS === 'web' ? ({ minHeight: '100vh' } as any) : null]}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Welcome',
          headerRight: () => (
            <TouchableOpacity
              onPress={() => router.push('/auth/login')}
              style={{ paddingHorizontal: 12, paddingVertical: 6 }}
              testID="headerSignInButton"
            >
              <Text style={{ color: colors.accent, fontWeight: '700' }}>Sign In</Text>
            </TouchableOpacity>
          ),
        }}
      />
      <View style={styles.content}>
        <Image
          source={{ uri: HERO_URI }}
          style={{ width: heroSize, height: heroSize, aspectRatio: 1, marginBottom: 18 }}
          resizeMode="contain"
          accessibilityLabel="Welcome illustration"
          testID="homeHero"
        />
        <Text style={styles.headline} accessibilityRole="header" testID="welcomeMessage">
          Welcome to Anksutra
        </Text>
        <Text style={styles.subhead}>Sharpen skills with quick, fun practice.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 24,
    gap: 2,
  },
  headline: {
    color: colors.text.primary,
    fontSize: 22,
    fontWeight: '700' as const,
    textAlign: 'center' as const,
  },
  subhead: {
    color: colors.text.secondary,
    fontSize: 14,
    marginTop: 4,
    textAlign: 'center' as const,
  },
});