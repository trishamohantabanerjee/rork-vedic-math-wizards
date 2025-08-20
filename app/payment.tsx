import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { colors } from '@/constants/colors';
import { useUser } from '@/hooks/user-store';
import { PREMIUM_PRICE } from '@/constants/modules';
import WizardMascot from '@/components/WizardMascot';
import GradientButton from '@/components/GradientButton';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { Crown, Star, Zap, CheckCircle, ArrowLeft } from 'lucide-react-native';

export default function PaymentScreen() {
  const { user, purchasePremium } = useUser();
  const [isProcessing, setIsProcessing] = useState(false);
  const insets = useSafeAreaInsets();

  if (!user) {
    router.replace('/onboarding/role-selection');
    return null;
  }

  const handlePurchase = async () => {
    setIsProcessing(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const success = await purchasePremium();
      
      if (success) {
        Alert.alert(
          '🎉 Purchase Successful!',
          'You now have access to all premium modules! Happy learning!',
          [
            {
              text: 'Start Learning',
              onPress: () => router.replace('/dashboard'),
            },
          ]
        );
      } else {
        Alert.alert('Error', 'Something went wrong. Please try again.');
      }
    } catch {
      Alert.alert('Error', 'Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const features = [
    {
      icon: <Zap size={24} color={colors.primary} />,
      title: 'Cross Multiplication',
      description: 'Master the Urdhva-Tiryagbhyam method for lightning-fast multiplication!',
    },
    {
      icon: <Star size={24} color={colors.primary} />,
      title: 'Magic Division',
      description: 'Learn the Paravartya Yojayet method for effortless division!',
    },
    {
      icon: <CheckCircle size={24} color={colors.primary} />,
      title: 'Lifetime Access',
      description: 'One-time payment for permanent access to all premium content!',
    },
  ];

  return (
    <LinearGradient
      colors={['#F0F9FF', '#E0F2FE']}
      style={[styles.container, Platform.OS === 'web' ? ({ minHeight: '100vh' } as any) : null]}
    >
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={[styles.header, { paddingTop: 20 + insets.top }]}> 
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color={colors.text.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Unlock Premium</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={[styles.content, { paddingBottom: 24 + insets.bottom }]}>
          {/* Premium Badge */}
          <View style={styles.premiumBadge}>
            <LinearGradient
              colors={colors.gradients.warm as any}
              style={styles.badgeGradient}
            >
              <Crown size={32} color="#FFFFFF" />
              <Text style={styles.badgeText}>PREMIUM</Text>
            </LinearGradient>
          </View>

          {/* Mascot */}
          <View style={styles.mascotContainer}>
            <WizardMascot size={120} />
            <Text style={styles.mascotText}>
              Unlock the full power of Vedic Math! 🚀
            </Text>
          </View>

          {/* Features */}
          <View style={styles.featuresContainer}>
            <Text style={styles.featuresTitle}>What you&apos;ll get:</Text>
            {features.map((feature, index) => (
              <View key={index} style={styles.featureItem}>
                <View style={styles.featureIcon}>
                  {feature.icon}
                </View>
                <View style={styles.featureContent}>
                  <Text style={styles.featureTitle}>{feature.title}</Text>
                  <Text style={styles.featureDescription}>{feature.description}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Price */}
          <View style={styles.priceContainer}>
            <Text style={styles.priceLabel}>One-time payment</Text>
            <Text style={styles.price}>₹{PREMIUM_PRICE}</Text>
            <Text style={styles.priceSubtext}>Lifetime access • No subscriptions</Text>
          </View>

          {/* Purchase Button */}
          <GradientButton
            title={isProcessing ? 'Processing...' : `Unlock for ₹${PREMIUM_PRICE}`}
            onPress={handlePurchase}
            disabled={isProcessing}
            size="large"
            align="center"
            maxWidth={480}
            style={styles.purchaseButton}
          />

          <Text style={styles.disclaimer}>
            * This is a demo app. No actual payment will be processed.
          </Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
  },
  backButton: {
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
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text.primary,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  premiumBadge: {
    alignSelf: 'center',
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 24,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  badgeGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
  },
  badgeText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  mascotContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  mascotText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    textAlign: 'center',
    marginTop: 16,
  },
  featuresContainer: {
    marginBottom: 32,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  priceContainer: {
    alignItems: 'center',
    marginBottom: 24,
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  priceLabel: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 8,
  },
  price: {
    fontSize: 36,
    fontWeight: '800',
    color: colors.primary,
    marginBottom: 4,
  },
  priceSubtext: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  purchaseButton: {
    marginBottom: 16,
  },
  disclaimer: {
    fontSize: 12,
    color: colors.text.secondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});