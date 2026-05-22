import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { formatDuration, formatMoney } from '@/utils/format';
import { PremiumCard } from '@/components/empire/PremiumCard';
import { SectionHeader } from '@/components/empire/SectionHeader';
import { premium } from '@/utils/premiumTheme';
import { EmpireState, EmpireStats } from '@/game/types';

type Props = {
  state: EmpireState;
  stats: EmpireStats;
};

export function StatsScreen({ state, stats }: Props) {
  const rows = [
    ['Patrimoine net', `€ ${formatMoney(stats.netWorth)}`],
    ['Cash', `€ ${formatMoney(state.cash)}`],
    ['Banque', `€ ${formatMoney(state.bank)}`],
    ['Impots a payer', `€ ${formatMoney(state.taxDebt)}`],
    ['Saisies fiscales', state.seizureCount.toString()],
    ['Prestiges', state.prestigeCount.toString()],
    ['Points prestige', state.prestigePoints.toLocaleString('fr-FR')],
    ['Bonus permanent', `x${stats.prestigeMultiplier.toFixed(2)}`],
    ['Prochain prestige', `+${stats.nextPrestigePoints.toLocaleString('fr-FR')} points`],
    ['Record patrimoine', `€ ${formatMoney(state.highestNetWorth)}`],
    ['Valeur trading', `€ ${formatMoney(stats.marketValue)}`],
    ['Valeur assets', `€ ${formatMoney(stats.assetValue)}`],
    ['Niveaux business', stats.businessLevels.toLocaleString('fr-FR')],
    ['Immobilier', stats.realEstateOwned.toString()],
    ['Voitures', stats.carsOwned.toString()],
    ['Luxe', stats.luxuryOwned.toString()],
    ['Collections', stats.collectionsOwned.toString()],
    ['Temps joue', formatDuration(state.secondsPlayed)],
  ];

  return (
    <View style={styles.gap}>
      <SectionHeader title="Statistiques" subtitle="Lecture claire des leviers de progression." />
      <PremiumCard>
        {rows.map(([label, value]) => (
          <View key={label} style={styles.row}>
            <Text style={styles.label}>{label}</Text>
            <Text style={styles.value}>{value}</Text>
          </View>
        ))}
      </PremiumCard>
    </View>
  );
}

const styles = StyleSheet.create({
  gap: {
    gap: 12,
  },
  row: {
    minHeight: 36,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  label: {
    color: premium.colors.muted,
    fontSize: 13,
  },
  value: {
    color: premium.colors.text,
    fontSize: 14,
    fontWeight: '900',
    textAlign: 'right',
  },
});
