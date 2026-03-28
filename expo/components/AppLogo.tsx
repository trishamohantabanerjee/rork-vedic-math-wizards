import React, { useMemo } from 'react';
import { Dimensions, Image, ImageStyle, Platform, StyleSheet, View, ViewStyle } from 'react-native';

interface AppLogoProps {
  size?: number;
  style?: ViewStyle;
  testID?: string;
}

const LOGO_URI = 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/k40eny8utgum79wr3nfoq';

export default function AppLogo({ size, style, testID }: AppLogoProps) {
  const responsive = useMemo(() => {
    const screen = Dimensions.get('window');
    const minSize = 140;
    const maxSize = 280;
    const base = Math.round(screen.width * 0.45);
    const computed = Math.min(Math.max(base, minSize), maxSize);
    return size ?? computed;
  }, [size]);

  return (
    <View style={[styles.container, style]} testID={testID ?? 'app-logo'}>
      <Image
        source={{ uri: LOGO_URI }}
        style={{ width: responsive, height: responsive, aspectRatio: 1 } as ImageStyle}
        resizeMode={Platform.OS === 'web' ? ('contain' as any) : 'contain'}
        accessibilityLabel="App Logo"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});