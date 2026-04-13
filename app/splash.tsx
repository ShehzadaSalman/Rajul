import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { BodyText, HeroTitle, PrimaryButton, RajulScreen, SectionTitle } from '@/components/rajul-ui';
import { useTheme } from '@/src/context/ThemeContext';

export default function SplashScreen() {
  const router = useRouter();
  const { theme } = useTheme();

  return (
    <RajulScreen scroll={false} contentContainerStyle={styles.content}>
      <View style={[styles.mark, { borderColor: theme.colors.border, backgroundColor: 'rgba(201,168,76,0.08)' }]}>
        <Text style={[styles.markArabic, { color: theme.colors.accent }]}>رجل</Text>
      </View>

      <View style={styles.copy}>
        <SectionTitle>The Muslim man&apos;s companion</SectionTitle>
        <HeroTitle>Build discipline through lesson, action, and reflection.</HeroTitle>
        <BodyText muted>
          Rajul speaks like an older brother who wants you steadier, cleaner, and more reliable before Allah.
        </BodyText>
      </View>

      <View style={[styles.quoteCard, { borderColor: theme.colors.border, backgroundColor: theme.colors.overlay }]}>
        <Text style={[styles.quote, { color: theme.colors.accent }]}>
          &quot;The deen already has a blueprint for who you need to become.&quot;
        </Text>
      </View>

      <PrimaryButton label="Begin onboarding" onPress={() => void router.push('/onboarding/name')} />
    </RajulScreen>
  );
}

const styles = StyleSheet.create({
  content: { justifyContent: 'center', gap: 20 },
  mark: {
    alignSelf: 'center',
    minWidth: 124,
    paddingHorizontal: 22,
    paddingVertical: 18,
    borderRadius: 28,
    borderWidth: 1,
  },
  markArabic: {
    fontSize: 44,
    lineHeight: 52,
    textAlign: 'center',
    fontFamily: 'CormorantGaramond_700Bold',
  },
  copy: { gap: 10, alignItems: 'center' },
  quoteCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 18,
  },
  quote: {
    fontSize: 28,
    lineHeight: 34,
    textAlign: 'center',
    fontFamily: 'CormorantGaramond_700Bold',
    fontStyle: 'italic',
  },
});
