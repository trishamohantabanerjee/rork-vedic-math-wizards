import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { router } from 'expo-router';
import { colors } from '@/constants/colors';
import { Shield, FileText, Users, ChevronRight } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface PolicyItem {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  route: string;
}

const policyItems: PolicyItem[] = [
  {
    id: 'privacy',
    title: 'Privacy Policy',
    description: 'How we collect, use, and protect your personal information',
    icon: <Shield size={24} color={colors.primary} />,
    route: '/policies/privacy-policy',
  },
  {
    id: 'terms',
    title: 'Terms of Service',
    description: 'Rules and guidelines for using Vedic Math Wizards',
    icon: <FileText size={24} color={colors.primary} />,
    route: '/policies/terms-of-service',
  },
  {
    id: 'safety',
    title: 'Safety Guidelines',
    description: 'Keeping children safe while learning and having fun',
    icon: <Users size={24} color={colors.primary} />,
    route: '/policies/safety-guidelines',
  },
];

export default function PoliciesScreen() {
  const insets = useSafeAreaInsets();
  const handlePolicyPress = (route: string) => {
    router.push(route as any);
  };

  return (
    <View
      style={[styles.container, Platform.OS === 'web' ? ({ minHeight: '100vh' } as any) : null]}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView 
          style={styles.scrollView} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 24 + insets.bottom }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Text style={styles.title}>Policies & Guidelines</Text>
            <Text style={styles.subtitle}>
              Important information about using Vedic Math Wizards safely and responsibly
            </Text>
          </View>

          <View style={styles.policiesList}>
            {policyItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.policyCard}
                onPress={() => handlePolicyPress(item.route)}
                activeOpacity={0.8}
              >
                <View style={styles.policyContent}>
                  <View style={styles.policyIcon}>
                    {item.icon}
                  </View>
                  <View style={styles.policyText}>
                    <Text style={styles.policyTitle}>{item.title}</Text>
                    <Text style={styles.policyDescription}>{item.description}</Text>
                  </View>
                  <ChevronRight size={20} color={colors.text.secondary} />
                </View>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Last updated: January 2025
            </Text>
            <Text style={styles.footerSubtext}>
              If you have any questions about these policies, please contact our support team.
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text.secondary,
    lineHeight: 24,
  },
  policiesList: {
    paddingHorizontal: 24,
    gap: 16,
  },
  policyCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  policyContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  policyIcon: {
    width: 48,
    height: 48,
    backgroundColor: colors.background,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  policyText: {
    flex: 1,
  },
  policyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 4,
  },
  policyDescription: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  footer: {
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.secondary,
    marginBottom: 8,
  },
  footerSubtext: {
    fontSize: 12,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 18,
  },
});