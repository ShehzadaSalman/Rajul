import { StyleSheet, Text, View } from 'react-native';

import {
  BodyText,
  Card,
  IconButton,
  PrimaryButton,
  RajulScreen,
  SectionTitle,
  TopBar,
} from '@/components/rajul-ui';
import { rajulColors } from '@/constants/rajul';

const proFeatures = [
  'Full lesson library across all four pillars',
  'Unlimited reflection history and deeper prompts',
  'Sahabah deep-dive stories and structured action paths',
  'Custom reminder times and offline reading',
  'One-time unlock with no subscriptions or upsells',
];

export default function PaywallScreen() {
  return (
    <RajulScreen contentContainerStyle={styles.content}>
      <TopBar title="Rajul Pro" right={<IconButton icon="close" href="/(tabs)/library" />} />

      <View style={styles.hero}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>رجل</Text>
        </View>
        <SectionTitle>Pay once, own forever</SectionTitle>
        <Text style={styles.heading}>Simple. Halal. No subscription guilt.</Text>
        <BodyText muted>
          The free app remains useful. Pro only unlocks more structure, more depth, and more
          history.
        </BodyText>
      </View>

      <View style={styles.featureList}>
        {proFeatures.map((feature) => (
          <View key={feature} style={styles.featureRow}>
            <View style={styles.bullet} />
            <BodyText muted>{feature}</BodyText>
          </View>
        ))}
      </View>

      <Card dark style={styles.priceCard}>
        <SectionTitle>Rajul Pro</SectionTitle>
        <Text style={styles.price}>$9</Text>
        <Text style={styles.priceNote}>One-time unlock</Text>
      </Card>

      <PrimaryButton label="Unlock for $9" />
      <BodyText muted>Restore purchase</BodyText>
    </RajulScreen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 18,
  },
  hero: {
    alignItems: 'center',
    gap: 10,
  },
  badge: {
    minWidth: 90,
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: rajulColors.borderStrong,
    backgroundColor: 'rgba(201, 168, 76, 0.08)',
  },
  badgeText: {
    color: rajulColors.accent,
    fontSize: 34,
    lineHeight: 40,
    textAlign: 'center',
    fontFamily: 'serif',
  },
  heading: {
    color: rajulColors.text,
    fontSize: 30,
    lineHeight: 38,
    textAlign: 'center',
    fontFamily: 'serif',
  },
  featureList: {
    gap: 12,
  },
  featureRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  bullet: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: rajulColors.accent,
  },
  priceCard: {
    alignItems: 'center',
    gap: 8,
  },
  price: {
    color: rajulColors.accent,
    fontSize: 48,
    lineHeight: 52,
    fontFamily: 'serif',
  },
  priceNote: {
    color: rajulColors.textMuted,
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
});
