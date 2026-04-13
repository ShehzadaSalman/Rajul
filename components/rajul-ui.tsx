import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Link } from 'expo-router';
import { PropsWithChildren, ReactElement, ReactNode } from 'react';
import {
  ActivityIndicator,
  Pressable,
  RefreshControlProps,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  TextProps,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '@/src/context/ThemeContext';

const headingFont = 'CormorantGaramond_700Bold';
const bodyFont = 'DMSans_400Regular';
const mediumFont = 'DMSans_500Medium';
const boldFont = 'DMSans_700Bold';

type ButtonProps = {
  label: string;
  href?: string;
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
};

function useRajulStyles() {
  const { theme } = useTheme();
  const { colors } = theme;

  return StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },
    backgroundOrnamentTop: {
      position: 'absolute',
      top: -120,
      right: -90,
      width: 280,
      height: 280,
      borderRadius: 140,
      backgroundColor: 'rgba(201,168,76,0.08)',
    },
    backgroundOrnamentBottom: {
      position: 'absolute',
      bottom: -140,
      left: -100,
      width: 280,
      height: 280,
      borderRadius: 140,
      backgroundColor: colors.overlay,
    },
    scrollContent: {
      paddingHorizontal: 20,
      paddingTop: 14,
      paddingBottom: 36,
      gap: 16,
    },
    topBar: {
      flexDirection: 'row',
      alignItems: 'center',
      minHeight: 44,
      gap: 12,
    },
    edge: {
      minWidth: 40,
    },
    edgeRight: {
      alignItems: 'flex-end',
    },
    topBarCopy: {
      flex: 1,
      alignItems: 'center',
      gap: 2,
    },
    topBarSubtitle: {
      color: colors.muted,
      fontSize: 11,
      lineHeight: 14,
      fontFamily: mediumFont,
      letterSpacing: 1.6,
      textTransform: 'uppercase',
    },
    topBarTitle: {
      color: colors.text,
      fontSize: 24,
      lineHeight: 30,
      fontFamily: headingFont,
    },
    iconButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.overlay,
    },
    primaryButton: {
      minHeight: 54,
      borderRadius: 20,
      backgroundColor: colors.accent,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 20,
    },
    primaryButtonText: {
      color: colors.background,
      fontSize: 14,
      lineHeight: 18,
      fontFamily: boldFont,
      letterSpacing: 0.4,
    },
    secondaryButton: {
      minHeight: 54,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 20,
      backgroundColor: colors.overlay,
    },
    secondaryButtonText: {
      color: colors.text,
      fontSize: 14,
      lineHeight: 18,
      fontFamily: mediumFont,
    },
    buttonDisabled: {
      opacity: 0.5,
    },
    sectionTitle: {
      color: colors.muted,
      fontSize: 11,
      lineHeight: 14,
      fontFamily: boldFont,
      letterSpacing: 1.8,
      textTransform: 'uppercase',
    },
    heroTitle: {
      color: colors.text,
      fontSize: 38,
      lineHeight: 42,
      fontFamily: headingFont,
    },
    bodyText: {
      color: colors.text,
      fontSize: 15,
      lineHeight: 24,
      fontFamily: bodyFont,
    },
    bodyMuted: {
      color: colors.muted,
    },
    tag: {
      alignSelf: 'flex-start',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 8,
      backgroundColor: 'rgba(201,168,76,0.12)',
      borderWidth: 1,
      borderColor: colors.border,
    },
    tagOutline: {
      backgroundColor: 'transparent',
    },
    tagText: {
      color: colors.text,
      fontSize: 11,
      lineHeight: 14,
      fontFamily: mediumFont,
      textTransform: 'uppercase',
      letterSpacing: 1.2,
    },
    card: {
      borderRadius: 14,
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 16,
      gap: 12,
    },
    cardDark: {
      backgroundColor: colors.card,
      borderColor: colors.border,
    },
    cardOutlined: {
      backgroundColor: 'transparent',
    },
    progressTrack: {
      height: 6,
      borderRadius: 999,
      backgroundColor: colors.overlay,
      overflow: 'hidden',
    },
    progressFill: {
      height: '100%',
      borderRadius: 999,
      backgroundColor: colors.accent,
    },
    streakRow: {
      flexDirection: 'row',
      gap: 8,
    },
    streakDot: {
      width: 32,
      height: 32,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.overlay,
    },
    streakDone: {
      backgroundColor: colors.accent,
    },
    streakToday: {
      borderColor: colors.accent,
    },
    streakText: {
      color: colors.muted,
      fontSize: 11,
      lineHeight: 14,
      fontFamily: mediumFont,
    },
    streakTextActive: {
      color: colors.background,
    },
    linkRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      paddingVertical: 10,
    },
    linkCopy: {
      flex: 1,
      gap: 4,
    },
    linkTitle: {
      color: colors.text,
      fontSize: 15,
      lineHeight: 20,
      fontFamily: mediumFont,
    },
    linkSubtitle: {
      color: colors.muted,
      fontSize: 13,
      lineHeight: 18,
      fontFamily: bodyFont,
    },
    moodRow: {
      flexDirection: 'row',
      gap: 8,
    },
    moodBubble: {
      flex: 1,
      minHeight: 54,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.overlay,
      alignItems: 'center',
      justifyContent: 'center',
    },
    moodBubbleActive: {
      borderColor: colors.accent,
      backgroundColor: 'rgba(201,168,76,0.12)',
    },
    moodText: {
      fontSize: 22,
    },
    fieldShell: {
      gap: 8,
    },
    fieldLabel: {
      color: colors.muted,
      fontSize: 11,
      lineHeight: 14,
      fontFamily: boldFont,
      textTransform: 'uppercase',
      letterSpacing: 1.6,
    },
    fieldWrap: {
      minHeight: 54,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.overlay,
      paddingHorizontal: 14,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    fieldWrapError: {
      borderColor: colors.danger,
    },
    fieldInput: {
      flex: 1,
      color: colors.text,
      fontSize: 16,
      lineHeight: 22,
      fontFamily: bodyFont,
      paddingVertical: 14,
    },
    helperText: {
      color: colors.muted,
      fontSize: 12,
      lineHeight: 18,
      fontFamily: bodyFont,
    },
    errorText: {
      color: colors.danger,
    },
    stepDots: {
      flexDirection: 'row',
      gap: 8,
    },
    stepDot: {
      width: 10,
      height: 10,
      borderRadius: 999,
      backgroundColor: colors.overlay,
      borderWidth: 1,
      borderColor: colors.border,
    },
    stepDotActive: {
      width: 24,
      backgroundColor: colors.accent,
      borderColor: colors.accent,
    },
  });
}

export function RajulScreen({
  children,
  scroll = true,
  contentContainerStyle,
  refreshControl,
}: PropsWithChildren<{
  scroll?: boolean;
  contentContainerStyle?: StyleProp<ViewStyle>;
  refreshControl?: ReactElement<RefreshControlProps> | null;
}>) {
  const styles = useRajulStyles();
  const body = scroll ? (
    <ScrollView
      contentContainerStyle={[styles.scrollContent, contentContainerStyle]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      refreshControl={refreshControl ?? undefined}>
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.scrollContent, contentContainerStyle]}>{children}</View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View pointerEvents="none" style={styles.backgroundOrnamentTop} />
      <View pointerEvents="none" style={styles.backgroundOrnamentBottom} />
      {body}
    </SafeAreaView>
  );
}

export function TopBar({
  title,
  subtitle,
  left,
  right,
}: {
  title?: string;
  subtitle?: string;
  left?: ReactNode;
  right?: ReactNode;
}) {
  const styles = useRajulStyles();

  return (
    <View style={styles.topBar}>
      <View style={styles.edge}>{left}</View>
      <View style={styles.topBarCopy}>
        {subtitle ? <Text style={styles.topBarSubtitle}>{subtitle}</Text> : null}
        {title ? <Text style={styles.topBarTitle}>{title}</Text> : null}
      </View>
      <View style={[styles.edge, styles.edgeRight]}>{right}</View>
    </View>
  );
}

export function IconButton({
  icon,
  href,
  onPress,
}: {
  icon: keyof typeof MaterialIcons.glyphMap;
  href?: string;
  onPress?: () => void;
}) {
  const styles = useRajulStyles();
  const { theme } = useTheme();
  const content = (
    <Pressable onPress={onPress} style={styles.iconButton}>
      <MaterialIcons name={icon} size={18} color={theme.colors.text} />
    </Pressable>
  );

  if (href) {
    return (
      <Link href={href as never} asChild>
        {content}
      </Link>
    );
  }

  return content;
}

function LinkableButton({ href, content }: { href?: string; content: ReactNode }) {
  if (!href) {
    return <>{content}</>;
  }

  return (
    <Link href={href as never} asChild>
      {content}
    </Link>
  );
}

export function PrimaryButton({ label, href, onPress, disabled, loading }: ButtonProps) {
  const styles = useRajulStyles();
  const { theme } = useTheme();
  return (
    <LinkableButton
      href={href}
      content={
        <Pressable
          disabled={disabled || loading}
          onPress={onPress}
          style={[styles.primaryButton, (disabled || loading) && styles.buttonDisabled]}>
          {loading ? (
            <ActivityIndicator color={theme.colors.background} />
          ) : (
            <Text style={styles.primaryButtonText}>{label}</Text>
          )}
        </Pressable>
      }
    />
  );
}

export function SecondaryButton({ label, href, onPress, disabled, loading }: ButtonProps) {
  const styles = useRajulStyles();
  const { theme } = useTheme();
  return (
    <LinkableButton
      href={href}
      content={
        <Pressable
          disabled={disabled || loading}
          onPress={onPress}
          style={[styles.secondaryButton, (disabled || loading) && styles.buttonDisabled]}>
          {loading ? (
            <ActivityIndicator color={theme.colors.text} />
          ) : (
            <Text style={styles.secondaryButtonText}>{label}</Text>
          )}
        </Pressable>
      }
    />
  );
}

export function SectionTitle({ children }: PropsWithChildren) {
  const styles = useRajulStyles();
  return <Text style={styles.sectionTitle}>{children}</Text>;
}

export function HeroTitle({ children }: PropsWithChildren) {
  const styles = useRajulStyles();
  return <Text style={styles.heroTitle}>{children}</Text>;
}

export function BodyText({
  children,
  muted = false,
  style,
  ...props
}: PropsWithChildren<{ muted?: boolean; style?: any } & TextProps>) {
  const styles = useRajulStyles();
  return (
    <Text style={[styles.bodyText, muted && styles.bodyMuted, style]} {...props}>
      {children}
    </Text>
  );
}

export function Tag({ label, filled = true }: { label: string; filled?: boolean }) {
  const styles = useRajulStyles();
  return (
    <View style={[styles.tag, !filled && styles.tagOutline]}>
      <Text style={styles.tagText}>{label}</Text>
    </View>
  );
}

export function Card({
  children,
  dark = false,
  outlined = false,
  style,
}: PropsWithChildren<{ dark?: boolean; outlined?: boolean; style?: StyleProp<ViewStyle> }>) {
  const styles = useRajulStyles();
  return <View style={[styles.card, dark && styles.cardDark, outlined && styles.cardOutlined, style]}>{children}</View>;
}

export function ProgressBar({ progress }: { progress: number }) {
  const styles = useRajulStyles();
  return (
    <View style={styles.progressTrack}>
      <View style={[styles.progressFill, { width: `${Math.max(0, Math.min(progress, 1)) * 100}%` }]} />
    </View>
  );
}

export function StreakRow({ days }: { days: { label: string; done?: boolean; today?: boolean }[] }) {
  const styles = useRajulStyles();
  const { theme } = useTheme();
  return (
    <View style={styles.streakRow}>
      {days.map((day, index) => (
        <View key={`${day.label}-${index}`} style={[styles.streakDot, day.done && styles.streakDone, day.today && styles.streakToday]}>
          <Text style={[styles.streakText, (day.done || day.today) && { color: theme.colors.background }]}>{day.label}</Text>
        </View>
      ))}
    </View>
  );
}

export function LinkRow({
  title,
  subtitle,
  href,
  right,
}: {
  title: string;
  subtitle?: string;
  href?: string;
  right?: ReactNode;
}) {
  const styles = useRajulStyles();
  const { theme } = useTheme();
  const content = (
    <Pressable style={styles.linkRow}>
      <View style={styles.linkCopy}>
        <Text style={styles.linkTitle}>{title}</Text>
        {subtitle ? <Text style={styles.linkSubtitle}>{subtitle}</Text> : null}
      </View>
      {right ?? <MaterialIcons name="chevron-right" size={18} color={theme.colors.muted} />}
    </Pressable>
  );

  return href ? (
    <Link href={href as never} asChild>
      {content}
    </Link>
  ) : (
    content
  );
}

export function MoodSelector({
  value,
  onChange,
}: {
  value?: string | null;
  onChange?: (value: string) => void;
}) {
  const styles = useRajulStyles();
  const moods = ['😔', '😐', '🙂', '😊'];

  return (
    <View style={styles.moodRow}>
      {moods.map((mood) => (
        <Pressable key={mood} onPress={() => onChange?.(mood)} style={[styles.moodBubble, value === mood && styles.moodBubbleActive]}>
          <Text style={styles.moodText}>{mood}</Text>
        </Pressable>
      ))}
    </View>
  );
}

export function FormField({
  label,
  error,
  right,
  style,
  ...props
}: TextInputProps & {
  label: string;
  error?: string;
  right?: ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  const styles = useRajulStyles();
  const { theme } = useTheme();
  return (
    <View style={styles.fieldShell}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={[styles.fieldWrap, error && styles.fieldWrapError, style]}>
        <TextInput
          placeholderTextColor={theme.colors.muted}
          selectionColor={theme.colors.accent}
          style={styles.fieldInput}
          {...props}
        />
        {right}
      </View>
      {error ? <Text style={[styles.helperText, styles.errorText]}>{error}</Text> : null}
    </View>
  );
}

export function HelperText({ children, error = false }: PropsWithChildren<{ error?: boolean }>) {
  const styles = useRajulStyles();
  return <Text style={[styles.helperText, error && styles.errorText]}>{children}</Text>;
}

export function StepDots({ total, active }: { total: number; active: number }) {
  const styles = useRajulStyles();
  return (
    <View style={styles.stepDots}>
      {Array.from({ length: total }).map((_, index) => (
        <View key={index} style={[styles.stepDot, active === index && styles.stepDotActive]} />
      ))}
    </View>
  );
}

export const rajulStyles = StyleSheet.create({
  splitRow: {
    flexDirection: 'row',
    gap: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  half: {
    width: '47%',
  },
  center: {
    alignItems: 'center',
  },
});
