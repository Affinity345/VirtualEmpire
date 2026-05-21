import { Tabs } from 'expo-router';
import React from 'react';

import { premium } from '@/utils/premiumTheme';

export default function AppTabs() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: premium.colors.goldBright,
        tabBarInactiveTintColor: premium.colors.muted,
        tabBarStyle: {
          backgroundColor: '#030303',
          borderTopColor: premium.colors.line,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '800',
        },
      }}>
      <Tabs.Screen name="index" options={{ title: 'Empire' }} />
      <Tabs.Screen name="explore" options={{ title: 'Assets IA' }} />
    </Tabs>
  );
}
