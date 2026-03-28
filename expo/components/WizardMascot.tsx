import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '@/constants/colors';

interface WizardMascotProps {
  size?: number;
  animated?: boolean;
}

export default function WizardMascot({ size = 80, animated = false }: WizardMascotProps) {
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {/* Wizard Hat */}
      <View style={[styles.hat, { 
        width: size * 0.8, 
        height: size * 0.6,
        borderBottomWidth: size * 0.05,
      }]} />
      
      {/* Hat Star */}
      <View style={[styles.star, { 
        width: size * 0.15, 
        height: size * 0.15,
        top: size * 0.1,
      }]} />
      
      {/* Face */}
      <View style={[styles.face, { 
        width: size * 0.6, 
        height: size * 0.6,
        top: size * 0.3,
        borderRadius: size * 0.3,
      }]} />
      
      {/* Eyes */}
      <View style={[styles.eye, styles.leftEye, { 
        width: size * 0.08, 
        height: size * 0.08,
        top: size * 0.42,
        left: size * 0.32,
        borderRadius: size * 0.04,
      }]} />
      <View style={[styles.eye, styles.rightEye, { 
        width: size * 0.08, 
        height: size * 0.08,
        top: size * 0.42,
        right: size * 0.32,
        borderRadius: size * 0.04,
      }]} />
      
      {/* Smile */}
      <View style={[styles.smile, { 
        width: size * 0.25, 
        height: size * 0.15,
        top: size * 0.55,
        borderWidth: size * 0.02,
        borderRadius: size * 0.125,
      }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  hat: {
    backgroundColor: colors.wizard.hat,
    borderBottomColor: colors.wizard.robe,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    position: 'absolute',
    top: 0,
  },
  star: {
    backgroundColor: colors.wizard.star,
    borderRadius: 2,
    position: 'absolute',
    transform: [{ rotate: '45deg' }],
  },
  face: {
    backgroundColor: '#FFE4B5',
    position: 'absolute',
  },
  eye: {
    backgroundColor: colors.text.primary,
    position: 'absolute',
  },
  leftEye: {},
  rightEye: {},
  smile: {
    backgroundColor: 'transparent',
    borderColor: colors.text.primary,
    borderTopWidth: 0,
    position: 'absolute',
  },
});