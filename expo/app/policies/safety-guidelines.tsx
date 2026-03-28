import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '@/constants/colors';
import { Shield, Heart, Eye, Clock, Users, AlertTriangle } from 'lucide-react-native';

interface SafetyTip {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const safetyTips: SafetyTip[] = [
  {
    icon: <Clock size={20} color={colors.primary} />,
    title: 'Screen Time Balance',
    description: 'Limit app usage to 30-45 minutes per day for optimal learning without eye strain.',
  },
  {
    icon: <Eye size={20} color={colors.primary} />,
    title: 'Eye Care',
    description: 'Take breaks every 15 minutes. Look at something 20 feet away for 20 seconds.',
  },
  {
    icon: <Users size={20} color={colors.primary} />,
    title: 'Adult Supervision',
    description: 'Young children should use the app with parent or guardian guidance nearby.',
  },
  {
    icon: <Heart size={20} color={colors.primary} />,
    title: 'Positive Environment',
    description: 'Create a comfortable, well-lit learning space free from distractions.',
  },
];

export default function SafetyGuidelinesScreen() {
  return (
    <LinearGradient
      colors={['#F0F9FF', '#E0F2FE']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <Text style={styles.lastUpdated}>Last updated: January 2025</Text>
            
            <View style={styles.heroSection}>
              <Shield size={48} color={colors.primary} />
              <Text style={styles.heroTitle}>Keeping Children Safe</Text>
              <Text style={styles.heroSubtitle}>
                Your child&apos;s safety and well-being are our top priorities. Follow these guidelines for a safe and enjoyable learning experience.
              </Text>
            </View>

            <View style={styles.tipsSection}>
              <Text style={styles.sectionTitle}>Quick Safety Tips</Text>
              {safetyTips.map((tip, index) => (
                <View key={index} style={styles.tipCard}>
                  <View style={styles.tipIcon}>
                    {tip.icon}
                  </View>
                  <View style={styles.tipContent}>
                    <Text style={styles.tipTitle}>{tip.title}</Text>
                    <Text style={styles.tipDescription}>{tip.description}</Text>
                  </View>
                </View>
              ))}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Digital Wellness Guidelines</Text>
              
              <Text style={styles.subsectionTitle}>Recommended Usage</Text>
              <Text style={styles.paragraph}>
                • Ages 6-8: 20-30 minutes per session, maximum 2 sessions per day{'\n'}
                • Ages 9-12: 30-45 minutes per session, maximum 2 sessions per day{'\n'}
                • Always take 10-15 minute breaks between sessions{'\n'}
                • Avoid using the app within 1 hour of bedtime
              </Text>

              <Text style={styles.subsectionTitle}>Physical Comfort</Text>
              <Text style={styles.paragraph}>
                • Ensure proper posture while using the device{'\n'}
                • Use appropriate font sizes for easy reading{'\n'}
                • Maintain arm&apos;s length distance from the screen{'\n'}
                • Use the device in well-lit environments{'\n'}
                • Consider using blue light filters in the evening
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Privacy and Data Safety</Text>
              <Text style={styles.paragraph}>
                We are committed to protecting your child&apos;s privacy:{'\n\n'}
                • No personal information is shared with third parties{'\n'}
                • No direct communication features between children{'\n'}
                • No location tracking or camera access required{'\n'}
                • Parents have full control over account settings{'\n'}
                • All data is encrypted and securely stored{'\n'}
                • Regular security audits ensure data protection
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Content Safety</Text>
              <Text style={styles.paragraph}>
                All content in Vedic Math Wizards is:{'\n\n'}
                • Age-appropriate and educationally focused{'\n'}
                • Reviewed by child development experts{'\n'}
                • Free from violence, inappropriate language, or scary content{'\n'}
                • Designed to build confidence and positive learning attitudes{'\n'}
                • Regularly updated to maintain quality standards
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Parental Controls</Text>
              <Text style={styles.paragraph}>
                Parents and guardians can:{'\n\n'}
                • Monitor their child&apos;s learning progress and time spent{'\n'}
                • Set daily usage limits through device parental controls{'\n'}
                • Review all achievements and completed activities{'\n'}
                • Access detailed progress reports{'\n'}
                • Delete account and data at any time{'\n'}
                • Contact support for any concerns or questions
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Signs to Watch For</Text>
              <Text style={styles.paragraph}>
                Please monitor your child for these signs and take breaks if needed:{'\n\n'}
                • Eye strain, headaches, or vision problems{'\n'}
                • Difficulty sleeping or changes in sleep patterns{'\n'}
                • Decreased interest in offline activities{'\n'}
                • Frustration or anxiety related to app usage{'\n'}
                • Physical discomfort from prolonged device use
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Creating a Safe Learning Environment</Text>
              <Text style={styles.paragraph}>
                Tips for parents and educators:{'\n\n'}
                • Sit with your child during initial app sessions{'\n'}
                • Celebrate achievements and progress together{'\n'}
                • Encourage questions about the math concepts{'\n'}
                • Balance digital learning with hands-on activities{'\n'}
                • Create a dedicated, comfortable learning space{'\n'}
                • Maintain open communication about the learning experience
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Technical Safety</Text>
              <Text style={styles.paragraph}>
                To ensure a safe technical experience:{'\n\n'}
                • Keep the app updated to the latest version{'\n'}
                • Use the app only on trusted, secure devices{'\n'}
                • Ensure stable internet connection for optimal performance{'\n'}
                • Report any technical issues or bugs immediately{'\n'}
                • Use official app stores for downloads and updates
              </Text>
            </View>

            <View style={styles.warningSection}>
              <View style={styles.warningHeader}>
                <AlertTriangle size={24} color={colors.warning} />
                <Text style={styles.warningTitle}>Important Reminders</Text>
              </View>
              <Text style={styles.warningText}>
                • This app is not a substitute for professional educational assessment{'\n'}
                • If your child has learning difficulties, consult with educators{'\n'}
                • Contact us immediately if you notice any inappropriate content{'\n'}
                • Report technical issues that could affect child safety
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Emergency Contact</Text>
              <Text style={styles.paragraph}>
                If you have immediate safety concerns or need to report inappropriate content:{'\n\n'}
                Emergency Email: safety@vedicmathwizards.com{'\n'}
                Support Phone: +91-800-SAFETY-FIRST{'\n'}
                Response Time: Within 24 hours for safety issues{'\n\n'}
                For general support:{'\n'}
                Email: support@vedicmathwizards.com{'\n'}
                Phone: +91-800-VEDIC-MATH
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
  heroSection: {
    alignItems: 'center',
    paddingVertical: 32,
    marginBottom: 24,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text.primary,
    marginTop: 16,
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  tipsSection: {
    marginBottom: 32,
  },
  tipCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  tipIcon: {
    width: 40,
    height: 40,
    backgroundColor: colors.background,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 4,
  },
  tipDescription: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
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
  warningSection: {
    backgroundColor: '#FFF7ED',
    borderRadius: 12,
    padding: 20,
    marginBottom: 32,
    borderLeftWidth: 4,
    borderLeftColor: colors.warning,
  },
  warningHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  warningTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.warning,
    marginLeft: 12,
  },
  warningText: {
    fontSize: 14,
    color: '#92400E',
    lineHeight: 20,
  },
  bottomSpacing: {
    height: 40,
  },
});