import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { UserProvider } from "@/hooks/user-store";
import ErrorBoundary from "@/components/ErrorBoundary";
import { colors } from "@/constants/colors";
import { useFonts, IBMPlexSans_400Regular, IBMPlexSans_600SemiBold, IBMPlexSans_700Bold } from "@expo-google-fonts/ibm-plex-sans";
import { Text } from "react-native";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.text.primary,
        headerTitleStyle: { color: colors.text.primary },
      }}
    >
      <Stack.Screen name="onboarding/role-selection" />
      <Stack.Screen name="onboarding/profile-setup" />
      <Stack.Screen name="dashboard" />
      <Stack.Screen name="module/[id]" />
      <Stack.Screen name="parent/index" options={{ title: "Parent Home", headerShown: true }} />
      <Stack.Screen name="kid/[id]/index" options={{ title: "Kid Detail", headerShown: true }} />
      <Stack.Screen name="invite/index" options={{ title: "Enter Invite Code", headerShown: true }} />
      <Stack.Screen name="invite/manage" options={{ title: "Manage Invites", headerShown: true }} />
      <Stack.Screen name="policies/privacy-policy" options={{ title: "Privacy Policy", headerShown: true }} />
      <Stack.Screen name="policies/terms-of-service" options={{ title: "Terms of Service", headerShown: true }} />
      <Stack.Screen name="policies/safety-guidelines" options={{ title: "Safety Guidelines", headerShown: true }} />
      <Stack.Screen name="policies/index" options={{ title: "Policies", headerShown: true }} />
      <Stack.Screen name="auth/login" options={{ title: "Sign In", headerShown: true }} />
      <Stack.Screen name="auth/callback" options={{ title: "Authenticating...", headerShown: true }} />
    </Stack>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    IBMPlexSans_400Regular,
    IBMPlexSans_600SemiBold,
    IBMPlexSans_700Bold,
  });
  const [splashHidden, setSplashHidden] = useState<boolean>(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout | null = setTimeout(() => {
      if (!splashHidden) {
        console.log('[layout] fonts taking long, hiding splash as fallback');
        SplashScreen.hideAsync();
        setSplashHidden(true);
      }
    }, 4000);

    return () => { if (timeout) clearTimeout(timeout); };
  }, [splashHidden]);

  useEffect(() => {
    if (fontsLoaded && !splashHidden) {
      (Text as any).defaultProps = (Text as any).defaultProps || {};
      (Text as any).defaultProps.style = [
        (Text as any).defaultProps.style,
        { fontFamily: "IBMPlexSans_400Regular", color: colors.text.primary },
      ];
      SplashScreen.hideAsync();
      setSplashHidden(true);
    }
  }, [fontsLoaded, splashHidden]);

  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.background }}>
          <ErrorBoundary>
            <RootLayoutNav />
          </ErrorBoundary>
        </GestureHandlerRootView>
      </UserProvider>
    </QueryClientProvider>
  );
}