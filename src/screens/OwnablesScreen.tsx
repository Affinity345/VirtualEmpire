import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { AssetVisual } from '@/components/empire/AssetVisual';
import { EmpireButton } from '@/components/empire/EmpireButton';
import { formatMoney } from '@/utils/format';
import { PremiumCard } from '@/components/empire/PremiumCard';
import { SectionHeader } from '@/components/empire/SectionHeader';
import { premium } from '@/utils/premiumTheme';
import { EmpireAction } from '@/game/reducer';
import { OwnableAsset, OwnableCategory } from '@/game/types';
import { confirmAction } from '@/utils/confirmAction';
import { getResalePrice } from '@/utils/resale';

type Props = {
  title: string;
  subtitle: string;
  category: OwnableCategory;
  items: OwnableAsset[];
  cash: number;
  level: number;
  prestigeMultiplier: number;
  dispatch: React.Dispatch<EmpireAction>;
};

export function OwnablesScreen({
  title,
  subtitle,
  category,
  items,
  cash,
  level,
  prestigeMultiplier,
  dispatch,
}: Props) {
  const unlockedItems = items.filter((item) => item.owned || level >= item.unlockLevel).length;

  return (
    <View style={styles.gap}>
      <SectionHeader title={title} subtitle={subtitle} />
      <View style={styles.summaryGrid}>
        <PremiumCard style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Debloques</Text>
          <Text style={styles.summaryValue}>{unlockedItems}/{items.length}</Text>
        </PremiumCard>
        <PremiumCard style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Raretés</Text>
          <Text style={styles.summaryValue}>5 tiers</Text>
        </PremiumCard>
      </View>
      {items.map((item) => {
        const locked = !item.owned && level < item.unlockLevel;
        const disabled = locked || cash < item.price;
        const resalePrice = getResalePrice(item.price);
        const sellItem = () =>
          confirmAction(
            'Confirmer la vente',
            `Vendre ${item.name} pour € ${formatMoney(resalePrice)} ?`,
            () => dispatch({ type: 'sellOwnable', category, id: item.id }),
          );

        return (
          <PremiumCard
            key={item.id}
            disabled={!item.owned && disabled}
            onPress={
              item.owned || locked ? undefined : () => dispatch({ type: 'buyOwnable', category, id: item.id })
            }>
            <View style={styles.row}>
              <AssetVisual
                code={item.icon}
                imageSlot={item.imageSlot}
                imageUrl={item.imageUrl}
                owned={item.owned}
                size="lg"
              />
              <View style={styles.info}>
                <Text style={styles.title}>{item.name}</Text>
                <Text style={styles.meta}>{item.tier} - {item.rarity}</Text>
                {item.passiveIncome > 0 ? (
                  <Text style={styles.income}>+ € {formatMoney(item.passiveIncome * prestigeMultiplier)} / sec</Text>
                ) : null}
                {locked ? <Text style={styles.locked}>Debloque au niveau {item.unlockLevel}</Text> : null}
              </View>
              <View style={styles.side}>
                <Text style={item.owned ? styles.owned : styles.price}>
                  {locked ? `Niv. ${item.unlockLevel}` : item.owned ? 'Possede' : `€ ${formatMoney(item.price)}`}
                </Text>
              </View>
            </View>
            <View style={styles.actionRow}>
              {item.owned ? (
                <>
                  <Text style={styles.resale}>Revente : € {formatMoney(resalePrice)}</Text>
                  <EmpireButton label="Vendre" tone="danger" onPress={sellItem} />
                </>
              ) : (
                <>
                  <Text style={styles.resale}>Achat : € {formatMoney(item.price)}</Text>
                  <EmpireButton
                    label="Acheter"
                    disabled={disabled}
                    onPress={() => dispatch({ type: 'buyOwnable', category, id: item.id })}
                  />
                </>
              )}
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
  row: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
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
    fontSize: 16,
    fontWeight: '900',
    marginTop: 8,
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
    fontSize: 11,
    marginTop: 4,
  },
  income: {
    color: premium.colors.success,
    fontSize: 13,
    fontWeight: '800',
    marginTop: 6,
  },
  locked: {
    color: premium.colors.champagne,
    fontSize: 12,
    fontWeight: '800',
    marginTop: 6,
  },
  side: {
    maxWidth: 94,
  },
  price: {
    color: premium.colors.goldBright,
    fontSize: 13,
    fontWeight: '900',
    textAlign: 'right',
  },
  owned: {
    color: premium.colors.success,
    fontSize: 13,
    fontWeight: '900',
    textAlign: 'right',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 14,
  },
  resale: {
    color: premium.colors.champagne,
    flex: 1,
    fontSize: 12,
    fontWeight: '800',
  },
});
