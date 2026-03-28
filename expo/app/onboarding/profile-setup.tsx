import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Alert, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { UserRole } from '@/types/user';
import { colors } from '@/constants/colors';
import { useUser } from '@/hooks/user-store';
import WizardMascot from '@/components/WizardMascot';
import GradientButton from '@/components/GradientButton';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ProfileSetupScreen() {
  const { role } = useLocalSearchParams<{ role: UserRole }>();
  const { createUser } = useUser();
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const insets = useSafeAreaInsets();

  const handleCreateProfile = async () => {
    if (!name.trim()) {
      Alert.alert('Oops!', 'Please enter your name to continue.');
      return;
    }

    setIsLoading(true);
    try {
      await createUser(name.trim(), role);
      router.replace('/dashboard');
    } catch {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleSpecificContent = () => {
    switch (role) {
      case 'kid':
        return {
          title: 'What should we call you?',
          placeholder: 'Enter your name',
          buttonText: 'Start Learning!',
        };
      case 'parent':
        return {
          title: 'What\'s your name?',
          placeholder: 'Enter your name',
          buttonText: 'Create Profile',
        };
      case 'tutor':
        return {
          title: 'What\'s your name?',
          placeholder: 'Enter your name',
          buttonText: 'Create Profile',
        };
      default:
        return {
          title: 'What\'s your name?',
          placeholder: 'Enter your name',
          buttonText: 'Continue',
        };
    }
  };

  const content = getRoleSpecificContent();

  return (
    <LinearGradient
      colors={colors.gradients.navy}
      style={[styles.container, Platform.OS === 'web' ? ({ minHeight: '100vh' } as any) : null]}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={[styles.content, { paddingBottom: 24 + insets.bottom }]}>
          <View style={styles.header}>
            <WizardMascot size={100} />
            <Text style={styles.title}>{content.title}</Text>
            {role === 'kid' && (
              <Text style={styles.subtitle}>
                Choose a cool name for your magical math journey!
              </Text>
            )}
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder={content.placeholder}
                placeholderTextColor={colors.text.light}
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
                autoCorrect={false}
                maxLength={30}
                keyboardAppearance="dark"
              />
            </View>

            <GradientButton
              title={content.buttonText}
              onPress={handleCreateProfile}
              disabled={isLoading || !name.trim()}
              size="large"
              align="center"
              maxWidth={420}
              style={styles.button}
            />
          </View>

          {role === 'kid' && (
            <View style={styles.encouragement}>
              <Text style={styles.encouragementText}>
                🌟 Get ready to become a math wizard! 🌟
              </Text>
            </View>
          )}
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
    paddingTop: 60,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text.primary,
    textAlign: 'center',
    marginTop: 30,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  form: {
    flex: 1,
    justifyContent: 'center',
    gap: 24,
  },
  inputContainer: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  input: {
    fontSize: 18,
    color: '#FFFFFF',
    paddingVertical: 16,
    textAlign: 'center',
  },
  button: {
    marginTop: 16,
  },
  encouragement: {
    alignItems: 'center',
    paddingBottom: 40,
  },
  encouragementText: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
  },
});