import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AssetVisual } from '@/components/empire/AssetVisual';
import { EmpireButton } from '@/components/empire/EmpireButton';
import { PremiumCard } from '@/components/empire/PremiumCard';
import { SectionHeader } from '@/components/empire/SectionHeader';
import { EmpireAction } from '@/game/reducer';
import { MarketAsset, OwnableAsset } from '@/game/types';
import { confirmAction } from '@/utils/confirmAction';
import { formatMoney } from '@/utils/format';
import { premium } from '@/utils/premiumTheme';
import { canBuyOwnable, getOwnableBuyBlock, isOwnableLevelGated } from '@/utils/progression';
import { getResalePrice } from '@/utils/resale';

type InvestmentCategory = 'Action' | 'Crypto' | 'Immobilier';

type Props = {
  market: MarketAsset[];
  realEstate: OwnableAsset[];
  cash: number;
  level: number;
  prestigeMultiplier: number;
  dispatch: React.Dispatch<EmpireAction>;
};

const categories: { id: InvestmentCategory; label: string }[] = [
  { id: 'Action', label: 'Actions' },
  { id: 'Crypto', label: 'Crypto' },
  { id: 'Immobilier', label: 'Immobilier' },
];
const INVESTMENT_PAGE_SIZE = 36;
const REAL_ESTATE_PAGE_SIZE = 24;

export function InvestmentsScreen({
  market,
  realEstate,
  cash,
  level,
  prestigeMultiplier,
  dispatch,
}: Props) {
  const [category, setCategory] = useState<InvestmentCategory>('Action');
  const [visibleAssetCount, setVisibleAssetCount] = useState(INVESTMENT_PAGE_SIZE);
  const [visibleRealEstateCount, setVisibleRealEstateCount] = useState(REAL_ESTATE_PAGE_SIZE);
  const assets = useMemo(
    () => market.filter((asset) => asset.type === category),
    [category, market],
  );
  const visibleAssets = useMemo(() => assets.slice(0, visibleAssetCount), [assets, visibleAssetCount]);
  const visibleRealEstate = useMemo(
    () => realEstate.slice(0, visibleRealEstateCount),
    [realEstate, visibleRealEstateCount],
  );
  const availableRealEstate = realEstate.filter((item) => item.owned || !isOwnableLevelGated(item) || level >= item.unlockLevel).length;
  const portfolioValue = assets.reduce((sum, asset) => sum + asset.owned * asset.price, 0);
  const invested = assets.reduce((sum, asset) => sum + asset.invested, 0);
  const profit = portfolioValue - invested;
  const ownedCount = assets.filter((asset) => asset.owned > 0).length;

  useEffect(() => {
    setVisibleAssetCount(INVESTMENT_PAGE_SIZE);
    setVisibleRealEstateCount(REAL_ESTATE_PAGE_SIZE);
  }, [category]);

  return (
    <View style={styles.gap}>
      <SectionHeader
        title="Investissements"
        subtitle="Trading live, crypto, fonds immobiliers et biens premium dans un seul espace."
      />

      <View style={styles.tabs}>
        {categories.map((item) => {
          const active = category === item.id;
          return (
            <Pressable
              key={item.id}
              accessibilityRole="tab"
              accessibilityState={{ selected: active }}
              onPress={() => setCategory(item.id)}
              style={[styles.categoryTab, active && styles.activeCategoryTab]}>
              <Text style={[styles.categoryText, active && styles.activeCategoryText]}>
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <PremiumCard style={styles.summary}>
        <View style={styles.summaryGrid}>
          <SummaryMetric label="Actifs" value={`${ownedCount}/${assets.length}`} />
          <SummaryMetric label="Valeur" value={`€ ${formatMoney(portfolioValue)}`} />
          <SummaryMetric
            label="Profit / perte"
            value={formatSignedMoney(profit)}
            positive={profit >= 0}
          />
        </View>
      </PremiumCard>

      {category === 'Immobilier' ? (
        <>
          <Text style={styles.sectionLabel}>Biens immobiliers</Text>
          <PremiumCard style={styles.realEstateSummary}>
            <View style={styles.summaryGrid}>
              <SummaryMetric label="Disponibles" value={`${availableRealEstate}/${realEstate.length}`} />
              <SummaryMetric
                label="Revenu immo"
                value={`€ ${formatMoney(
                  realEstate.reduce(
                    (sum, item) => sum + (item.owned ? item.passiveIncome * prestigeMultiplier : 0),
                    0,
                  ),
                )} / sec`}
              />
              <SummaryMetric
                label="Possedes"
                value={`${realEstate.filter((item) => item.owned).length}`}
              />
            </View>
          </PremiumCard>
          {visibleRealEstate.map((item) => (
            <RealEstateInvestmentRow
              key={item.id}
              item={item}
              cash={cash}
              level={level}
              prestigeMultiplier={prestigeMultiplier}
              dispatch={dispatch}
            />
          ))}
          {visibleRealEstate.length < realEstate.length ? (
            <EmpireButton
              label={`Charger plus d'immo (${visibleRealEstate.length}/${realEstate.length})`}
              tone="dark"
              onPress={() =>
                setVisibleRealEstateCount((current) => Math.min(realEstate.length, current + REAL_ESTATE_PAGE_SIZE))
              }
            />
          ) : null}
          <Text style={styles.sectionLabel}>Fonds immobiliers live</Text>
        </>
      ) : null}

      {visibleAssets.map((asset) => (
        <InvestmentRow key={asset.id} asset={asset} cash={cash} dispatch={dispatch} />
      ))}
      {visibleAssets.length < assets.length ? (
        <EmpireButton
          label={`Charger plus d'actifs (${visibleAssets.length}/${assets.length})`}
          tone="dark"
          onPress={() => setVisibleAssetCount((current) => Math.min(assets.length, current + INVESTMENT_PAGE_SIZE))}
        />
      ) : null}
    </View>
  );
}

function InvestmentRow({
  asset,
  cash,
  dispatch,
}: {
  asset: MarketAsset;
  cash: number;
  dispatch: React.Dispatch<EmpireAction>;
}) {
  const up = asset.price >= asset.previousPrice;
  const dayChange = ((asset.price - asset.dayOpen) / asset.dayOpen) * 100;
  const buyPrice = normalizePrice(asset.price * (1 + asset.spread));
  const sellPrice = normalizePrice(asset.price * (1 - asset.spread));
  const value = asset.owned * asset.price;
  const profit = value - asset.invested;
  const returnRate = asset.invested > 0 ? (profit / asset.invested) * 100 : 0;

  return (
    <PremiumCard>
      <View style={styles.assetTop}>
        <View style={styles.assetInfo}>
          <Text style={styles.symbol}>{asset.symbol}</Text>
          <Text style={styles.name}>{asset.name}</Text>
          <Text style={styles.meta}>Risque {asset.risk} - Vol. {formatMoney(asset.volume)}</Text>
        </View>
        <View style={styles.priceBox}>
          <Text style={styles.price}>€ {formatPrice(asset.price)}</Text>
          <Text style={up ? styles.up : styles.down}>
            {dayChange >= 0 ? '+' : ''}{dayChange.toFixed(2)}%
          </Text>
        </View>
      </View>

      <View style={styles.metricsGrid}>
        <Cell label="Possede" value={asset.owned.toString()} />
        <Cell label="Valeur totale" value={`€ ${formatMoney(value)}`} />
        <Cell label="Prix moyen" value={asset.owned > 0 ? `€ ${formatPrice(asset.averageCost)}` : '-'} />
        <Cell
          label="Profit / perte"
          value={asset.owned > 0 ? `${formatSignedMoney(profit)} (${returnRate.toFixed(1)}%)` : '-'}
          positive={profit >= 0}
        />
      </View>

      <View style={styles.actions}>
        <EmpireButton
          label={`Acheter € ${formatPrice(buyPrice)}`}
          disabled={cash < buyPrice}
          onPress={() => dispatch({ type: 'buyMarket', id: asset.id })}
        />
        <EmpireButton
          label={`Vendre € ${formatPrice(sellPrice)}`}
          tone="dark"
          disabled={asset.owned <= 0}
          onPress={() => dispatch({ type: 'sellMarket', id: asset.id })}
        />
      </View>
    </PremiumCard>
  );
}

function RealEstateInvestmentRow({
  item,
  cash,
  level,
  prestigeMultiplier,
  dispatch,
}: {
  item: OwnableAsset;
  cash: number;
  level: number;
  prestigeMultiplier: number;
  dispatch: React.Dispatch<EmpireAction>;
}) {
  const locked = !item.owned && isOwnableLevelGated(item) && level < item.unlockLevel;
  const disabled = !item.owned && !canBuyOwnable(item, cash, level);
  const buyBlock = getOwnableBuyBlock(item, cash, level);
  const resalePrice = getResalePrice(item.price);
  const sellItem = () =>
    confirmAction(
      'Confirmer la vente',
      `Vendre ${item.name} pour € ${formatMoney(resalePrice)} ?`,
      () => dispatch({ type: 'sellOwnable', category: 'realEstate', id: item.id }),
    );

  return (
    <PremiumCard
      disabled={!item.owned && disabled}
      onPress={
        item.owned || disabled
          ? undefined
          : () => dispatch({ type: 'buyOwnable', category: 'realEstate', id: item.id })
      }>
      <View style={styles.assetTop}>
        <AssetVisual
          code={item.icon}
          imageSlot={item.imageSlot}
          imageUrl={item.imageUrl}
          owned={item.owned}
          size="lg"
        />
        <View style={styles.assetInfo}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.meta}>{item.tier} - {item.rarity}</Text>
          <Text style={styles.income}>
            + € {formatMoney(item.passiveIncome * prestigeMultiplier)} / sec
          </Text>
          {locked ? <Text style={styles.locked}>Endgame niveau {item.unlockLevel}</Text> : null}
          {!locked && buyBlock ? <Text style={styles.locked}>{buyBlock}</Text> : null}
        </View>
        <View style={styles.priceBox}>
          <Text style={item.owned ? styles.owned : styles.price}>
            {locked ? 'Endgame' : item.owned ? 'Possede' : `€ ${formatMoney(item.price)}`}
          </Text>
        </View>
      </View>
      <View style={styles.actions}>
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
              onPress={() => dispatch({ type: 'buyOwnable', category: 'realEstate', id: item.id })}
            />
          </>
        )}
      </View>
    </PremiumCard>
  );
}

function SummaryMetric({
  label,
  value,
  positive,
}: {
  label: string;
  value: string;
  positive?: boolean;
}) {
  return (
    <View style={styles.summaryMetric}>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text
        style={[
          styles.metricValue,
          positive === true && styles.positive,
          positive === false && styles.negative,
        ]}
        numberOfLines={1}
        adjustsFontSizeToFit>
        {value}
      </Text>
    </View>
  );
}

function Cell({
  label,
  value,
  positive,
}: {
  label: string;
  value: string;
  positive?: boolean;
}) {
  return (
    <View style={styles.cell}>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text
        style={[
          styles.cellValue,
          positive === true && styles.positive,
          positive === false && styles.negative,
        ]}
        numberOfLines={1}
        adjustsFontSizeToFit>
        {value}
      </Text>
    </View>
  );
}

const normalizePrice = (value: number) => {
  if (value < 0.000001) return 0.000001;
  if (value < 1) return Number(value.toPrecision(4));
  return Math.round(value);
};

const formatPrice = (value: number) => {
  if (value === 0) return '0';
  const absoluteValue = Math.abs(value);
  if (absoluteValue < 0.0001) return value.toFixed(6);
  if (absoluteValue < 1) return value.toFixed(4);
  return formatMoney(value);
};

const formatSignedMoney = (value: number) =>
  `${value >= 0 ? '+' : '-'}€ ${formatPrice(Math.abs(value))}`;

const styles = StyleSheet.create({
  gap: {
    gap: 12,
  },
  tabs: {
    flexDirection: 'row',
    gap: 8,
  },
  categoryTab: {
    flex: 1,
    minHeight: 42,
    borderRadius: premium.radius.sm,
    borderWidth: 1,
    borderColor: premium.colors.line,
    backgroundColor: premium.colors.panelSoft,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
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
  summary: {
    backgroundColor: premium.colors.panelElevated,
  },
  realEstateSummary: {
    backgroundColor: premium.colors.panelSoft,
  },
  sectionLabel: {
    color: premium.colors.goldBright,
    fontSize: 15,
    fontWeight: '900',
    marginTop: 6,
    textTransform: 'uppercase',
  },
  summaryGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  summaryMetric: {
    flex: 1,
    minWidth: 0,
  },
  metricLabel: {
    color: premium.colors.muted,
    fontSize: 11,
    fontWeight: '800',
  },
  metricValue: {
    color: premium.colors.goldBright,
    fontSize: 17,
    fontWeight: '900',
    marginTop: 7,
  },
  assetTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  assetInfo: {
    flex: 1,
    minWidth: 0,
  },
  symbol: {
    color: premium.colors.goldBright,
    fontSize: 12,
    fontWeight: '900',
  },
  name: {
    color: premium.colors.text,
    fontSize: 18,
    fontWeight: '900',
    marginTop: 4,
  },
  meta: {
    color: premium.colors.muted,
    fontSize: 12,
    marginTop: 5,
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
  priceBox: {
    alignItems: 'flex-end',
    maxWidth: 112,
  },
  price: {
    color: premium.colors.text,
    fontSize: 17,
    fontWeight: '900',
    textAlign: 'right',
  },
  owned: {
    color: premium.colors.success,
    fontSize: 13,
    fontWeight: '900',
    textAlign: 'right',
  },
  up: {
    color: premium.colors.success,
    fontSize: 12,
    fontWeight: '900',
    marginTop: 4,
  },
  down: {
    color: premium.colors.danger,
    fontSize: 12,
    fontWeight: '900',
    marginTop: 4,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 14,
  },
  cell: {
    width: '48%',
    borderRadius: premium.radius.sm,
    borderWidth: 1,
    borderColor: premium.colors.line,
    backgroundColor: 'rgba(0,0,0,0.16)',
    padding: 10,
  },
  cellValue: {
    color: premium.colors.text,
    fontSize: 13,
    fontWeight: '900',
    marginTop: 6,
  },
  positive: {
    color: premium.colors.success,
  },
  negative: {
    color: premium.colors.danger,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 14,
  },
  resale: {
    color: premium.colors.champagne,
    flex: 1,
    fontSize: 12,
    fontWeight: '800',
    alignSelf: 'center',
  },
});
