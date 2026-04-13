import { useRouter } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import Reanimated, { FadeInRight } from 'react-native-reanimated';

import { BodyText, Card, FormField, HeroTitle, PrimaryButton, RajulScreen, SectionTitle, StepDots } from '@/components/rajul-ui';
import { useAuth } from '@/providers/auth-provider';

export default function NameOnboardingScreen() {
  const router = useRouter();
  const { onboardingDraft, updateOnboardingDraft } = useAuth();
  const [touched, setTouched] = useState(false);

  const error =
    touched && onboardingDraft.displayName.trim().length < 2 ? 'Enter at least 2 characters.' : undefined;

  return (
    <RajulScreen contentContainerStyle={styles.content}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.keyboard}>
        <Reanimated.View entering={FadeInRight.duration(240)} style={styles.wrapper}>
          <StepDots total={3} active={0} />
          <View style={styles.copy}>
            <SectionTitle>Step 1 of 3</SectionTitle>
            <HeroTitle>What should Rajul call you?</HeroTitle>
            <BodyText muted>
              Keep it simple. This name will be used in your daily lesson, reflections, and milestone screens.
            </BodyText>
          </View>

          <Card dark>
            <FormField
              autoFocus
              autoCapitalize="words"
              label="Your name"
              value={onboardingDraft.displayName}
              onBlur={() => setTouched(true)}
              onChangeText={(displayName) => updateOnboardingDraft({ displayName })}
              placeholder="Abdullah"
              error={error}
            />
          </Card>

          <Card outlined>
            <BodyText muted>
              Rajul is direct on purpose. This app is not here to flatter you. It is here to help you grow into a steadier man.
            </BodyText>
          </Card>

          <PrimaryButton
            label="Continue"
            disabled={onboardingDraft.displayName.trim().length < 2}
            onPress={() => {
              setTouched(true);
              if (onboardingDraft.displayName.trim().length < 2) {
                return;
              }

              router.push('/onboarding/reminder');
            }}
          />
        </Reanimated.View>
      </KeyboardAvoidingView>
    </RajulScreen>
  );
}

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
  },
  keyboard: {
    flex: 1,
  },
  wrapper: {
    gap: 18,
  },
  copy: {
    gap: 8,
  },
});
