import { Redirect } from 'expo-router';

import { useAuth } from '@/providers/auth-provider';

export default function Index() {
  const { loading, onboardingCompleted } = useAuth();

  if (loading) {
    return null;
  }

  if (!onboardingCompleted) {
    return <Redirect href="/splash" />;
  }

  return <Redirect href="/(tabs)" />;
}
