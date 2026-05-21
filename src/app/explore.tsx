import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { premiumImagePlan } from '@/data/premiumImagePlan';
import { PremiumCard } from '@/components/empire/PremiumCard';
import { SectionHeader } from '@/components/empire/SectionHeader';
import { premium } from '@/utils/premiumTheme';

export default function AssetPlanScreen() {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.content,
        {
          paddingTop: insets.top + 28,
          paddingBottom: insets.bottom + 110,
        },
      ]}>
      <SectionHeader
        title="Images IA premium"
        subtitle="Slots prevus pour brancher ensuite les visuels noir/or sans toucher au moteur."
      />
      <View style={styles.list}>
        {premiumImagePlan.map((item) => (
          <PremiumCard key={item.slot}>
            <Text style={styles.slot}>{item.slot}</Text>
            <Text style={styles.category}>
              {item.category} - {item.ready ? 'image branchee' : 'en attente image IA'}
            </Text>
            <Text style={styles.prompt}>{item.prompt}</Text>
          </PremiumCard>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: premium.colors.ink,
  },
  content: {
    paddingHorizontal: 16,
  },
  list: {
    gap: 12,
  },
  slot: {
    color: premium.colors.goldBright,
    fontSize: 14,
    fontWeight: '900',
  },
  prompt: {
    color: premium.colors.muted,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 8,
  },
  category: {
    color: premium.colors.champagne,
    fontSize: 11,
    fontWeight: '800',
    marginTop: 6,
    textTransform: 'uppercase',
  },
});
