import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { formatMoney } from '@/utils/format';
import { premium } from '@/utils/premiumTheme';
import { EmpireState, EmpireStats } from '@/game/types';

type Props = {
  state: EmpireState;
  stats: EmpireStats;
};

export function EmpireHeader({ state, stats }: Props) {
  return (
    <View style={styles.header}>
      <View style={styles.brandRow}>
        <View style={styles.brandMark}>
          <Text style={styles.brandMarkText}>VE</Text>
        </View>
        <View>
          <Text style={styles.kicker}>Virtual Empire</Text>
          <Text style={styles.subtitle}>Maison noire / or</Text>
        </View>
      </View>
      <View style={styles.cashPanel}>
        <Text style={styles.cashLabel}>Cash disponible</Text>
        <Text style={styles.cash}>€ {formatMoney(state.cash)}</Text>
      </View>
      <View style={styles.metaRow}>
        <Text style={styles.meta}>+ € {formatMoney(stats.totalIncome)} / sec</Text>
        <Text style={styles.meta}>Niv. {state.level}</Text>
        <Text style={styles.meta}>XP {state.xp}/{state.level * 100}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 8,
    paddingBottom: 16,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  brandMark: {
    width: 42,
    height: 42,
    borderRadius: premium.radius.sm,
    borderWidth: 1,
    borderColor: premium.colors.lineStrong,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: premium.colors.panelElevated,
  },
  brandMarkText: {
    color: premium.colors.goldBright,
    fontSize: 14,
    fontWeight: '900',
  },
  kicker: {
    color: premium.colors.goldBright,
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 0,
    textTransform: 'uppercase',
  },
  subtitle: {
    color: premium.colors.muted,
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2,
  },
  cashPanel: {
    borderLeftWidth: 2,
    borderLeftColor: premium.colors.goldBright,
    marginTop: 16,
    paddingLeft: 12,
  },
  cashLabel: {
    color: premium.colors.muted,
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  cash: {
    color: premium.colors.text,
    fontSize: 42,
    fontWeight: '900',
    marginTop: 4,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10,
  },
  meta: {
    color: premium.colors.champagne,
    borderWidth: 1,
    borderColor: premium.colors.line,
    borderRadius: premium.radius.sm,
    paddingHorizontal: 10,
    paddingVertical: 6,
    overflow: 'hidden',
    backgroundColor: 'rgba(242, 200, 107, 0.09)',
    fontSize: 12,
    fontWeight: '800',
  },
});
