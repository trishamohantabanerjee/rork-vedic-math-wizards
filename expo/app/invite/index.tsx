import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TextInput, Alert, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import GradientButton from '@/components/GradientButton';
import { useSafeAreaInsets, SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/constants/colors';
import { supabase } from '@/utils/supabase';
import { useUser } from '@/hooks/user-store';

export default function InviteCodeScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useUser();
  const [code, setCode] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = useCallback(async () => {
    if (!code.trim()) {
      Alert.alert('Enter code', 'Please paste the invite code.');
      return;
    }
    if (!user) {
      Alert.alert('Not signed in', 'Please complete onboarding first.');
      return;
    }
    setIsLoading(true);
    try {
      const { data, error } = await supabase.rpc('accept_invite_code', { p_code: code.trim() });
      if (error) {
        Alert.alert('Could not link', error.message ?? 'Unknown error. The code may be invalid or expired.');
        return;
      }
      Alert.alert('Linked!', 'Access granted. You can now view this kid.', [{ text: 'OK' }]);
    } catch (e) {
      Alert.alert('Error', 'Server unavailable right now. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, [code, user]);

  return (
    <LinearGradient
      colors={['#F0F9FF', '#E0F2FE']}
      style={[styles.container, Platform.OS === 'web' ? ({ minHeight: '100vh' } as any) : null]}
    >
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={[styles.content, { paddingBottom: 24 + insets.bottom }]}>
          <Text style={styles.title}>Enter Invite Code</Text>
          <Text style={styles.subtitle}>Paste the short code you received to link a kid.</Text>

          <View style={styles.inputWrap}>
            <TextInput
              style={styles.input}
              placeholder="e.g. X7K4-92"
              placeholderTextColor={colors.text.light}
              value={code}
              onChangeText={setCode}
              autoCapitalize="characters"
              autoCorrect={false}
              maxLength={20}
              textAlign="center"
              testID="input-invite-code"
            />
          </View>

          <GradientButton
            title={isLoading ? 'Linking…' : 'Link Kid'}
            onPress={handleSubmit}
            disabled={isLoading || !code.trim()}
            size="large"
            align="center"
            maxWidth={420}
            testID="cta-link-code"
          />

          <Text style={styles.helper}>Trouble? Ask the sender to regenerate a new code.</Text>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  content: { flex: 1, paddingHorizontal: 24, gap: 16, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: '800', color: colors.text.primary, textAlign: 'center' },
  subtitle: { fontSize: 14, color: colors.text.secondary, textAlign: 'center' },
  inputWrap: { backgroundColor: colors.surface, borderRadius: 16, paddingHorizontal: 16, paddingVertical: 4, width: '100%', maxWidth: 420, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2 },
  input: { fontSize: 18, color: colors.text.primary, paddingVertical: 14, letterSpacing: 2 },
  helper: { fontSize: 12, color: colors.text.light, textAlign: 'center', marginTop: 12 },
});
