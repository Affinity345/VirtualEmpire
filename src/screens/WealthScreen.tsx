import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AssetVisual } from '@/components/empire/AssetVisual';
import { EmpireButton } from '@/components/empire/EmpireButton';
import { PremiumCard } from '@/components/empire/PremiumCard';
import { SectionHeader } from '@/components/empire/SectionHeader';
import { EmpireAction } from '@/game/reducer';
import { OwnableAsset } from '@/game/types';
import { confirmAction } from '@/utils/confirmAction';
import { formatMoney } from '@/utils/format';
import { premium } from '@/utils/premiumTheme';
import { canBuyOwnable, getOwnableBuyBlock, isOwnableLevelGated } from '@/utils/progression';
import { getResalePrice } from '@/utils/resale';

type WealthCategory =
  | 'cars'
  | 'jets'
  | 'yachts'
  | 'jewelry'
  | 'art'
  | 'nft'
  | 'rare'
  | 'history';

type Props = {
  cars: OwnableAsset[];
  luxury: OwnableAsset[];
  collections: OwnableAsset[];
  cash: number;
  level: number;
  dispatch: React.Dispatch<EmpireAction>;
};

const categories: { id: WealthCategory; label: string }[] = [
  { id: 'cars', label: 'Voitures' },
  { id: 'jets', label: 'Jets privés' },
  { id: 'yachts', label: 'Yachts' },
  { id: 'jewelry', label: 'Bijoux' },
  { id: 'art', label: 'Art' },
  { id: 'nft', label: 'NFT' },
  { id: 'rare', label: 'Collections rares' },
  { id: 'history', label: 'Objets historiques' },
];
const WEALTH_PAGE_SIZE = 36;

export function WealthScreen({ cars, luxury, collections, cash, level, dispatch }: Props) {
  const [category, setCategory] = useState<WealthCategory>('cars');
  const items = useMemo(
    () => getWealthItems(category, cars, luxury, collections),
    [cars, category, collections, luxury],
  );
  const ownedItems = items.filter((item) => item.owned);
  const availableItems = items.filter((item) => item.owned || !isOwnableLevelGated(item) || level >= item.unlockLevel);
  const [visibleCount, setVisibleCount] = useState(WEALTH_PAGE_SIZE);
  const visibleItems = useMemo(() => items.slice(0, visibleCount), [items, visibleCount]);
  const ownedValue = ownedItems.reduce((sum, item) => sum + item.price, 0);

  useEffect(() => {
    setVisibleCount(WEALTH_PAGE_SIZE);
  }, [category]);

  return (
    <View style={styles.gap}>
      <SectionHeader
        title="Patrimoine"
        subtitle="Garage, luxe et collections rares fusionnes dans un coffre premium noir/or."
      />

      <View style={styles.categoryWrap}>
        {categories.map((item) => {
          const active = category === item.id;
          return (
            <Pressable
              key={item.id}
              accessibilityRole="tab"
              accessibilityState={{ selected: active }}
              onPress={() => setCategory(item.id)}
              style={[styles.categoryTab, active && styles.activeCategoryTab]}>
              <Text style={[styles.categoryText, active && styles.activeCategoryText]} numberOfLines={1}>
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <PremiumCard style={styles.hero}>
        <View style={styles.summaryRow}>
          <SummaryMetric label="Possedes" value={`${ownedItems.length}/${items.length}`} />
          <SummaryMetric label="Disponibles" value={`${availableItems.length}/${items.length}`} />
          <SummaryMetric label="Valeur" value={`€ ${formatMoney(ownedValue)}`} />
        </View>
      </PremiumCard>

      {visibleItems.map((item, index) => (
        <WealthItem
          key={item.id}
          item={item}
          index={index}
          cash={cash}
          level={level}
          dispatch={dispatch}
        />
      ))}
      {visibleItems.length < items.length ? (
        <EmpireButton
          label={`Charger plus (${visibleItems.length}/${items.length})`}
          tone="dark"
          onPress={() => setVisibleCount((current) => Math.min(items.length, current + WEALTH_PAGE_SIZE))}
        />
      ) : null}
    </View>
  );
}

function WealthItem({
  item,
  index,
  cash,
  level,
  dispatch,
}: {
  item: OwnableAsset;
  index: number;
  cash: number;
  level: number;
  dispatch: React.Dispatch<EmpireAction>;
}) {
  const locked = !item.owned && isOwnableLevelGated(item) && level < item.unlockLevel;
  const disabled = !item.owned && !canBuyOwnable(item, cash, level);
  const buyBlock = getOwnableBuyBlock(item, cash, level);
  const resalePrice = getResalePrice(item.price);
  const accent = index % 3 === 0 ? 'Signature' : index % 3 === 1 ? 'Reserve' : 'Private vault';
  const sellItem = () =>
    confirmAction(
      'Confirmer la vente',
      `Vendre ${item.name} pour € ${formatMoney(resalePrice)} ?`,
      () => dispatch({ type: 'sellOwnable', category: item.category, id: item.id }),
    );

  return (
    <PremiumCard style={styles.assetCard}>
      <View style={styles.visualPlate}>
        <AssetVisual
          code={item.icon}
          imageSlot={item.imageSlot}
          imageUrl={item.imageUrl}
          owned={item.owned}
          size="lg"
        />
      </View>
      <View style={styles.assetBody}>
        <View style={styles.assetTop}>
          <View style={styles.assetInfo}>
            <Text style={styles.assetName}>{item.name}</Text>
            <Text style={styles.meta}>{item.tier} - {item.rarity} - {accent}</Text>
            {locked ? <Text style={styles.locked}>Endgame niveau {item.unlockLevel}</Text> : null}
            {!locked && buyBlock ? <Text style={styles.locked}>{buyBlock}</Text> : null}
          </View>
          <Text style={item.owned ? styles.owned : styles.price}>
            {locked ? 'Endgame' : item.owned ? 'Possede' : `€ ${formatMoney(item.price)}`}
          </Text>
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
                onPress={() => dispatch({ type: 'buyOwnable', category: item.category, id: item.id })}
              />
            </>
          )}
        </View>
      </View>
    </PremiumCard>
  );
}

function SummaryMetric({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.summaryMetric}>
      <Text style={styles.summaryLabel}>{label}</Text>
      <Text style={styles.summaryValue} numberOfLines={1} adjustsFontSizeToFit>
        {value}
      </Text>
    </View>
  );
}

const getWealthItems = (
  category: WealthCategory,
  cars: OwnableAsset[],
  luxury: OwnableAsset[],
  collections: OwnableAsset[],
) => {
  switch (category) {
    case 'cars':
      return cars;
    case 'jets':
      return luxury.filter((item) => item.icon === 'G7' || /Jet|Gulfstream|Bombardier|Falcon|Citation|Praetor|Aviation/i.test(item.name));
    case 'yachts':
      return luxury.filter((item) => item.icon === 'YS' || /Yacht|Azimut|Sunseeker|Benetti|Lürssen|Oceanco|Suite|Submersible/i.test(item.name));
    case 'jewelry':
      return luxury.filter((item) => /Montre|Diamant|Couronne|Bijou|Collier|Rubis|Coffre|Salon/i.test(item.name));
    case 'art':
      return [
        ...luxury.filter((item) => /Tableau|Sculpture|Art/i.test(item.name)),
        ...collections.filter((item) => /Toile|Sculpture/i.test(item.name)),
      ];
    case 'nft':
      return collections.filter((item) => /NFT|Crypto Art/i.test(item.name));
    case 'history':
      return collections.filter((item) =>
        /Archive|Manuscrit|Sabre|Medaille|Pièce|Piece Antique|Objet historique|Masque/i.test(item.name),
      );
    case 'rare':
      return collections.filter((item) => /Météorite|Meteorite|Fossile|Rookie|Rare|Collection rare|Vin/i.test(item.name));
  }
};

const styles = StyleSheet.create({
  gap: {
    gap: 12,
  },
  categoryWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryTab: {
    minHeight: 42,
    minWidth: '47%',
    flexGrow: 1,
    borderRadius: premium.radius.sm,
    borderWidth: 1,
    borderColor: premium.colors.line,
    backgroundColor: premium.colors.panelSoft,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  activeCategoryTab: {
    borderColor: premium.colors.goldBright,
    backgroundColor: 'rgba(242, 200, 107, 0.16)',
  },
  categoryText: {
    color: premium.colors.muted,
    fontSize: 12,
    fontWeight: '900',
  },
  activeCategoryText: {
    color: premium.colors.goldBright,
  },
  hero: {
    backgroundColor: premium.colors.panelElevated,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 10,
  },
  summaryMetric: {
    flex: 1,
    minWidth: 0,
  },
  summaryLabel: {
    color: premium.colors.muted,
    fontSize: 11,
    fontWeight: '800',
  },
  summaryValue: {
    color: premium.colors.goldBright,
    fontSize: 16,
    fontWeight: '900',
    marginTop: 7,
  },
  assetCard: {
    gap: 14,
  },
  visualPlate: {
    minHeight: 116,
    borderRadius: premium.radius.sm,
    borderWidth: 1,
    borderColor: premium.colors.lineStrong,
    backgroundColor: '#080704',
    alignItems: 'center',
    justifyContent: 'center',
  },
  assetBody: {
    gap: 12,
  },
  assetTop: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
  assetInfo: {
    flex: 1,
    minWidth: 0,
  },
  assetName: {
    color: premium.colors.text,
    fontSize: 19,
    fontWeight: '900',
  },
  meta: {
    color: premium.colors.muted,
    fontSize: 12,
    marginTop: 6,
  },
  locked: {
    color: premium.colors.champagne,
    fontSize: 12,
    fontWeight: '800',
    marginTop: 7,
  },
  price: {
    color: premium.colors.goldBright,
    fontSize: 13,
    fontWeight: '900',
    maxWidth: 106,
    textAlign: 'right',
  },
  owned: {
    color: premium.colors.success,
    fontSize: 13,
    fontWeight: '900',
    maxWidth: 106,
    textAlign: 'right',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  resale: {
    color: premium.colors.champagne,
    flex: 1,
    fontSize: 12,
    fontWeight: '800',
  },
});
