import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '@/constants/colors';

interface ProgressBarProps {
  progress: number; // 0 to 1
  height?: number;
  gradient?: readonly string[];
  backgroundColor?: string;
  animated?: boolean;
  style?: any;
}

export default function ProgressBar({
  progress,
  height = 8,
  gradient = colors.gradients.success,
  backgroundColor = 'rgba(255,255,255,0.12)',
  animated = true,
  style,
}: ProgressBarProps) {
  const animatedWidth = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (animated) {
      Animated.timing(animatedWidth, {
        toValue: progress,
        duration: 500,
        useNativeDriver: false,
      }).start();
    } else {
      animatedWidth.setValue(progress);
    }
  }, [progress, animated, animatedWidth]);

  return (
    <View style={[styles.container, { height, backgroundColor }, style]}>
      <Animated.View
        style={[
          styles.progressContainer,
          {
            width: animatedWidth.interpolate({
              inputRange: [0, 1],
              outputRange: ['0%', '100%'],
            }),
          },
        ]}
      >
        <LinearGradient
          colors={gradient as any}
          style={[styles.progress, { height }]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    overflow: 'hidden',
  },
  progressContainer: {
    height: '100%',
  },
  progress: {
    borderRadius: 10,
  },
});