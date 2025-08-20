import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { UserRole } from '@/types/user';
import { colors } from '@/constants/colors';
import WizardMascot from '@/components/WizardMascot';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Users, User, GraduationCap } from 'lucide-react-native';

export default function RoleSelectionScreen() {
  const insets = useSafeAreaInsets();
  const handleRoleSelect = (role: UserRole) => {
    router.push({
      pathname: '/onboarding/profile-setup',
      params: { role },
    });
  };

  const roleOptions = [
    {
      role: 'kid' as UserRole,
      title: 'I\'m a Kid!',
      description: 'Ready to learn amazing math tricks',
      icon: User,
      gradient: colors.gradients.primary,
    },
    {
      role: 'parent' as UserRole,
      title: 'I\'m a Parent',
      description: 'Want to track my child\'s progress',
      icon: Users,
      gradient: colors.gradients.secondary,
    },
    {
      role: 'tutor' as UserRole,
      title: 'I\'m a Tutor',
      description: 'Teaching multiple students',
      icon: GraduationCap,
      gradient: colors.gradients.warm,
    },
  ];

  return (
    <LinearGradient
      colors={colors.gradients.navy}
      style={[styles.container, Platform.OS === 'web' ? ({ minHeight: '100vh' } as any) : null]}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={[styles.content, { paddingBottom: 24 + insets.bottom }]}>
          <View style={styles.header}>
            <WizardMascot size={120} animated />
            <Text style={styles.title}>Welcome to</Text>
            <Text style={styles.appName}>Vedic Math Wizards!</Text>
            <Text style={styles.subtitle}>Who are you?</Text>
          </View>

          <View style={styles.roleContainer}>
            {roleOptions.map((option) => {
              const IconComponent = option.icon;
              return (
                <TouchableOpacity
                  key={option.role}
                  style={styles.roleCard}
                  onPress={() => handleRoleSelect(option.role)}
                  activeOpacity={0.8}
                >
                  <View style={styles.roleGradient}>
                    <IconComponent size={32} color={colors.primary} />
                    <Text style={styles.roleTitle}>{option.title}</Text>
                    <Text style={styles.roleDescription}>{option.description}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.text.primary,
    marginTop: 20,
  },
  appName: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.primary,
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: colors.text.secondary,
    marginTop: 20,
  },
  roleContainer: {
    flex: 1,
    gap: 16,
  },
  roleCard: {
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    backgroundColor: colors.surface,
  },
  roleGradient: {
    padding: 24,
    alignItems: 'center',
    minHeight: 120,
    justifyContent: 'center',
  },
  roleTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text.primary,
    marginTop: 12,
    marginBottom: 4,
  },
  roleDescription: {
    fontSize: 14,
    color: colors.text.secondary,
    opacity: 0.9,
    textAlign: 'center',
  }
});