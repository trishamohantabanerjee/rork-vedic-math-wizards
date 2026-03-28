import React, { useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, ActivityIndicator, Alert } from 'react-native';
import { router, Stack } from 'expo-router';
import { colors } from '@/constants/colors';
import { useUser } from '@/hooks/user-store';
import { vedicMathModules } from '@/constants/modules';
import WizardMascot from '@/components/WizardMascot';
import ProgressBar from '@/components/ProgressBar';
import { useSafeAreaInsets, SafeAreaView } from 'react-native-safe-area-context';
import AuthGuard from '@/components/AuthGuard';

import { Star, Trophy, Zap, Play, Lock, Settings, LogOut } from 'lucide-react-native';

export default function DashboardScreen() {
  const { user, isLoading, getModuleProgress, logout } = useUser();
  const insets = useSafeAreaInsets();

  const onSignOut = useCallback(async () => {
    try {
      console.log('[dashboard] signing out');
      await logout();
      router.replace('/');
    } catch (e) {
      Alert.alert('Sign out failed', 'Please try again.');
    }
  }, [logout]);

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/onboarding/role-selection');
    }
  }, [isLoading, user]);

  if (isLoading || !user) {
    return (
      <View style={[styles.container, { alignItems: 'center', justifyContent: 'center' }]} testID="dashboard-loading">
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ marginTop: 12, color: colors.text.secondary }}>Loading...</Text>
      </View>
    );
  }

  const completedModules = user.completedModules.length;
  const totalModules = vedicMathModules.length;
  const progressPercentage = totalModules > 0 ? completedModules / totalModules : 0;

  const handleModulePress = (moduleId: string, isUnlocked: boolean, isPremium: boolean) => {
    if (!isUnlocked) return;

    router.push({
      pathname: '/module/[id]',
      params: { id: moduleId },
    });
  };

  const getOperationIcon = (operation: string) => {
    switch (operation) {
      case 'addition': return '+';
      case 'subtraction': return '−';
      case 'multiplication': return '×';
      case 'division': return '÷';
      default: return '+';
    }
  };

  return (
    <AuthGuard>
      <View
        style={[
          styles.container,
          Platform.OS === 'web' ? ({ minHeight: '100vh' } as any) : null,
        ]}
      >
        <Stack.Screen
          options={{
            headerShown: true,
            title: 'Dashboard',
            headerRight: () => (
              <TouchableOpacity onPress={onSignOut} style={{ paddingHorizontal: 12, paddingVertical: 6 }} testID="signOutButton">
                <Text style={{ color: colors.accent, fontWeight: '700' }}>Sign Out</Text>
              </TouchableOpacity>
            ),
          }}
        />
        <SafeAreaView style={styles.safeArea} edges={['top']}>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={[styles.scrollContent, { paddingBottom: 32 + insets.bottom }]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.header}>
              <View style={styles.userInfo}>
                <WizardMascot size={60} />
                <View style={styles.userDetails}>
                  <Text style={styles.greeting}>Hello, {user.name}! 👋</Text>
                  <Text style={styles.subtitle}>Ready for some magic math?</Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.settingsButton}
                onPress={() => router.push('/policies')}
                activeOpacity={0.8}
              >
                <Settings size={24} color={colors.text.secondary} />
              </TouchableOpacity>
            </View>

          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <View style={styles.statGradient}>
                <Star size={24} color="#FFFFFF" />
                <Text style={styles.statNumber}>{user.points}</Text>
                <Text style={styles.statLabel}>Points</Text>
              </View>
            </View>

            <View style={styles.statCard}>
              <View style={styles.statGradient}>
                <Trophy size={24} color="#FFFFFF" />
                <Text style={styles.statNumber}>{user.level}</Text>
                <Text style={styles.statLabel}>Level</Text>
              </View>
            </View>

            <View style={styles.statCard}>
              <View style={styles.statGradient}>
                <Zap size={24} color="#FFFFFF" />
                <Text style={styles.statNumber}>{user.streak}</Text>
                <Text style={styles.statLabel}>Streak</Text>
              </View>
            </View>
          </View>

          <View style={styles.progressSection}>
            <Text style={styles.sectionTitle}>Your Progress</Text>
            <View style={styles.progressCard}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressText}>
                  {completedModules} of {totalModules} modules completed
                </Text>
                <Text style={styles.progressPercentage}>
                  {Math.round(progressPercentage * 100)}%
                </Text>
              </View>
              <ProgressBar progress={progressPercentage} height={12} />
            </View>
          </View>

          <View style={styles.modulesSection}>
            <Text style={styles.sectionTitle}>Learning Modules</Text>
            <View style={styles.modulesList}>
              {vedicMathModules.map((module) => {
                const isCompleted = user.completedModules.includes(module.id);
                const isUnlocked = true;
                const progress = getModuleProgress(module.id);

                return (
                  <TouchableOpacity
                    key={module.id}
                    style={[
                      styles.moduleCard,
                      !isUnlocked && styles.moduleCardLocked,
                    ]}
                    onPress={() => handleModulePress(module.id, isUnlocked, module.isPremium)}
                    activeOpacity={isUnlocked ? 0.8 : 1}
                  >
                    <View style={styles.moduleGradient}>
                      <View style={styles.moduleHeader}>
                        <View style={styles.moduleIcon}>
                          <Text style={styles.operationIcon}>
                            {getOperationIcon(module.operation)}
                          </Text>
                        </View>
                        <View style={styles.moduleStatus}>
                          {!isUnlocked ? (
                            <Lock size={20} color="#9CA3AF" />
                          ) : isCompleted ? (
                            <Trophy size={20} color="#FFFFFF" />
                          ) : (
                            <Play size={20} color="#FFFFFF" />
                          )}
                        </View>
                      </View>

                      <Text style={[
                        styles.moduleTitle,
                        !isUnlocked && styles.moduleTextLocked,
                      ]}>
                        {module.title}
                      </Text>
                      
                      <Text style={[
                        styles.moduleDescription,
                        !isUnlocked && styles.moduleTextLocked,
                      ]}>
                        {module.description}
                      </Text>

                      <View style={styles.moduleFooter}>
                        <Text style={[
                          styles.modulePoints,
                          !isUnlocked && styles.moduleTextLocked,
                        ]}>
                          {module.pointsReward} points
                        </Text>
                        {progress && progress.phase !== 'completed' ? (
                          <Text style={[
                            styles.moduleProgress,
                            !isUnlocked && styles.moduleTextLocked,
                          ]}>
                            In Progress
                          </Text>
                        ) : null}
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View style={styles.bottomSpacing} />
        </ScrollView>
      </SafeAreaView>
      </View>
    </AuthGuard>
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
  scrollContent: {
    paddingBottom: 32,
    flexGrow: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flex: 1,
  },
  userDetails: {
    flex: 1,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text.primary,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text.secondary,
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    gap: 12,
    marginBottom: 32,
  },
  statCard: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    backgroundColor: '#1F2937',
  },
  statGradient: {
    padding: 16,
    alignItems: 'center',
    gap: 8,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  statLabel: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  progressSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 16,
  },
  progressCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressText: {
    fontSize: 16,
    color: colors.text.primary,
    fontWeight: '600',
  },
  progressPercentage: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '700',
  },
  modulesSection: {
    paddingHorizontal: 24,
  },
  modulesList: {
    gap: 16,
  },
  moduleCard: {
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    backgroundColor: '#1F2937',
  },
  moduleCardLocked: {
    elevation: 1,
    shadowOpacity: 0.05,
  },
  moduleGradient: {
    padding: 20,
  },
  moduleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  moduleIcon: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  operationIcon: {
    fontSize: 22,
    color: colors.primary,
    fontWeight: '700',
  },
  moduleStatus: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moduleTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  moduleDescription: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
    marginBottom: 16,
    lineHeight: 20,
  },
  moduleFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modulePoints: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  moduleProgress: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.8,
  },
  moduleTextLocked: {
    color: '#9CA3AF',
  },
  bottomSpacing: {
    height: 40,
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 4,
  },
  premiumText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFD700',
  },
  settingsButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
});