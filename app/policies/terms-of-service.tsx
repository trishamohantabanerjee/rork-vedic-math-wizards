import React from 'react';
import { View, Text, StyleSheet, ScrollView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '@/constants/colors';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TermsOfServiceScreen() {
  const insets = useSafeAreaInsets();
  return (
    <LinearGradient
      colors={colors.gradients.navy as unknown as [string, string]}
      style={[styles.container, Platform.OS === 'web' ? ({ minHeight: '100vh' } as any) : null]}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView 
          style={styles.scrollView} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 24 + insets.bottom }}
        >
          <View style={styles.content}>
            <Text style={styles.lastUpdated}>Last updated: January 2025</Text>
            
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Welcome to Vedic Math Wizards</Text>
              <Text style={styles.paragraph}>
                These Terms of Service govern your use of the Vedic Math Wizards mobile application. By using our app, you agree to these terms. If you disagree with any part of these terms, please do not use our app.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Acceptance of Terms</Text>
              <Text style={styles.paragraph}>
                By downloading, installing, or using Vedic Math Wizards, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service and our Privacy Policy. If you are under 18, your parent or guardian must agree to these terms on your behalf.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Description of Service</Text>
              <Text style={styles.paragraph}>
                Vedic Math Wizards is an educational mobile application designed to teach Vedic mathematics concepts to children aged 6-12 years. Our service includes:{'\n\n'}
                • Interactive learning modules for math operations{'\n'}
                • Progress tracking and performance analytics{'\n'}
                • Gamification features including points and badges{'\n'}
                • Parent and tutor monitoring capabilities{'\n'}
                • Premium content available through in-app purchase
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>User Accounts and Registration</Text>
              <Text style={styles.paragraph}>
                To use our app, you must create an account. You agree to:{'\n\n'}
                • Provide accurate and complete information{'\n'}
                • Maintain the security of your account credentials{'\n'}
                • Notify us immediately of any unauthorized use{'\n'}
                • Accept responsibility for all activities under your account{'\n'}
                • Use the app only for its intended educational purpose
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Age Requirements and Parental Consent</Text>
              <Text style={styles.paragraph}>
                Our app is designed for children under 13. In compliance with COPPA:{'\n\n'}
                • Parental consent is required for account creation{'\n'}
                • Parents have full control over their child&apos;s account{'\n'}
                • Parents can review and delete their child&apos;s data at any time{'\n'}
                • Children cannot share personal information through the app
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Premium Content and Payments</Text>
              <Text style={styles.paragraph}>
                Some features require a one-time premium purchase of ₹100:{'\n\n'}
                • Payment is processed through your device&apos;s app store{'\n'}
                • Premium access is non-transferable and non-refundable{'\n'}
                • Premium features include advanced multiplication and division modules{'\n'}
                • Prices may change with notice, but won&apos;t affect existing purchases
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Acceptable Use Policy</Text>
              <Text style={styles.paragraph}>
                You agree NOT to:{'\n\n'}
                • Use the app for any illegal or unauthorized purpose{'\n'}
                • Attempt to hack, reverse engineer, or modify the app{'\n'}
                • Share account credentials with others{'\n'}
                • Upload harmful or inappropriate content{'\n'}
                • Interfere with the app&apos;s functionality or security{'\n'}
                • Use the app in a way that could harm children
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Intellectual Property Rights</Text>
              <Text style={styles.paragraph}>
                All content in Vedic Math Wizards, including but not limited to:{'\n\n'}
                • Educational content and curriculum{'\n'}
                • Graphics, animations, and visual elements{'\n'}
                • Software code and algorithms{'\n'}
                • Trademarks and branding{'\n\n'}
                Are owned by us or our licensors and are protected by copyright and other intellectual property laws.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Data and Privacy</Text>
              <Text style={styles.paragraph}>
                Your privacy is important to us. Our collection and use of personal information is governed by our Privacy Policy, which is incorporated into these terms by reference. By using our app, you consent to our data practices as described in the Privacy Policy.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Service Availability</Text>
              <Text style={styles.paragraph}>
                We strive to provide continuous service, but we cannot guarantee:{'\n\n'}
                • Uninterrupted access to the app{'\n'}
                • Error-free operation at all times{'\n'}
                • Compatibility with all devices{'\n'}
                • Permanent availability of all features{'\n\n'}
                We reserve the right to modify, suspend, or discontinue any part of our service with reasonable notice.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Limitation of Liability</Text>
              <Text style={styles.paragraph}>
                To the maximum extent permitted by law, Vedic Math Wizards and its developers shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the app, including but not limited to loss of data, educational progress, or device damage.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Educational Disclaimer</Text>
              <Text style={styles.paragraph}>
                While we strive to provide accurate and effective educational content, we make no guarantees about specific learning outcomes. Our app is designed to supplement, not replace, traditional mathematics education. Parents and educators should monitor children&apos;s progress and provide additional support as needed.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Termination</Text>
              <Text style={styles.paragraph}>
                Either party may terminate this agreement at any time:{'\n\n'}
                • You may delete your account and stop using the app{'\n'}
                • We may suspend or terminate accounts that violate these terms{'\n'}
                • Upon termination, your right to use the app ceases immediately{'\n'}
                • Data deletion will be handled according to our Privacy Policy
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Changes to Terms</Text>
              <Text style={styles.paragraph}>
                We may update these Terms of Service from time to time. We will notify users of material changes through the app or via email. Continued use of the app after changes constitutes acceptance of the new terms.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Governing Law</Text>
              <Text style={styles.paragraph}>
                These terms are governed by the laws of India. Any disputes will be resolved in the courts of Mumbai, Maharashtra. If any provision of these terms is found to be unenforceable, the remaining provisions will remain in full force and effect.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Contact Information</Text>
              <Text style={styles.paragraph}>
                If you have questions about these Terms of Service, please contact us at:{'\n\n'}
                Email: support@vedicmathwizards.com{'\n'}
                Phone: +91-800-VEDIC-MATH{'\n'}
                Address: 123 Education Lane, Learning City, Mumbai 400001
              </Text>
            </View>

            <View style={styles.bottomSpacing} />
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
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
  content: {
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  lastUpdated: {
    fontSize: 14,
    color: colors.text.secondary,
    fontStyle: 'italic',
    marginBottom: 24,
    textAlign: 'center',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 16,
  },
  paragraph: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 22,
    textAlign: 'justify',
  },
  bottomSpacing: {
    height: 40,
  },
});