import { Redirect, Tabs } from 'expo-router';
import React from 'react';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { HapticTab } from '@/components/haptic-tab';
import { useAuth } from '@/providers/auth-provider';
import { useTheme } from '@/src/context/ThemeContext';
import { useLesson } from '@/src/hooks/useLesson';
import { STORAGE_KEYS, useStoredJson } from '@/src/lib/storage';
import type { ReflectionEntry } from '@/src/types/app';

export default function TabLayout() {
  const { onboardingCompleted } = useAuth();
  const { theme } = useTheme();
  const { isCompletedToday, todaysLesson } = useLesson();
  const reflections = useStoredJson<ReflectionEntry[]>(STORAGE_KEYS.userReflections, []);

  if (!onboardingCompleted) {
    return <Redirect href="/splash" />;
  }

  const todayReflection = todaysLesson
    ? reflections.find((reflection) => reflection.lessonId === todaysLesson.id)
    : null;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.accent,
        tabBarInactiveTintColor: theme.colors.muted,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: theme.colors.card,
          borderTopColor: theme.colors.border,
          height: 78,
          paddingTop: 10,
          paddingBottom: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontFamily: 'DMSans_500Medium',
          letterSpacing: 0.4,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <MaterialIcons size={24} name="home-filled" color={color} />,
        }}
      />
      <Tabs.Screen
        name="pillars"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color }) => <MaterialIcons size={24} name="grid-view" color={color} />,
        }}
      />
      <Tabs.Screen
        name="library"
        options={{
          title: 'Library',
          tabBarIcon: ({ color }) => <MaterialIcons size={24} name="menu-book" color={color} />,
        }}
      />
      <Tabs.Screen
        name="reflection"
        options={{
          title: 'Reflect',
          tabBarBadge: isCompletedToday && !todayReflection ? '1' : undefined,
          tabBarIcon: ({ color }) => <MaterialIcons size={24} name="edit-note" color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <MaterialIcons size={24} name="settings" color={color} />,
        }}
      />
    </Tabs>
  );
}
