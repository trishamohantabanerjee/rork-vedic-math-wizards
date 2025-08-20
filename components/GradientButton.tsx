import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '@/constants/colors';

type TwoOrMore<T> = readonly [T, T, ...T[]];

interface GradientButtonProps {
  title: string;
  onPress: () => void;
  gradient?: TwoOrMore<string>;
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
  align?: 'stretch' | 'center' | 'left' | 'right';
  maxWidth?: number;
  testID?: string;
}

export default function GradientButton({
  title,
  onPress,
  gradient = colors.gradients.primary,
  style,
  textStyle,
  disabled = false,
  size = 'medium',
  align = 'stretch',
  maxWidth,
  testID,
}: GradientButtonProps) {
  const buttonSize = size === 'small' ? styles.small : size === 'large' ? styles.large : styles.medium;
  const textSize = size === 'small' ? styles.smallText : size === 'large' ? styles.largeText : styles.mediumText;

  const alignmentStyle =
    align === 'center'
      ? styles.alignCenter
      : align === 'left'
      ? styles.alignLeft
      : align === 'right'
      ? styles.alignRight
      : styles.alignStretch;

  const widthStyle = maxWidth ? { maxWidth } : undefined;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[styles.container, alignmentStyle, widthStyle, buttonSize, style, disabled && styles.disabled]}
      activeOpacity={0.8}
      testID={testID}
    >
      <LinearGradient
        colors={disabled ? (['#D1D5DB', '#9CA3AF'] as TwoOrMore<string>) : gradient}
        style={[styles.gradient, buttonSize]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={[styles.text, textSize, textStyle, disabled && styles.disabledText]} accessibilityRole="button" accessibilityState={{ disabled }}>
          {title}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 25,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  alignStretch: {
    alignSelf: 'stretch',
    width: '100%',
    maxWidth: 480,
  },
  alignCenter: {
    alignSelf: 'center',
    width: '100%',
    maxWidth: 480,
  },
  alignLeft: {
    alignSelf: 'flex-start',
    width: '100%',
    maxWidth: 480,
  },
  alignRight: {
    alignSelf: 'flex-end',
    width: '100%',
    maxWidth: 480,
  },
  gradient: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
    width: '100%',
  },
  small: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: 36,
  },
  medium: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    minHeight: 48,
  },
  large: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    minHeight: 56,
  },
  text: {
    color: '#FFFFFF',
    fontWeight: '700',
    textAlign: 'center',
  },
  smallText: {
    fontSize: 14,
  },
  mediumText: {
    fontSize: 16,
  },
  largeText: {
    fontSize: 18,
  },
  disabled: {
    opacity: 0.6,
  },
  disabledText: {
    color: '#9CA3AF',
  },
});