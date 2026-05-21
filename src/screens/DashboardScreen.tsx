import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { EmpireButton } from '@/components/empire/EmpireButton';
import { formatDuration, formatMoney } from '@/utils/format';
import { PremiumCard } from '@/components/empire/PremiumCard';
import { SectionHeader } from '@/components/empire/SectionHeader';
import { premium } from '@/utils/premiumTheme';
import { EmpireState, EmpireStats, EmpireTab } from '@/game/types';

type Props = {
  state: EmpireState;
  stats: EmpireStats;
  onNavigate: (tab: EmpireTab) => void;
  onReset: () => void;
};

export function DashboardScreen({ state, stats, onNavigate, onReset }: Props) {
  return (
    <View style={styles.gap}>
      <PremiumCard style={styles.hero}>
        <View style={styles.heroTopLine}>
          <Text style={styles.heroEyebrow}>Maison noire / or</Text>
          <Text style={styles.heroBadge}>Premium tycoon</Text>
        </View>
        <Text style={styles.heroTitle}>Construis un empire qui tourne meme hors decisions.</Text>
        <Text style={styles.heroText}>
          Business, placements, immobilier, luxe et missions sont deja branches au moteur central.
        </Text>
        <View style={styles.heroDivider} />
        <View style={styles.heroMetrics}>
          <Text style={styles.heroMetric}>Net worth € {formatMoney(stats.netWorth)}</Text>
          <Text style={styles.heroMetric}>Tax € {formatMoney(state.taxDebt)}</Text>
        </View>
      </PremiumCard>

      <SectionHeader title="Vue empire" subtitle="Les indicateurs principaux de rentabilite." />

      <View style={styles.grid}>
        <Stat label="Patrimoine" value={`€ ${formatMoney(stats.netWorth)}`} />
        <Stat label="Revenu passif" value={`€ ${formatMoney(stats.totalIncome)} / sec`} />
        <Stat label="Banque" value={`€ ${formatMoney(state.bank)}`} />
        <Stat label="Dette" value={`€ ${formatMoney(state.debt)}`} tone="danger" />
        <Stat label="Impots" value={`€ ${formatMoney(state.taxDebt)}`} tone={state.taxDebt > 0 ? 'danger' : undefined} />
      </View>

      <PremiumCard>
        <Text style={styles.cardTitle}>Progression</Text>
        <Text style={styles.line}>Total gagne : € {formatMoney(state.totalEarned)}</Text>
        <Text style={styles.line}>Temps de jeu : {formatDuration(state.secondsPlayed)}</Text>
        <Text style={styles.line}>Positions trading : {stats.marketUnits}</Text>
        <Text style={styles.line}>Saisies fiscales : {state.seizureCount}</Text>
        {state.lastSeizureAmount > 0 ? (
          <Text style={styles.dangerLine}>Derniere saisie : € {formatMoney(state.lastSeizureAmount)}</Text>
        ) : null}
        <View style={styles.quickActions}>
          <EmpireButton label="Business" onPress={() => onNavigate('business')} />
          <EmpireButton label="Trading" tone="dark" onPress={() => onNavigate('trading')} />
          <EmpireButton label="Missions" tone="dark" onPress={() => onNavigate('missions')} />
        </View>
      </PremiumCard>

      <EmpireButton label="Reset local" tone="danger" onPress={onReset} />
    </View>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone?: 'danger' }) {
  return (
    <PremiumCard style={styles.stat}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={[styles.statValue, tone === 'danger' && styles.danger]} numberOfLines={1} adjustsFontSizeToFit>
        {value}
      </Text>
    </PremiumCard>
  );
}

const styles = StyleSheet.create({
  gap: {
    gap: 14,
  },
  hero: {
    backgroundColor: premium.colors.panelElevated,
    paddingVertical: 20,
  },
  heroTopLine: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  heroEyebrow: {
    color: premium.colors.goldBright,
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  heroBadge: {
    color: premium.colors.champagne,
    borderWidth: 1,
    borderColor: premium.colors.line,
    borderRadius: premium.radius.sm,
    paddingHorizontal: 9,
    paddingVertical: 5,
    fontSize: 11,
    fontWeight: '800',
    overflow: 'hidden',
  },
  heroTitle: {
    color: premium.colors.text,
    fontSize: 25,
    lineHeight: 31,
    fontWeight: '900',
    marginTop: 10,
  },
  heroText: {
    color: premium.colors.muted,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 10,
  },
  heroDivider: {
    height: 1,
    backgroundColor: premium.colors.line,
    marginTop: 16,
  },
  heroMetrics: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  heroMetric: {
    color: premium.colors.champagne,
    fontSize: 12,
    fontWeight: '800',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  stat: {
    flexGrow: 1,
    flexBasis: '47%',
    minHeight: 88,
    backgroundColor: premium.colors.panelSoft,
  },
  statLabel: {
    color: premium.colors.muted,
    fontSize: 12,
    fontWeight: '800',
  },
  statValue: {
    color: premium.colors.goldBright,
    fontSize: 20,
    fontWeight: '900',
    marginTop: 10,
  },
  danger: {
    color: premium.colors.danger,
  },
  cardTitle: {
    color: premium.colors.text,
    fontSize: 18,
    fontWeight: '900',
  },
  line: {
    color: premium.colors.muted,
    fontSize: 14,
    marginTop: 8,
  },
  dangerLine: {
    color: premium.colors.danger,
    fontSize: 14,
    fontWeight: '800',
    marginTop: 8,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 14,
  },
});
