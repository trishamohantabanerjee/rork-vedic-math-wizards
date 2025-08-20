import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '@/constants/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function PrivacyPolicyScreen() {
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
              <Text style={styles.sectionTitle}>Introduction</Text>
              <Text style={styles.paragraph}>
                Welcome to Vedic Math Wizards! We are committed to protecting the privacy and safety of our young users and their families. This Privacy Policy explains how we collect, use, and safeguard information when you use our educational app designed for children aged 6-12 years.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Information We Collect</Text>
              
              <Text style={styles.subsectionTitle}>Account Information</Text>
              <Text style={styles.paragraph}>
                • Child's first name and age (for personalization){'\n'}
                • Parent/guardian email address (for account management){'\n'}
                • User role (student, parent, or tutor){'\n'}
                • Avatar selection and preferences
              </Text>

              <Text style={styles.subsectionTitle}>Learning Progress Data</Text>
              <Text style={styles.paragraph}>
                • Module completion status{'\n'}
                • Quiz scores and performance metrics{'\n'}
                • Time spent on activities{'\n'}
                • Learning streaks and achievements{'\n'}
                • Points and level progression
              </Text>

              <Text style={styles.subsectionTitle}>Device Information</Text>
              <Text style={styles.paragraph}>
                • Device type and operating system{'\n'}
                • App version and usage analytics{'\n'}
                • Crash reports and error logs (anonymized)
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>How We Use Information</Text>
              <Text style={styles.paragraph}>
                We use the collected information to:{'\n\n'}
                • Provide personalized learning experiences{'\n'}
                • Track educational progress and achievements{'\n'}
                • Enable parent/tutor monitoring features{'\n'}
                • Improve app functionality and content{'\n'}
                • Send important updates about the app{'\n'}
                • Provide customer support when needed
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Information Sharing</Text>
              <Text style={styles.paragraph}>
                We do NOT sell, trade, or share personal information with third parties for marketing purposes. We may share information only in these limited circumstances:{'\n\n'}
                • With parents/guardians (progress reports and account management){'\n'}
                • With assigned tutors (student progress only){'\n'}
                • With service providers who help operate our app (under strict confidentiality agreements){'\n'}
                • When required by law or to protect safety
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Data Security</Text>
              <Text style={styles.paragraph}>
                We implement industry-standard security measures to protect your information:{'\n\n'}
                • Encrypted data transmission and storage{'\n'}
                • Regular security audits and updates{'\n'}
                • Limited access to personal information{'\n'}
                • Secure servers with backup systems{'\n'}
                • No storage of sensitive payment information
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Children's Privacy (COPPA Compliance)</Text>
              <Text style={styles.paragraph}>
                Our app is designed for children under 13, and we comply with the Children's Online Privacy Protection Act (COPPA):{'\n\n'}
                • We collect minimal information necessary for the educational experience{'\n'}
                • Parental consent is required for account creation{'\n'}
                • Parents can review, modify, or delete their child's information{'\n'}
                • We do not enable direct communication between children{'\n'}
                • No behavioral advertising is targeted at children
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Data Retention</Text>
              <Text style={styles.paragraph}>
                • Account information is retained while the account is active{'\n'}
                • Learning progress data is kept to maintain educational continuity{'\n'}
                • Inactive accounts may be deleted after 2 years of inactivity{'\n'}
                • Parents can request immediate deletion of their child's data
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Your Rights</Text>
              <Text style={styles.paragraph}>
                Parents and guardians have the right to:{'\n\n'}
                • Access their child's personal information{'\n'}
                • Correct inaccurate information{'\n'}
                • Delete their child's account and data{'\n'}
                • Restrict certain data processing{'\n'}
                • Export learning progress data{'\n'}
                • Withdraw consent at any time
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>International Users</Text>
              <Text style={styles.paragraph}>
                If you are using our app from outside your country, please note that your information may be transferred to and processed in countries where our servers are located. We ensure appropriate safeguards are in place for international data transfers.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Changes to This Policy</Text>
              <Text style={styles.paragraph}>
                We may update this Privacy Policy from time to time. We will notify parents of any material changes via email or through the app. Continued use of the app after changes indicates acceptance of the updated policy.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Contact Us</Text>
              <Text style={styles.paragraph}>
                If you have questions about this Privacy Policy or your child's data, please contact us at:{'\n\n'}
                Email: privacy@vedicmathwizards.com{'\n'}
                Phone: +1-800-VEDIC-MATH{'\n'}
                Address: 123 Education Lane, Learning City, LC 12345
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
  subsectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 8,
    marginTop: 16,
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