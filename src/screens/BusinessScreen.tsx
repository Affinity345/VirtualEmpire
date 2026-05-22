import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

import { AssetVisual } from '@/components/empire/AssetVisual';
import { EmpireButton } from '@/components/empire/EmpireButton';
import { PremiumCard } from '@/components/empire/PremiumCard';
import { SectionHeader } from '@/components/empire/SectionHeader';
import { EmpireAction } from '@/game/reducer';
import { BusinessAsset, EmpireState, EmpireStats } from '@/game/types';
import { confirmAction } from '@/utils/confirmAction';
import { formatMoney } from '@/utils/format';
import { premium } from '@/utils/premiumTheme';
import {
  EnterpriseStatus,
  getEnterpriseCause,
  getEnterpriseEfficiency,
  getEnterpriseIncome,
  getEnterpriseStatus,
  getEnterpriseStatusLabel,
} from '@/utils/enterprise';
import {
  BUSINESS_MAX_LEVEL,
  getBusinessFoundingBlock,
  getBusinessFoundingCost,
  getBusinessLevelProgress,
  getBusinessMilestoneLabel,
  getBusinessResalePrice,
} from '@/utils/progression';
import { PASSIVE_PAYOUT_INTERVAL_SECONDS } from '@/game/selectors';

const AVAILABLE_PAGE_SIZE = 48;
const investorSectors = new Set([
  'Banques',
  'Holdings',
  'Hedge funds',
  'Private equity',
  'Multinationales',
  'Conglomerats',
]);
const automationSectors = new Set(['IA', 'IA business', 'Technologie', 'Informatique', 'Blockchain']);
const acquisitionSectors = new Set(['Holdings', 'Private equity', 'Conglomerats', 'Franchises mondiales']);

type Props = {
  state: EmpireState;
  stats: EmpireStats;
  dispatch: React.Dispatch<EmpireAction>;
};

export function BusinessScreen({ state, stats, dispatch }: Props) {
  const businesses = state.businesses;
  const ownedBusinesses = businesses.filter((business) => business.level > 0);
  const availableBusinesses = businesses.filter((business) => business.level <= 0);
  const [visibleAvailableCount, setVisibleAvailableCount] = useState(AVAILABLE_PAGE_SIZE);
  const visibleAvailableBusinesses = useMemo(
    () => availableBusinesses.slice(0, visibleAvailableCount),
    [availableBusinesses, visibleAvailableCount],
  );
  const totalEnterpriseIncome = ownedBusinesses.reduce(
    (sum, business) => sum + getEnterpriseIncome(business, stats.totalRevenueMultiplier),
    0,
  );

  return (
    <View style={styles.gap}>
      <SectionHeader
        title="Entreprise"
        subtitle="Virtual Empire Biz Edition : holdings, investisseurs, automation et revenus haut de gamme."
      />

      <EnterpriseHome
        ownedBusinesses={ownedBusinesses}
        availableBusinesses={availableBusinesses}
        visibleAvailableBusinesses={visibleAvailableBusinesses}
        totalEnterpriseIncome={totalEnterpriseIncome}
        state={state}
        stats={stats}
        dispatch={dispatch}
        onLoadMore={() =>
          setVisibleAvailableCount((current) => Math.min(availableBusinesses.length, current + AVAILABLE_PAGE_SIZE))
        }
      />
    </View>
  );
}

function EnterpriseHome({
  ownedBusinesses,
  availableBusinesses,
  visibleAvailableBusinesses,
  totalEnterpriseIncome,
  state,
  stats,
  dispatch,
  onLoadMore,
}: {
  ownedBusinesses: BusinessAsset[];
  availableBusinesses: BusinessAsset[];
  visibleAvailableBusinesses: BusinessAsset[];
  totalEnterpriseIncome: number;
  state: EmpireState;
  stats: EmpireStats;
  dispatch: React.Dispatch<EmpireAction>;
  onLoadMore: () => void;
}) {
  const categoryCount = new Set([...ownedBusinesses, ...availableBusinesses].map((business) => business.sector)).size;
  const bizPulse = useRef(new Animated.Value(0)).current;
  const bizPrestige = Math.max(1, state.prestigeCount + Math.floor(totalEnterpriseIncome / 1000000));
  const investorPower = ownedBusinesses.reduce(
    (sum, business) => sum + (investorSectors.has(business.sector) ? business.level * 3 : business.level),
    0,
  );
  const aiEmployees = ownedBusinesses
    .filter((business) => automationSectors.has(business.sector))
    .reduce((sum, business) => sum + business.employees, 0);
  const autoAcquisitions = ownedBusinesses
    .filter((business) => acquisitionSectors.has(business.sector))
    .reduce((sum, business) => sum + Math.floor(business.level / 4), 0);
  const automationScore = Math.min(
    100,
    Math.floor(
      ownedBusinesses.reduce((sum, business) => sum + getEnterpriseEfficiency(business), 0) /
        Math.max(1, ownedBusinesses.length) *
        32 +
        aiEmployees * 0.15,
    ),
  );

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(bizPulse, {
          toValue: 1,
          duration: 1700,
          useNativeDriver: true,
        }),
        Animated.timing(bizPulse, {
          toValue: 0,
          duration: 1700,
          useNativeDriver: true,
        }),
      ]),
    );

    animation.start();
    return () => animation.stop();
  }, [bizPulse]);

  return (
    <View style={styles.gap}>
      <PremiumCard style={styles.bizHero}>
        <Animated.View
          pointerEvents="none"
          style={[
            styles.bizGlow,
            {
              opacity: bizPulse.interpolate({
                inputRange: [0, 1],
                outputRange: [0.16, 0.34],
              }),
              transform: [
                {
                  scale: bizPulse.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.98, 1.03],
                  }),
                },
              ],
            },
          ]}
        />
        <View style={styles.bizTopLine}>
          <Text style={styles.bizEdition}>Virtual Empire Biz Edition</Text>
          <Text style={styles.bizBadge}>Billionaire simulator</Text>
        </View>
        <Text style={styles.bizTitle}>Board financier, acquisitions et automation IA.</Text>
        <Text style={styles.bizCopy}>
          Pilote des holdings, hedge funds, franchises mondiales et conglomérats avec une progression business scalable.
        </Text>
        <View style={styles.bizKpiGrid}>
          <BizKpi label="Prestige business" value={`BIZ ${bizPrestige}`} />
          <BizKpi label="Investisseurs" value={investorPower.toLocaleString('fr-FR')} />
          <BizKpi label="Acquisitions auto" value={autoAcquisitions.toLocaleString('fr-FR')} />
          <BizKpi label="Employes IA" value={aiEmployees.toLocaleString('fr-FR')} />
          <BizKpi label="Automation" value={`${automationScore}%`} />
          <BizKpi label="Cash-flow / h" value={`€ ${formatMoney(totalEnterpriseIncome * 3600)}`} />
        </View>
      </PremiumCard>

      <PremiumCard style={styles.hero}>
        <Text style={styles.heroLabel}>Revenu entreprises</Text>
        <Text style={styles.heroValue}>€ {formatMoney(totalEnterpriseIncome)} / sec</Text>
        <Text style={styles.heroSub}>Soit € {formatMoney(totalEnterpriseIncome * 3600)} / heure</Text>
      </PremiumCard>

      <View style={styles.catalogStats}>
        <PremiumCard style={styles.catalogStatCard}>
          <Text style={styles.catalogStatValue}>{ownedBusinesses.length + availableBusinesses.length}</Text>
          <Text style={styles.catalogStatLabel}>Entreprises</Text>
        </PremiumCard>
        <PremiumCard style={styles.catalogStatCard}>
          <Text style={styles.catalogStatValue}>{availableBusinesses.length}</Text>
          <Text style={styles.catalogStatLabel}>Disponibles</Text>
        </PremiumCard>
        <PremiumCard style={styles.catalogStatCard}>
          <Text style={styles.catalogStatValue}>{categoryCount}</Text>
          <Text style={styles.catalogStatLabel}>Catégories</Text>
        </PremiumCard>
      </View>

      <Text style={styles.sectionLabel}>Mes entreprises</Text>
      {ownedBusinesses.length === 0 ? (
        <PremiumCard>
          <Text style={styles.emptyTitle}>Aucune entreprise active</Text>
          <Text style={styles.muted}>Tes entreprises actives apparaitront ici avec leurs revenus et projets.</Text>
        </PremiumCard>
      ) : null}

      {ownedBusinesses.map((business) => (
        <EnterpriseRow
          key={business.id}
          business={business}
          income={getEnterpriseIncome(business, stats.totalRevenueMultiplier)}
          state={state}
          stats={stats}
          dispatch={dispatch}
        />
      ))}

      <Text style={styles.sectionLabel}>Entreprises disponibles</Text>
      <Text style={styles.catalogHint}>
        Affichage optimise : {visibleAvailableBusinesses.length}/{availableBusinesses.length} entreprises chargees.
      </Text>
      {visibleAvailableBusinesses.map((business) => (
        <AvailableEnterpriseRow
          key={business.id}
          business={business}
          state={state}
          stats={stats}
          dispatch={dispatch}
        />
      ))}
      {visibleAvailableBusinesses.length < availableBusinesses.length ? (
        <EmpireButton label="Charger plus d'entreprises" tone="dark" onPress={onLoadMore} />
      ) : null}
    </View>
  );
}

function BizKpi({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.bizKpi}>
      <Text style={styles.bizKpiLabel}>{label}</Text>
      <Text style={styles.bizKpiValue} numberOfLines={1} adjustsFontSizeToFit>
        {value}
      </Text>
    </View>
  );
}

function AvailableEnterpriseRow({
  business,
  state,
  stats,
  dispatch,
}: {
  business: BusinessAsset;
  state: EmpireState;
  stats: EmpireStats;
  dispatch: React.Dispatch<EmpireAction>;
}) {
  const cost = getBusinessFoundingCost(business);
  const blockReason = getBusinessFoundingBlock(business, state.cash, state.level);
  const projectedIncome = getEnterpriseIncome({ ...business, level: 1, projectProgress: 100 }, stats.totalRevenueMultiplier);
  const pressScale = useRef(new Animated.Value(1)).current;
  const disabled = Boolean(blockReason);
  const upgrade = () => {
    if (disabled) return;
    Animated.sequence([
      Animated.timing(pressScale, { toValue: 0.985, duration: 80, useNativeDriver: true }),
      Animated.spring(pressScale, { toValue: 1, speed: 18, bounciness: 6, useNativeDriver: true }),
    ]).start();
    dispatch({ type: 'upgradeBusiness', id: business.id });
  };

  return (
    <Animated.View style={{ transform: [{ scale: pressScale }] }}>
      <PremiumCard onPress={upgrade} disabled={disabled} style={styles.touchCard}>
        <View style={styles.row}>
          <AssetVisual
            code={business.icon}
            imageSlot={business.imageSlot}
            imageUrl={business.imageUrl}
            owned={false}
            size="lg"
          />
          <View style={styles.info}>
            <Text style={styles.title}>{business.name}</Text>
            <BusinessFacts
              priceLabel="Coût upgrade"
              price={cost}
              income={projectedIncome}
              incomeGain={projectedIncome}
              roiSeconds={cost / Math.max(1, projectedIncome)}
              level={business.level}
              category={business.sector}
              status={blockReason ?? 'A acheter'}
              rarity={business.rarity}
            />
            {blockReason ? <Text style={styles.muted}>{blockReason}</Text> : null}
          </View>
          <StatusPill status="non_fondee" />
        </View>
        <View style={styles.quickAction}>
          <Text style={styles.quickActionText}>
            {blockReason ?? `Toucher pour acheter - € ${formatMoney(cost)}`}
          </Text>
        </View>
      </PremiumCard>
    </Animated.View>
  );
}

function EnterpriseRow({
  business,
  income,
  state,
  stats,
  dispatch,
}: {
  business: BusinessAsset;
  income: number;
  state: EmpireState;
  stats: EmpireStats;
  dispatch: React.Dispatch<EmpireAction>;
}) {
  const status = getEnterpriseStatus(business);
  const upgradeCost = getBusinessFoundingCost(business);
  const resalePrice = getBusinessResalePrice(business);
  const pressScale = useRef(new Animated.Value(1)).current;
  const isMaxed = business.level >= BUSINESS_MAX_LEVEL;
  const canUpgrade = !isMaxed && state.cash >= upgradeCost;
  const incomeAfterUpgrade = isMaxed
    ? income
    : getEnterpriseIncome(
        {
          ...business,
          level: Math.min(BUSINESS_MAX_LEVEL, business.level + 1),
          employees: business.employees + 2,
          vehicles: business.vehicles + (/Transport|Hospitalite/.test(business.sector) || /taxi|transport|concession|flotte/i.test(business.name) ? 1 : 0),
          buildings: business.buildings + (business.level > 0 && business.level % 5 === 0 ? 1 : 0),
          projectProgress: business.level <= 0 ? 100 : business.projectProgress,
        },
        stats.totalRevenueMultiplier,
      );
  const incomeGain = Math.max(0, incomeAfterUpgrade - income);
  const upgrade = () => {
    if (!canUpgrade) return;
    Animated.sequence([
      Animated.timing(pressScale, { toValue: 0.985, duration: 80, useNativeDriver: true }),
      Animated.spring(pressScale, { toValue: 1, speed: 18, bounciness: 6, useNativeDriver: true }),
    ]).start();
    dispatch({ type: 'upgradeBusiness', id: business.id });
  };
  const sellBusiness = () =>
    confirmAction(
      'Confirmer la vente',
      `Vendre ${business.name} pour € ${formatMoney(resalePrice)} ?`,
      () => dispatch({ type: 'sellBusiness', id: business.id }),
    );

  return (
    <Animated.View style={{ transform: [{ scale: pressScale }] }}>
      <PremiumCard onPress={upgrade} style={[styles.touchCard, !canUpgrade && styles.touchCardLocked]}>
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
            <BusinessFacts
              priceLabel="Coût upgrade"
              price={upgradeCost}
              income={income}
              incomeGain={incomeGain}
              roiSeconds={upgradeCost / Math.max(1, Math.max(1, incomeGain))}
              level={business.level}
              category={business.sector}
              status={getEnterpriseStatusLabel(status)}
              rarity={business.rarity}
            />
            <LevelProgress business={business} compact />
            <Text style={styles.muted}>{getEnterpriseCause(business)}</Text>
          </View>
          <StatusPill status={status} />
        </View>
        <View style={styles.quickAction}>
          <Text style={styles.quickActionText}>
            {isMaxed
              ? 'Entreprise maxée'
              : canUpgrade
                ? `Toucher pour améliorer - € ${formatMoney(upgradeCost)}`
                : `Cash insuffisant - upgrade € ${formatMoney(upgradeCost)}`}
          </Text>
        </View>
        <View style={styles.actionRow}>
          <Text style={styles.saleInline}>Prix de revente : € {formatMoney(resalePrice)}</Text>
          <EmpireButton label="Vendre" tone="danger" onPress={sellBusiness} />
        </View>
      </PremiumCard>
    </Animated.View>
  );
}

function BusinessFacts({
  priceLabel,
  price,
  income,
  incomeGain,
  roiSeconds,
  level,
  category,
  status,
  rarity,
}: {
  priceLabel: string;
  price: number;
  income: number;
  incomeGain: number;
  roiSeconds: number;
  level: number;
  category: string;
  status: string;
  rarity: BusinessAsset['rarity'];
}) {
  return (
    <View style={styles.factGrid}>
      <Fact label={priceLabel} value={formatBusinessPrice(price)} />
      <Fact label="Niveau" value={`${Math.min(level, BUSINESS_MAX_LEVEL)}/${BUSINESS_MAX_LEVEL}`} tone={level >= BUSINESS_MAX_LEVEL ? 'gold' : undefined} />
      <Fact label="Revenu/sec" value={`€ ${formatMoney(income)}`} tone="success" />
      <Fact label="Revenu/40s" value={`€ ${formatMoney(income * PASSIVE_PAYOUT_INTERVAL_SECONDS)}`} tone="success" />
      <Fact label="Gain upgrade" value={`+€ ${formatMoney(incomeGain)} / sec`} tone="success" />
      <Fact label="ROI estimé" value={formatBusinessRoi(roiSeconds)} tone="gold" />
      <Fact label="Categorie" value={category} />
      <Fact label="Statut" value={status} />
      <Fact label="Rarete" value={rarity} tone="gold" />
    </View>
  );
}

function LevelProgress({ business, compact }: { business: BusinessAsset; compact?: boolean }) {
  const progress = getBusinessLevelProgress(business.level);
  const maxed = business.level >= BUSINESS_MAX_LEVEL;

  return (
    <View style={compact ? styles.levelCompact : styles.levelBlock}>
      <View style={styles.levelTopLine}>
        <Text style={styles.levelText}>Niveau {Math.min(business.level, BUSINESS_MAX_LEVEL)}/{BUSINESS_MAX_LEVEL}</Text>
        <Text style={[styles.levelBadge, maxed && styles.levelBadgeMax]}>
          {getBusinessMilestoneLabel(business.level)}
        </Text>
      </View>
      <View style={styles.levelTrack}>
        <View style={[styles.levelFill, { width: `${Math.max(3, progress)}%` }]} />
      </View>
    </View>
  );
}

function Fact({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: 'success' | 'gold';
}) {
  return (
    <View style={styles.fact}>
      <Text style={styles.factLabel}>{label}</Text>
      <Text
        style={[
          styles.factValue,
          tone === 'success' && styles.factValueSuccess,
          tone === 'gold' && styles.factValueGold,
        ]}
        numberOfLines={1}
        adjustsFontSizeToFit>
        {value}
      </Text>
    </View>
  );
}

const formatBusinessRoi = (seconds: number) => {
  if (!Number.isFinite(seconds) || seconds <= 0) return 'Instant';
  if (seconds < 60) return `${Math.ceil(seconds)}s`;
  if (seconds < 3600) return `${Math.ceil(seconds / 60)} min`;
  if (seconds < 86400) return `${Math.ceil(seconds / 3600)} h`;
  return `${Math.ceil(seconds / 86400)} j`;
};

const formatBusinessPrice = (price: number) =>
  Number.isFinite(price) ? `€ ${formatMoney(price)}` : 'Max';

function StatusPill({ status }: { status: EnterpriseStatus }) {
  const statusStyle = {
    non_fondee: styles.status_non_fondee,
    rentable: styles.status_rentable,
    attente: styles.status_attente,
    suspendu: styles.status_suspendu,
    construction: styles.status_construction,
  }[status];

  return (
    <View style={[styles.statusPill, statusStyle]}>
      <Text style={styles.statusText}>{getEnterpriseStatusLabel(status)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  gap: { gap: 12 },
  bizHero: {
    backgroundColor: '#0C0A06',
    borderColor: 'rgba(242, 200, 107, 0.38)',
    overflow: 'hidden',
  },
  bizGlow: {
    position: 'absolute',
    right: -64,
    top: -58,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: premium.colors.goldBright,
  },
  bizTopLine: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  bizEdition: { color: premium.colors.goldBright, fontSize: 12, fontWeight: '900', textTransform: 'uppercase' },
  bizBadge: {
    color: '#0C0A06',
    backgroundColor: premium.colors.goldBright,
    borderRadius: premium.radius.sm,
    paddingHorizontal: 9,
    paddingVertical: 5,
    overflow: 'hidden',
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  bizTitle: { color: premium.colors.text, fontSize: 24, fontWeight: '900', marginTop: 14 },
  bizCopy: { color: premium.colors.champagne, fontSize: 13, fontWeight: '700', lineHeight: 19, marginTop: 8 },
  bizKpiGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 16 },
  bizKpi: {
    width: '31%',
    minWidth: 96,
    borderWidth: 1,
    borderColor: 'rgba(242, 200, 107, 0.24)',
    borderRadius: premium.radius.sm,
    padding: 10,
    backgroundColor: 'rgba(255,255,255,0.045)',
  },
  bizKpiLabel: { color: premium.colors.muted, fontSize: 9, fontWeight: '900', textTransform: 'uppercase' },
  bizKpiValue: { color: premium.colors.goldBright, fontSize: 15, fontWeight: '900', marginTop: 6 },
  hero: { backgroundColor: premium.colors.panelElevated },
  heroLabel: { color: premium.colors.muted, fontSize: 12, fontWeight: '900', textTransform: 'uppercase' },
  heroValue: { color: premium.colors.goldBright, fontSize: 30, fontWeight: '900', marginTop: 6 },
  heroSub: { color: premium.colors.champagne, fontSize: 13, fontWeight: '800', marginTop: 6 },
  catalogStats: { flexDirection: 'row', gap: 8 },
  catalogStatCard: { flex: 1, padding: 12 },
  catalogStatValue: { color: premium.colors.goldBright, fontSize: 22, fontWeight: '900' },
  catalogStatLabel: { color: premium.colors.muted, fontSize: 10, fontWeight: '900', marginTop: 4, textTransform: 'uppercase' },
  catalogHint: { color: premium.colors.muted, fontSize: 12, fontWeight: '700', marginTop: -4 },
  sectionLabel: { color: premium.colors.goldBright, fontSize: 15, fontWeight: '900', textTransform: 'uppercase' },
  row: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  info: { flex: 1, minWidth: 0 },
  title: { color: premium.colors.text, fontSize: 16, fontWeight: '900' },
  meta: { color: premium.colors.muted, fontSize: 12, marginTop: 4 },
  muted: { color: premium.colors.muted, fontSize: 12, lineHeight: 18, marginTop: 6 },
  income: { color: premium.colors.success, fontSize: 13, fontWeight: '800', marginTop: 6 },
  touchCard: {
    borderColor: 'rgba(242, 200, 107, 0.32)',
  },
  touchCardLocked: {
    borderColor: premium.colors.line,
  },
  factGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 8 },
  fact: {
    minWidth: '30%',
    borderWidth: 1,
    borderColor: premium.colors.line,
    borderRadius: premium.radius.sm,
    paddingHorizontal: 8,
    paddingVertical: 7,
    backgroundColor: 'rgba(255,255,255,0.035)',
  },
  factLabel: { color: premium.colors.muted, fontSize: 9, fontWeight: '900', textTransform: 'uppercase' },
  factValue: { color: premium.colors.text, fontSize: 11, fontWeight: '900', marginTop: 3 },
  factValueSuccess: { color: premium.colors.success },
  factValueGold: { color: premium.colors.goldBright },
  levelBlock: { marginTop: 12 },
  levelCompact: { marginTop: 10 },
  levelTopLine: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 },
  levelText: { color: premium.colors.text, fontSize: 12, fontWeight: '900' },
  levelBadge: {
    color: premium.colors.champagne,
    borderWidth: 1,
    borderColor: premium.colors.line,
    borderRadius: premium.radius.sm,
    paddingHorizontal: 8,
    paddingVertical: 4,
    overflow: 'hidden',
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  levelBadgeMax: {
    color: '#0C0A06',
    borderColor: premium.colors.goldBright,
    backgroundColor: premium.colors.goldBright,
  },
  levelTrack: {
    height: 7,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.08)',
    marginTop: 8,
    overflow: 'hidden',
  },
  levelFill: { height: '100%', borderRadius: 999, backgroundColor: premium.colors.goldBright },
  quickAction: {
    minHeight: 46,
    borderRadius: premium.radius.sm,
    borderWidth: 1,
    borderColor: premium.colors.goldBright,
    backgroundColor: 'rgba(242, 200, 107, 0.14)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    paddingHorizontal: 12,
  },
  quickActionText: {
    color: premium.colors.goldBright,
    fontSize: 13,
    fontWeight: '900',
    textAlign: 'center',
  },
  actionRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 8, marginTop: 14 },
  saleInline: { color: premium.colors.goldBright, fontSize: 12, fontWeight: '900', alignSelf: 'center', flex: 1 },
  statusPill: { borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6, borderWidth: 1, alignSelf: 'flex-start' },
  statusText: { color: premium.colors.text, fontSize: 10, fontWeight: '900', textTransform: 'uppercase' },
  status_non_fondee: { borderColor: premium.colors.line, backgroundColor: premium.colors.panelSoft },
  status_rentable: { borderColor: 'rgba(34,197,94,0.55)', backgroundColor: 'rgba(34,197,94,0.16)' },
  status_attente: { borderColor: 'rgba(245,158,11,0.55)', backgroundColor: 'rgba(245,158,11,0.16)' },
  status_suspendu: { borderColor: 'rgba(248,113,113,0.55)', backgroundColor: 'rgba(127,29,29,0.30)' },
  status_construction: { borderColor: 'rgba(96,165,250,0.55)', backgroundColor: 'rgba(30,64,175,0.24)' },
  emptyTitle: { color: premium.colors.text, fontSize: 17, fontWeight: '900' },
});
