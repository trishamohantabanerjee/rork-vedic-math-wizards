import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TextInput, Alert, Platform, FlatList, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import GradientButton from '@/components/GradientButton';
import { useSafeAreaInsets, SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/constants/colors';
import { supabase } from '@/utils/supabase';
import { useUser } from '@/hooks/user-store';
import { QrCode, Copy, Share2 } from 'lucide-react-native';

interface InviteItem { id: string; code: string; role: 'parent' | 'tutor'; status: 'pending' | 'active'; created_at: string; }

export default function ManageInvitesScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useUser();
  const [kidName, setKidName] = useState<string>('');
  const [role, setRole] = useState<'parent' | 'tutor'>('parent');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [invites, setInvites] = useState<InviteItem[]>([]);

  const handleGenerate = useCallback(async () => {
    if (!kidName.trim()) {
      Alert.alert('Kid name required', 'Enter the kid name to generate an invite.');
      return;
    }
    if (!user) {
      Alert.alert('Not signed in', 'Please complete onboarding first.');
      return;
    }
    setIsLoading(true);
    try {
      const { data, error } = await supabase.rpc('generate_invite_code', { p_kid_name: kidName.trim(), p_role: role });
      if (error) {
        Alert.alert('Failed', error.message ?? 'Could not generate code.');
        return;
      }
      const item: InviteItem = { id: (data?.id ?? Date.now()).toString(), code: data?.code ?? 'XXXX-YY', role, status: 'pending', created_at: new Date().toISOString() };
      setInvites((prev) => [item, ...prev]);
      Alert.alert('Invite created', `Share this code: ${item.code}`);
    } catch (e) {
      Alert.alert('Error', 'Server unavailable right now. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, [kidName, role, user]);

  return (
    <LinearGradient
      colors={['#F0F9FF', '#E0F2FE']}
      style={[styles.container, Platform.OS === 'web' ? ({ minHeight: '100vh' } as any) : null]}
    >
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={[styles.content, { paddingBottom: 24 + insets.bottom }]}>
          <Text style={styles.title}>Invite Parent/Tutor</Text>
          <Text style={styles.subtitle}>Create a code to link viewers to a kid.</Text>

          <View style={styles.formRow}>
            <TextInput
              style={styles.input}
              placeholder="Kid name (or select existing)"
              placeholderTextColor={colors.text.light}
              value={kidName}
              onChangeText={setKidName}
              autoCapitalize="words"
              autoCorrect={false}
              maxLength={40}
            />
          </View>

          <View style={styles.roleRow}>
            {(['parent', 'tutor'] as const).map((r) => (
              <TouchableOpacity key={r} style={[styles.roleChip, role === r ? styles.roleChipActive : undefined]} onPress={() => setRole(r)}>
                <Text style={[styles.roleChipText, role === r ? styles.roleChipTextActive : undefined]}>{r === 'parent' ? 'Invite Parent' : 'Invite Tutor'}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <GradientButton
            title={isLoading ? 'Generating…' : 'Generate Code'}
            onPress={handleGenerate}
            disabled={isLoading || !kidName.trim()}
            size="large"
            align="center"
            maxWidth={420}
            testID="cta-generate-code"
          />

          <FlatList
            data={invites}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingTop: 16, paddingBottom: 8 }}
            renderItem={({ item }) => (
              <View style={styles.inviteCard}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.inviteCode}>{item.code}</Text>
                  <Text style={styles.inviteMeta}>{item.role.toUpperCase()} • {new Date(item.created_at).toLocaleString()}</Text>
                </View>
                <View style={styles.inviteActions}>
                  <TouchableOpacity style={styles.smallBtn} onPress={() => {}}>
                    <Copy size={16} color={colors.primary} />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.smallBtn} onPress={() => {}}>
                    <Share2 size={16} color={colors.primary} />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  content: { flex: 1, paddingHorizontal: 24 },
  title: { fontSize: 24, fontWeight: '800', color: colors.text.primary, textAlign: 'center', marginTop: 16 },
  subtitle: { fontSize: 14, color: colors.text.secondary, textAlign: 'center', marginBottom: 16 },
  formRow: { backgroundColor: colors.surface, borderRadius: 16, paddingHorizontal: 16, paddingVertical: 4, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2 },
  input: { fontSize: 16, color: colors.text.primary, paddingVertical: 12 },
  roleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, justifyContent: 'center', marginVertical: 12 },
  roleChip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999, backgroundColor: '#DBEAFE' },
  roleChipActive: { backgroundColor: colors.primary },
  roleChipText: { fontSize: 12, fontWeight: '700', color: colors.primary },
  roleChipTextActive: { color: '#FFFFFF' },
  inviteCard: { backgroundColor: colors.surface, borderRadius: 12, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, marginBottom: 10 },
  inviteCode: { fontSize: 18, fontWeight: '800', color: colors.text.primary },
  inviteMeta: { fontSize: 12, color: colors.text.secondary, marginTop: 4 },
  inviteActions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  smallBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#E0EAFF', alignItems: 'center', justifyContent: 'center' },
});
