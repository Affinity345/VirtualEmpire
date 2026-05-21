import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { AssetVisual } from '@/components/empire/AssetVisual';
import { formatMoney } from '@/utils/format';
import { PremiumCard } from '@/components/empire/PremiumCard';
import { SectionHeader } from '@/components/empire/SectionHeader';
import { premium } from '@/utils/premiumTheme';
import { EmpireAction } from '@/game/reducer';
import { BusinessAsset } from '@/game/types';

type Props = {
  businesses: BusinessAsset[];
  cash: number;
  dispatch: React.Dispatch<EmpireAction>;
};

export function BusinessScreen({ businesses, cash, dispatch }: Props) {
  const activeBusinesses = businesses.filter((business) => business.level > 0).length;
  const totalIncome = businesses.reduce(
    (sum, business) => sum + business.level * business.baseIncome,
    0,
  );
  const nextAffordable = businesses.find((business) => {
    const cost = Math.round(business.basePrice * Math.pow(1.34, business.level));
    return business.level < business.maxLevel && cash >= cost;
  });

  return (
    <View style={styles.gap}>
      <SectionHeader
        title="Portefeuille business"
        subtitle="Priorise les meilleurs rendements, monte les niveaux et transforme chaque achat en revenu passif."
      />
      <View style={styles.summaryGrid}>
        <PremiumCard style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Actifs</Text>
          <Text style={styles.summaryValue}>{activeBusinesses}/{businesses.length}</Text>
        </PremiumCard>
        <PremiumCard style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Revenu</Text>
          <Text style={styles.summaryValue}>€ {formatMoney(totalIncome)} / sec</Text>
        </PremiumCard>
      </View>
      {nextAffordable ? (
        <PremiumCard style={styles.recommendation}>
          <Text style={styles.recoLabel}>Prochaine opportunite</Text>
          <Text style={styles.recoTitle}>{nextAffordable.name}</Text>
          <Text style={styles.recoText}>
            ROI estime : {Math.max(1, Math.round(nextAffordable.baseIncome / nextAffordable.basePrice * 10000) / 100)}%
            par cycle.
          </Text>
        </PremiumCard>
      ) : null}
      {businesses.map((business) => {
        const cost = Math.round(business.basePrice * Math.pow(1.34, business.level));
        const nextIncome = business.baseIncome;
        const roi = cost > 0 ? (nextIncome / cost) * 100 : 0;
        const progress = business.level / business.maxLevel;
        const disabled = cash < cost || business.level >= business.maxLevel;
        const status = business.level >= business.maxLevel ? 'Max' : disabled ? 'Fonds' : 'Upgrade';

        return (
          <PremiumCard
            key={business.id}
            disabled={disabled}
            onPress={() => dispatch({ type: 'upgradeBusiness', id: business.id })}>
            <View style={styles.row}>
              <AssetVisual
                code={business.icon}
                imageSlot={business.imageSlot}
                imageUrl={business.imageUrl}
                owned={business.level > 0}
                size="lg"
              />
              <View style={styles.info}>
                <Text style={styles.title}>{business.name}</Text>
                <Text style={styles.meta}>{business.sector} - Niveau {business.level}/{business.maxLevel}</Text>
                <Text style={styles.income}>+ € {formatMoney(business.level * business.baseIncome)} / sec</Text>
              </View>
              <View style={styles.side}>
                <Text style={styles.status}>{status}</Text>
                <Text style={styles.price}>€ {formatMoney(cost)}</Text>
              </View>
            </View>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${Math.max(3, progress * 100)}%` }]} />
            </View>
            <View style={styles.metricsRow}>
              <Text style={styles.metric}>Gain prochain niveau: € {formatMoney(nextIncome)} / sec</Text>
              <Text style={styles.metric}>ROI {roi.toFixed(2)}%</Text>
            </View>
          </PremiumCard>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  gap: {
    gap: 12,
  },
  summaryGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: premium.colors.panelSoft,
  },
  summaryLabel: {
    color: premium.colors.muted,
    fontSize: 12,
    fontWeight: '800',
  },
  summaryValue: {
    color: premium.colors.goldBright,
    fontSize: 18,
    fontWeight: '900',
    marginTop: 8,
  },
  recommendation: {
    backgroundColor: premium.colors.panelElevated,
    borderColor: premium.colors.lineStrong,
  },
  recoLabel: {
    color: premium.colors.goldBright,
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  recoTitle: {
    color: premium.colors.text,
    fontSize: 18,
    fontWeight: '900',
    marginTop: 7,
  },
  recoText: {
    color: premium.colors.muted,
    fontSize: 13,
    marginTop: 5,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  info: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    color: premium.colors.text,
    fontSize: 16,
    fontWeight: '900',
  },
  meta: {
    color: premium.colors.muted,
    fontSize: 12,
    marginTop: 4,
  },
  income: {
    color: premium.colors.success,
    fontSize: 13,
    fontWeight: '800',
    marginTop: 6,
  },
  side: {
    alignItems: 'flex-end',
    maxWidth: 98,
  },
  status: {
    color: premium.colors.goldBright,
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
    marginBottom: 5,
  },
  price: {
    color: premium.colors.goldBright,
    fontSize: 13,
    fontWeight: '900',
    textAlign: 'right',
  },
  progressTrack: {
    height: 5,
    borderRadius: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    marginTop: 14,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: premium.colors.goldBright,
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 10,
  },
  metric: {
    color: premium.colors.muted,
    fontSize: 11,
    fontWeight: '700',
    flex: 1,
  },
});
