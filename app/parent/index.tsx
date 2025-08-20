import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets, SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/constants/colors';
import { useUser } from '@/hooks/user-store';
import WizardMascot from '@/components/WizardMascot';
import GradientButton from '@/components/GradientButton';
import { router } from 'expo-router';
import { Plus, QrCode, Users } from 'lucide-react-native';

export default function ParentHomeScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useUser();

  if (!user) {
    router.replace('/onboarding/role-selection');
    return null;
  }

  const isViewer = user.role === 'parent' || user.role === 'tutor';

  return (
    <LinearGradient
      colors={['#F0F9FF', '#E0F2FE']}
      style={[styles.container, Platform.OS === 'web' ? ({ minHeight: '100vh' } as any) : null]}
    >
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[styles.content, { paddingBottom: 24 + insets.bottom }]}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <WizardMascot size={56} />
              <View style={styles.headerTextWrap}>
                <Text style={styles.title}>Welcome, {user.name}</Text>
                <Text style={styles.subtitle}>{isViewer ? 'Linked kids' : 'Your kids'}</Text>
              </View>
            </View>
            <View style={styles.headerActions}>
              <TouchableOpacity style={styles.iconBtn} onPress={() => router.push('/invite/manage')}>
                <Users size={20} color={colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconBtn} onPress={() => router.push('/invite')}>
                <QrCode size={20} color={colors.primary} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No kids linked yet</Text>
            <Text style={styles.emptyDesc}>Invite a parent/tutor or add a kid to start tracking progress.</Text>
            <GradientButton
              title={isViewer ? 'Enter Invite Code' : 'Add Kid'}
              onPress={() => router.push(isViewer ? '/invite' : '/invite/manage')}
              size="large"
              align="center"
              maxWidth={420}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  scroll: { flex: 1 },
  content: { flexGrow: 1 },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  headerTextWrap: { flex: 1 },
  title: { fontSize: 20, fontWeight: '800', color: colors.text.primary },
  subtitle: { fontSize: 14, color: colors.text.secondary, marginTop: 2 },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  emptyTitle: { fontSize: 20, fontWeight: '800', color: colors.text.primary, marginBottom: 8, textAlign: 'center' },
  emptyDesc: { fontSize: 14, color: colors.text.secondary, textAlign: 'center', marginBottom: 16 },
});
