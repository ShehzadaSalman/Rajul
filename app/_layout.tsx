import { CormorantGaramond_700Bold, useFonts as useCormorantFonts } from '@expo-google-fonts/cormorant-garamond';
import { DMSans_400Regular, DMSans_500Medium, DMSans_700Bold, useFonts as useDMSansFonts } from '@expo-google-fonts/dm-sans';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, View } from 'react-native';
import 'react-native-reanimated';

import { RajulScreen } from '@/components/rajul-ui';
import { AuthProvider, useAuth } from '@/providers/auth-provider';
import { RajulThemeProvider, useTheme } from '@/src/context/ThemeContext';

export const unstable_settings = {
  anchor: '(tabs)',
};

function RootNavigator() {
  const { loading } = useAuth();
  const { theme } = useTheme();

  if (loading) {
    return (
      <RajulScreen scroll={false} contentContainerStyle={{ justifyContent: 'center' }}>
        <View style={{ alignItems: 'center', gap: 16 }}>
          <ActivityIndicator color={theme.colors.accent} size="large" />
        </View>
      </RajulScreen>
    );
  }

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="splash" options={{ headerShown: false }} />
      <Stack.Screen name="onboarding/name" options={{ headerShown: false }} />
      <Stack.Screen name="onboarding/reminder" options={{ headerShown: false }} />
      <Stack.Screen name="onboarding/focus" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="lesson" options={{ headerShown: false }} />
      <Stack.Screen name="action" options={{ headerShown: false }} />
      <Stack.Screen name="pillar/[slug]" options={{ headerShown: false }} />
      <Stack.Screen name="journal-history" options={{ headerShown: false }} />
      <Stack.Screen name="journal/[entry]" options={{ headerShown: false }} />
      <Stack.Screen name="paywall" options={{ headerShown: false, presentation: 'modal' }} />
      <Stack.Screen name="settings" options={{ headerShown: false }} />
      <Stack.Screen name="day-complete" options={{ headerShown: false }} />
      <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
    </Stack>
  );
}

function AppShell() {
  const { mode } = useTheme();

  return (
    <ThemeProvider value={mode === 'dark' ? DarkTheme : DefaultTheme}>
      <AuthProvider>
        <RootNavigator />
      </AuthProvider>
      <StatusBar style={mode === 'dark' ? 'light' : 'dark'} />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  const [cormorantLoaded] = useCormorantFonts({ CormorantGaramond_700Bold });
  const [dmSansLoaded] = useDMSansFonts({
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_700Bold,
  });

  if (!cormorantLoaded || !dmSansLoaded) {
    return null;
  }

  return (
    <RajulThemeProvider>
      <AppShell />
    </RajulThemeProvider>
  );
}
