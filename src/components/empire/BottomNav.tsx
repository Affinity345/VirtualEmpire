import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { premium } from '@/utils/premiumTheme';
import { EmpireTab } from '@/game/types';

const tabs: { id: EmpireTab; label: string }[] = [
  { id: 'dashboard', label: 'Empire' },
  { id: 'business', label: 'Biz' },
  { id: 'trading', label: 'Trade' },
  { id: 'bank', label: 'Banque' },
  { id: 'realEstate', label: 'Immo' },
  { id: 'cars', label: 'Garage' },
  { id: 'luxury', label: 'Luxe' },
  { id: 'collections', label: 'Rares' },
  { id: 'missions', label: 'Missions' },
  { id: 'stats', label: 'Stats' },
];

type Props = {
  active: EmpireTab;
  onChange: (tab: EmpireTab) => void;
};

export function BottomNav({ active, onChange }: Props) {
  return (
    <View style={styles.shell}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.content}>
        {tabs.map((tab) => {
          const selected = active === tab.id;
          return (
            <Pressable
              key={tab.id}
              accessibilityRole="tab"
              accessibilityState={{ selected }}
              onPress={() => onChange(tab.id)}
              style={[styles.tab, selected && styles.activeTab]}>
              <Text style={[styles.label, selected && styles.activeLabel]}>{tab.label}</Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    borderTopWidth: 1,
    borderTopColor: premium.colors.line,
    backgroundColor: 'rgba(3, 3, 3, 0.98)',
    paddingTop: 10,
    paddingBottom: 12,
  },
  content: {
    gap: 8,
    paddingHorizontal: 14,
  },
  tab: {
    height: 42,
    minWidth: 72,
    borderRadius: premium.radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
    backgroundColor: '#0A0907',
  },
  activeTab: {
    borderColor: premium.colors.goldBright,
    backgroundColor: 'rgba(242, 200, 107, 0.16)',
  },
  label: {
    color: premium.colors.muted,
    fontSize: 12,
    fontWeight: '800',
  },
  activeLabel: {
    color: premium.colors.goldBright,
  },
});
