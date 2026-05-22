import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AssetVisual } from '@/components/empire/AssetVisual';
import { EmpireButton } from '@/components/empire/EmpireButton';
import { PremiumCard } from '@/components/empire/PremiumCard';
import { SectionHeader } from '@/components/empire/SectionHeader';
import { EmpireAction } from '@/game/reducer';
import { BusinessAsset, EmpireState, EmpireStats } from '@/game/types';
import { formatMoney } from '@/utils/format';
import { premium } from '@/utils/premiumTheme';
import {
  EnterpriseStatus,
  getEnterpriseCause,
  getEnterpriseEfficiency,
  getEnterpriseIncome,
  getEnterpriseStatus,
  getEnterpriseStatusLabel,
  getEnterpriseTaxLimit,
} from '@/utils/enterprise';

type Mode = 'home' | 'found' | 'mergers';

type Props = {
  state: EmpireState;
  stats: EmpireStats;
  dispatch: React.Dispatch<EmpireAction>;
};

export function BusinessScreen({ state, stats, dispatch }: Props) {
  const [mode, setMode] = useState<Mode>('home');
  const [selectedId, setSelectedId] = useState<string | undefined>();
  const businesses = state.businesses;
  const selected = businesses.find((item) => item.id === selectedId);
  const ownedBusinesses = businesses.filter((business) => business.level > 0);
  const totalEnterpriseIncome = ownedBusinesses.reduce(
    (sum, business) => sum + getEnterpriseIncome(business, stats.totalRevenueMultiplier),
    0,
  );

  if (selected) {
    return (
      <EnterpriseDetail
        business={selected}
        state={state}
        stats={stats}
        dispatch={dispatch}
        onBack={() => setSelectedId(undefined)}
      />
    );
  }

  return (
    <View style={styles.gap}>
      <SectionHeader
        title="Entreprise"
        subtitle="Automatisation, projets, fiscalite, reputation et fusions pour ton empire."
      />

      <View style={styles.modeRow}>
        <ModeTab label="Accueil" active={mode === 'home'} onPress={() => setMode('home')} />
        <ModeTab label="Fonder" active={mode === 'found'} onPress={() => setMode('found')} />
        <ModeTab label="Fusions" active={mode === 'mergers'} onPress={() => setMode('mergers')} />
      </View>

      {mode === 'home' ? (
        <EnterpriseHome
          businesses={businesses}
          ownedBusinesses={ownedBusinesses}
          totalEnterpriseIncome={totalEnterpriseIncome}
          stats={stats}
          dispatch={dispatch}
          onSelect={setSelectedId}
          onFound={() => setMode('found')}
          onMergers={() => setMode('mergers')}
        />
      ) : null}

      {mode === 'found' ? (
        <FoundEnterprise businesses={businesses} cash={state.cash} dispatch={dispatch} onSelect={setSelectedId} />
      ) : null}

      {mode === 'mergers' ? (
        <EnterpriseMergers state={state} stats={stats} businesses={businesses} dispatch={dispatch} />
      ) : null}
    </View>
  );
}

function EnterpriseHome({
  businesses,
  ownedBusinesses,
  totalEnterpriseIncome,
  stats,
  dispatch,
  onSelect,
  onFound,
  onMergers,
}: {
  businesses: BusinessAsset[];
  ownedBusinesses: BusinessAsset[];
  totalEnterpriseIncome: number;
  stats: EmpireStats;
  dispatch: React.Dispatch<EmpireAction>;
  onSelect: (id: string) => void;
  onFound: () => void;
  onMergers: () => void;
}) {
  return (
    <View style={styles.gap}>
      <PremiumCard style={styles.hero}>
        <Text style={styles.heroLabel}>Revenu entreprises</Text>
        <Text style={styles.heroValue}>€ {formatMoney(totalEnterpriseIncome)} / sec</Text>
        <Text style={styles.heroSub}>Soit € {formatMoney(totalEnterpriseIncome * 3600)} / heure</Text>
        <View style={styles.actionRow}>
          <EmpireButton label="Fonder une entreprise" onPress={onFound} />
          <EmpireButton label="Fusions d'entreprises" tone="dark" onPress={onMergers} />
        </View>
      </PremiumCard>

      <Text style={styles.sectionLabel}>Mes entreprises</Text>
      {ownedBusinesses.length === 0 ? (
        <PremiumCard>
          <Text style={styles.emptyTitle}>Aucune entreprise active</Text>
          <Text style={styles.muted}>Fonde ta premiere entreprise pour lancer l&apos;automatisation.</Text>
        </PremiumCard>
      ) : null}

      {ownedBusinesses.map((business) => (
        <EnterpriseRow
          key={business.id}
          business={business}
          income={getEnterpriseIncome(business, stats.totalRevenueMultiplier)}
          dispatch={dispatch}
          onSelect={onSelect}
        />
      ))}

      {businesses.filter((business) => business.level <= 0).slice(0, 8).map((business) => (
        <EnterpriseRow
          key={business.id}
          business={business}
          income={0}
          dispatch={dispatch}
          onSelect={onSelect}
          preview
        />
      ))}
    </View>
  );
}

function FoundEnterprise({
  businesses,
  cash,
  dispatch,
  onSelect,
}: {
  businesses: BusinessAsset[];
  cash: number;
  dispatch: React.Dispatch<EmpireAction>;
  onSelect: (id: string) => void;
}) {
  const candidates = businesses.filter((business) => business.level <= 0).slice(0, 45);

  return (
    <View style={styles.gap}>
      <Text style={styles.sectionLabel}>Fonder une entreprise</Text>
      {candidates.map((business) => {
        const cost = Math.round(business.basePrice);
        const canBuy = cash >= cost;
        return (
          <PremiumCard key={business.id} style={styles.foundCard}>
            <View style={styles.row}>
              <AssetVisual
                code={business.icon}
                imageSlot={business.imageSlot}
                imageUrl={business.imageUrl}
                size="lg"
              />
              <View style={styles.info}>
                <Text style={styles.title}>{business.name}</Text>
                <Text style={styles.meta}>{business.sector} - {business.rarity}</Text>
                <Text style={styles.income}>Potentiel : € {formatMoney(business.baseIncome)} / sec</Text>
              </View>
              <View style={styles.side}>
                <Text style={styles.price}>€ {formatMoney(cost)}</Text>
                <Text style={styles.unlock}>Niv. {business.unlockLevel}</Text>
              </View>
            </View>
            <View style={styles.actionRow}>
              <EmpireButton
                label="Fonder"
                disabled={!canBuy}
                onPress={() => dispatch({ type: 'upgradeBusiness', id: business.id })}
              />
              <EmpireButton label="Détail" tone="dark" onPress={() => onSelect(business.id)} />
            </View>
          </PremiumCard>
        );
      })}
    </View>
  );
}

function EnterpriseDetail({
  business,
  state,
  stats,
  dispatch,
  onBack,
}: {
  business: BusinessAsset;
  state: EmpireState;
  stats: EmpireStats;
  dispatch: React.Dispatch<EmpireAction>;
  onBack: () => void;
}) {
  const status = getEnterpriseStatus(business);
  const income = getEnterpriseIncome(business, stats.totalRevenueMultiplier);
  const upgradeCost = Math.round(business.basePrice * Math.pow(1.34, business.level));
  const taxLimit = getEnterpriseTaxLimit(business);
  const transportLike = /Transport|Hospitalite/.test(business.sector) || /taxi|transport|concession/i.test(business.name);
  const techLike = /Technologie|Innovation/.test(business.sector) || /informatique|fintech|IA/i.test(business.name);

  return (
    <View style={styles.gap}>
      <EmpireButton label="Retour Entreprise" tone="dark" onPress={onBack} />
      <PremiumCard style={styles.detailHero}>
        <AssetVisual
          code={business.icon}
          imageSlot={business.imageSlot}
          imageUrl={business.imageUrl}
          owned={business.level > 0}
          size="lg"
        />
        <Text style={styles.detailTitle}>{business.name}</Text>
        <StatusPill status={status} />
        <Text style={styles.detailMeta}>{business.sector} - Niveau {business.level}/{business.maxLevel}</Text>
        <Text style={styles.heroValue}>€ {formatMoney(income)} / sec</Text>
        <Text style={styles.muted}>{getEnterpriseCause(business)}</Text>
      </PremiumCard>

      <PremiumCard>
        <Text style={styles.cardTitle}>Projet actif</Text>
        <Text style={styles.title}>{business.projectName}</Text>
        <ProgressBar value={business.projectProgress} />
        <Text style={styles.muted}>
          Ressources {Math.floor(business.resources).toLocaleString('fr-FR')} - Qualite {Math.floor(business.quality)}%
        </Text>
      </PremiumCard>

      <PremiumCard>
        <Text style={styles.cardTitle}>Operations automatiques</Text>
        <View style={styles.kpiGrid}>
          <Kpi label="Employes" value={business.employees.toString()} />
          <Kpi label="Vehicules" value={business.vehicles.toString()} />
          <Kpi label="Batiments" value={business.buildings.toString()} />
          <Kpi label="Efficacite" value={`${getEnterpriseEfficiency(business).toFixed(2)}x`} />
          <Kpi label="Maintenance" value={`${Math.floor(business.maintenance)}%`} />
          <Kpi label="Reputation" value={`${Math.floor(business.reputation)}%`} />
        </View>
        {transportLike ? <Text style={styles.muted}>Capacite : {business.vehicles * 4 + business.employees} trajets / cycle.</Text> : null}
        {techLike ? <Text style={styles.muted}>Depenses IT : € {formatMoney(business.employees * 12 + business.buildings * 80)} / cycle.</Text> : null}
      </PremiumCard>

      <PremiumCard>
        <Text style={styles.cardTitle}>Amelioration</Text>
        <Text style={styles.muted}>Ajoute employés, véhicules, bâtiments, qualité et vitesse projet.</Text>
        <View style={styles.actionRow}>
          <EmpireButton
            label={`Upgrade € ${formatMoney(upgradeCost)}`}
            disabled={state.cash < upgradeCost}
            onPress={() => dispatch({ type: 'upgradeBusiness', id: business.id })}
          />
          <EmpireButton
            label="Bonus pub x2"
            tone="dark"
            onPress={() => dispatch({ type: 'claimRewardAd', reward: 'doubleIncome' })}
          />
        </View>
      </PremiumCard>

      {status === 'suspendu' ? (
        <PremiumCard style={styles.suspendedCard}>
          <Text style={styles.cardTitle}>Entreprise suspendue</Text>
          <Text style={styles.muted}>{getEnterpriseCause(business)}</Text>
          <Text style={styles.muted}>Seuil audit : € {formatMoney(taxLimit)}</Text>
          <EmpireButton
            label={`Payer € ${formatMoney(business.enterpriseTaxDebt)}`}
            tone="danger"
            disabled={state.cash < business.enterpriseTaxDebt}
            onPress={() => dispatch({ type: 'payBusinessTax', id: business.id })}
          />
        </PremiumCard>
      ) : null}
    </View>
  );
}

function EnterpriseMergers({
  state,
  stats,
  businesses,
  dispatch,
}: {
  state: EmpireState;
  stats: EmpireStats;
  businesses: BusinessAsset[];
  dispatch: React.Dispatch<EmpireAction>;
}) {
  const hasSector = (sector: string, minLevel = 1) =>
    businesses.some((business) => business.sector === sector && business.level >= minLevel);
  const hasNamed = (pattern: RegExp, minLevel = 1) =>
    businesses.some((business) => pattern.test(business.name) && business.level >= minLevel);

  const mergers = [
    {
      title: 'Industrie hoteliere',
      target: /Hotel|Hospitalite|Lounge/i,
      cost: 50000000,
      ready: hasSector('Hospitalite', 10) && stats.realEstateOwned >= 5,
      conditions: ['Revenus taxis requis', 'Valeur immobilier requise', 'Ile privee recommandee'],
      bonus: '+8% revenus hospitalite et immobilier',
    },
    {
      title: 'Plateforme blockchain',
      target: /Fintech|IA|Technologie|Blockchain/i,
      cost: 85000000,
      ready: hasSector('Technologie', 8) && stats.marketUnits >= 3,
      conditions: ['Entreprise informatique requise', 'Portefeuille crypto requis'],
      bonus: '+10% revenus tech et trading',
    },
    {
      title: 'Agence spatiale',
      target: /Spatial|orbital|Groupe/i,
      cost: 250000000,
      ready: hasNamed(/Groupe|Spatial|orbital/i) || (hasSector('Transport', 8) && hasSector('Creation', 8)),
      conditions: ['Grande usine requise', 'Transport requis', 'Construction requise'],
      bonus: '+15% revenus endgame',
    },
    {
      title: 'Societe holding',
      target: /Banque|Capital|Holding|Finance/i,
      cost: 180000000,
      ready: hasSector('Finance', 10) && stats.marketInvested > 1000000,
      conditions: ['Banque requise', 'Portefeuille actions requis'],
      bonus: '+12% synergies entreprises',
    },
  ];

  return (
    <View style={styles.gap}>
      <Text style={styles.sectionLabel}>Fusions d&apos;entreprises</Text>
      {mergers.map((merger) => {
        const target = businesses.find((business) => merger.target.test(business.name)) ?? businesses.find((business) => business.level > 0);
        const canOpen = merger.ready && target && state.cash >= merger.cost;
        return (
          <PremiumCard key={merger.title} style={merger.ready ? styles.mergerReady : styles.mergerLocked}>
            <Text style={styles.cardTitle}>{merger.title}</Text>
            {merger.conditions.map((condition) => (
              <Text key={condition} style={styles.muted}>- {condition}</Text>
            ))}
            <Text style={styles.income}>{merger.bonus}</Text>
            <Text style={styles.price}>Investissement : € {formatMoney(merger.cost)}</Text>
            <EmpireButton
              label={merger.ready ? 'Lancer fusion' : 'Conditions manquantes'}
              disabled={!canOpen}
              onPress={() => target && dispatch({ type: 'upgradeBusiness', id: target.id })}
            />
          </PremiumCard>
        );
      })}
    </View>
  );
}

function EnterpriseRow({
  business,
  income,
  dispatch,
  onSelect,
  preview,
}: {
  business: BusinessAsset;
  income: number;
  dispatch: React.Dispatch<EmpireAction>;
  onSelect: (id: string) => void;
  preview?: boolean;
}) {
  const status = getEnterpriseStatus(business);
  return (
    <PremiumCard style={preview && styles.previewCard}>
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
          <Text style={styles.meta}>{business.sector} - Etape {business.level}</Text>
          <Text style={styles.income}>€ {formatMoney(income)} / sec</Text>
          <Text style={styles.muted}>{getEnterpriseCause(business)}</Text>
        </View>
        <StatusPill status={status} />
      </View>
      <View style={styles.actionRow}>
        <EmpireButton label="Détail" tone="dark" onPress={() => onSelect(business.id)} />
        {business.level <= 0 ? (
          <EmpireButton
            label="Fonder"
            onPress={() => dispatch({ type: 'upgradeBusiness', id: business.id })}
          />
        ) : null}
      </View>
    </PremiumCard>
  );
}

function ModeTab({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={[styles.modeTab, active && styles.modeTabActive]}>
      <Text style={[styles.modeText, active && styles.modeTextActive]}>{label}</Text>
    </Pressable>
  );
}

function StatusPill({ status }: { status: EnterpriseStatus }) {
  const statusStyle = {
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

function ProgressBar({ value }: { value: number }) {
  return (
    <View style={styles.progressTrack}>
      <View style={[styles.progressFill, { width: `${Math.max(4, Math.min(100, value))}%` }]} />
    </View>
  );
}

function Kpi({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.kpi}>
      <Text style={styles.kpiLabel}>{label}</Text>
      <Text style={styles.kpiValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  gap: { gap: 12 },
  modeRow: { flexDirection: 'row', gap: 8 },
  modeTab: {
    flex: 1,
    minHeight: 42,
    borderRadius: premium.radius.sm,
    borderWidth: 1,
    borderColor: premium.colors.line,
    backgroundColor: premium.colors.panelSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modeTabActive: {
    borderColor: premium.colors.goldBright,
    backgroundColor: 'rgba(242, 200, 107, 0.16)',
  },
  modeText: { color: premium.colors.muted, fontSize: 12, fontWeight: '900' },
  modeTextActive: { color: premium.colors.goldBright },
  hero: { backgroundColor: premium.colors.panelElevated },
  heroLabel: { color: premium.colors.muted, fontSize: 12, fontWeight: '900', textTransform: 'uppercase' },
  heroValue: { color: premium.colors.goldBright, fontSize: 30, fontWeight: '900', marginTop: 6 },
  heroSub: { color: premium.colors.champagne, fontSize: 13, fontWeight: '800', marginTop: 6 },
  sectionLabel: { color: premium.colors.goldBright, fontSize: 15, fontWeight: '900', textTransform: 'uppercase' },
  row: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  info: { flex: 1, minWidth: 0 },
  title: { color: premium.colors.text, fontSize: 16, fontWeight: '900' },
  detailTitle: { color: premium.colors.text, fontSize: 26, fontWeight: '900', marginTop: 12 },
  meta: { color: premium.colors.muted, fontSize: 12, marginTop: 4 },
  detailMeta: { color: premium.colors.muted, fontSize: 13, marginTop: 7 },
  muted: { color: premium.colors.muted, fontSize: 12, lineHeight: 18, marginTop: 6 },
  income: { color: premium.colors.success, fontSize: 13, fontWeight: '800', marginTop: 6 },
  price: { color: premium.colors.goldBright, fontSize: 13, fontWeight: '900', marginTop: 8 },
  unlock: { color: premium.colors.muted, fontSize: 11, fontWeight: '800', marginTop: 6 },
  side: { alignItems: 'flex-end', maxWidth: 110 },
  actionRow: { flexDirection: 'row', gap: 8, marginTop: 14 },
  foundCard: { backgroundColor: premium.colors.panel },
  previewCard: { opacity: 0.9 },
  detailHero: { backgroundColor: premium.colors.panelElevated, borderColor: premium.colors.lineStrong },
  cardTitle: { color: premium.colors.text, fontSize: 18, fontWeight: '900' },
  progressTrack: { height: 8, borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.08)', marginTop: 12, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 999, backgroundColor: premium.colors.goldBright },
  kpiGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 },
  kpi: { width: '48%', borderRadius: premium.radius.sm, borderWidth: 1, borderColor: premium.colors.line, padding: 10 },
  kpiLabel: { color: premium.colors.muted, fontSize: 11, fontWeight: '800' },
  kpiValue: { color: premium.colors.goldBright, fontSize: 16, fontWeight: '900', marginTop: 6 },
  statusPill: { borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6, borderWidth: 1, alignSelf: 'flex-start' },
  statusText: { color: premium.colors.text, fontSize: 10, fontWeight: '900', textTransform: 'uppercase' },
  status_rentable: { borderColor: 'rgba(34,197,94,0.55)', backgroundColor: 'rgba(34,197,94,0.16)' },
  status_attente: { borderColor: 'rgba(245,158,11,0.55)', backgroundColor: 'rgba(245,158,11,0.16)' },
  status_suspendu: { borderColor: 'rgba(248,113,113,0.55)', backgroundColor: 'rgba(127,29,29,0.30)' },
  status_construction: { borderColor: 'rgba(96,165,250,0.55)', backgroundColor: 'rgba(30,64,175,0.24)' },
  suspendedCard: { borderColor: 'rgba(248,113,113,0.55)', backgroundColor: 'rgba(127,29,29,0.26)' },
  mergerReady: { borderColor: premium.colors.goldBright, backgroundColor: premium.colors.panelElevated },
  mergerLocked: { backgroundColor: premium.colors.panelSoft },
  emptyTitle: { color: premium.colors.text, fontSize: 17, fontWeight: '900' },
});
