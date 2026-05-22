import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { EmpireButton } from '@/components/empire/EmpireButton';
import { formatDuration, formatMoney } from '@/utils/format';
import { PremiumCard } from '@/components/empire/PremiumCard';
import { SectionHeader } from '@/components/empire/SectionHeader';
import { premium } from '@/utils/premiumTheme';
import { EmpireAction } from '@/game/reducer';
import { BusinessAsset, EmpireState, EmpireStats, EmpireTab, MarketAsset } from '@/game/types';
import { getBusinessFoundingCost } from '@/utils/progression';
import { getEnterpriseIncome } from '@/utils/enterprise';

type RewardNotification = {
  id: string;
  title: string;
  detail: string;
  amount: number;
  action: () => void;
};

type Props = {
  state: EmpireState;
  stats: EmpireStats;
  onNavigate: (tab: EmpireTab) => void;
  onPrestige: () => void;
  dispatch: React.Dispatch<EmpireAction>;
  onReset: () => void;
};

export function DashboardScreen({ state, stats, onNavigate, onPrestige, dispatch, onReset }: Props) {
  const canPrestige = stats.nextPrestigePoints > 0;
  const today = new Date().toISOString().slice(0, 10);
  const dailyReady = state.dailyRewards.lastDailyRewardDay !== today;
  const chestReady = state.dailyRewards.lastChestDay !== today;
  const wheelReady = state.dailyRewards.lastWheelDay !== today;
  const connectionReady = state.dailyRewards.lastConnectionBonusDay !== today;
  const availableRewards: RewardNotification[] = [];
  const alphaGuide = getAlphaGuide(state, stats, availableRewards.length);

  if (dailyReady) {
    availableRewards.push({
      id: 'daily',
      title: 'Récompense quotidienne',
      detail: `Série ${state.dailyRewards.streak + 1} jour(s)`,
      amount: 25000 * Math.min(state.dailyRewards.streak + 1, 30),
      action: () => dispatch({ type: 'claimDailyReward' }),
    });
  }

  if (connectionReady) {
    availableRewards.push({
      id: 'return',
      title: 'Bonus de retour',
      detail: 'Disponible maintenant',
      amount: Math.max(15000, Math.floor(stats.totalIncome * 120)),
      action: () => dispatch({ type: 'claimConnectionBonus' }),
    });
  }

  if (chestReady) {
    availableRewards.push({
      id: 'chest',
      title: 'Coffre quotidien',
      detail: 'Bonus cash empire',
      amount: Math.max(50000, Math.floor(stats.totalIncome * 240)),
      action: () => dispatch({ type: 'openDailyChest' }),
    });
  }

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
          <Text style={styles.heroMetric}>Prestige x{stats.prestigeMultiplier.toFixed(2)}</Text>
        </View>
      </PremiumCard>

      <SectionHeader title="Vue empire" subtitle="Les indicateurs principaux de rentabilite." />

      <PremiumCard style={styles.alphaGuideCard}>
        <View style={styles.alphaGuideTop}>
          <Text style={styles.cardTitle}>Alpha Guide</Text>
          <Text style={styles.alphaBadge}>Action rapide</Text>
        </View>
        <Text style={styles.alphaTitle}>{alphaGuide.title}</Text>
        <Text style={styles.line}>{alphaGuide.detail}</Text>
        <View style={styles.alphaMetrics}>
          <MiniMetric label="Cash" value={`€ ${formatMoney(state.cash)}`} />
          <MiniMetric label="Dans" value={`${Math.ceil(stats.passivePayoutSecondsRemaining)} sec`} />
          <MiniMetric label="Prochain" value={`€ ${formatMoney(stats.nextPassivePayout)}`} />
        </View>
        <View style={styles.quickActions}>
          <EmpireButton label={alphaGuide.primaryLabel} onPress={() => onNavigate(alphaGuide.primaryTab)} />
          <EmpireButton label="Récompenses" tone="dark" onPress={() => onNavigate('dashboard')} />
        </View>
      </PremiumCard>

      <PremiumCard style={availableRewards.length > 0 ? styles.notificationCard : undefined}>
        <Text style={styles.cardTitle}>Notifications internes</Text>
        {availableRewards.length > 0 ? (
          <>
            <Text style={styles.rewardAvailable}>Récompense disponible</Text>
            {availableRewards.map((reward) => (
              <View key={reward.id} style={styles.notificationRow}>
                <View style={styles.notificationText}>
                  <Text style={styles.dailyTitle}>{reward.title}</Text>
                  <Text style={styles.line}>{reward.detail} - € {formatMoney(reward.amount)}</Text>
                </View>
                <EmpireButton label="Récupérer" onPress={reward.action} />
              </View>
            ))}
          </>
        ) : (
          <Text style={styles.line}>Aucune récompense en attente.</Text>
        )}
        {state.dailyRewards.rewardHistory.length > 0 ? (
          <View style={styles.historyBlock}>
            <Text style={styles.historyTitle}>Historique</Text>
            {state.dailyRewards.rewardHistory.slice(0, 5).map((reward) => (
              <Text key={reward.id} style={styles.historyLine}>
                {reward.label} : € {formatMoney(reward.amount)}
              </Text>
            ))}
          </View>
        ) : null}
      </PremiumCard>

      <View style={styles.grid}>
        <Stat label="Patrimoine" value={`€ ${formatMoney(stats.netWorth)}`} />
        <Stat label="Revenu / sec" value={`€ ${formatMoney(stats.netIncomePerSecond)} / sec`} />
        <Stat label="Prochain paiement" value={`€ ${formatMoney(stats.nextPassivePayout)}`} />
        <Stat label="Timer paiement" value={`${Math.ceil(stats.passivePayoutSecondsRemaining)} sec`} />
        <Stat label="Banque" value={`€ ${formatMoney(state.bank)}`} />
        <Stat label="Dette" value={`€ ${formatMoney(state.debt)}`} tone="danger" />
        <Stat label="Impots" value={`€ ${formatMoney(state.taxDebt)}`} tone={state.taxDebt > 0 ? 'danger' : undefined} />
        <Stat label="Prestige" value={`${state.prestigeCount} reset`} />
      </View>

      <PremiumCard style={styles.prestigeCard}>
        <Text style={styles.cardTitle}>Prestige infini</Text>
        <Text style={styles.line}>Points disponibles : {state.prestigePoints.toLocaleString('fr-FR')}</Text>
        <Text style={styles.line}>Bonus permanent : x{stats.prestigeMultiplier.toFixed(2)} revenus</Text>
        <Text style={styles.line}>Prochain prestige : +{stats.nextPrestigePoints.toLocaleString('fr-FR')} points</Text>
        <Text style={styles.line}>Meilleur patrimoine : € {formatMoney(state.highestNetWorth)}</Text>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${Math.min(100, stats.netWorth / 1000000000 * 100)}%` }]} />
        </View>
        <View style={styles.prestigeActions}>
          <EmpireButton
            label={canPrestige ? 'Lancer prestige' : 'Prestige a 1Md'}
            tone={canPrestige ? 'gold' : 'dark'}
            disabled={!canPrestige}
            onPress={onPrestige}
          />
        </View>
      </PremiumCard>

      <PremiumCard style={styles.rewardCard}>
        <Text style={styles.cardTitle}>Recompenses quotidiennes</Text>
        <Text style={styles.line}>Serie : {state.dailyRewards.streak} jours</Text>
        <View style={styles.quickActions}>
          <EmpireButton
            label={dailyReady ? 'Reward jour' : 'Deja pris'}
            disabled={!dailyReady}
            onPress={() => dispatch({ type: 'claimDailyReward' })}
          />
          <EmpireButton
            label={chestReady ? 'Coffre' : 'Coffre pris'}
            tone="dark"
            disabled={!chestReady}
            onPress={() => dispatch({ type: 'openDailyChest' })}
          />
        </View>
        <View style={styles.quickActions}>
          <EmpireButton
            label={wheelReady ? 'Roue chance' : 'Roue prise'}
            onPress={() => dispatch({ type: 'spinLuckyWheel' })}
            disabled={!wheelReady}
          />
          <EmpireButton
            label={connectionReady ? 'Bonus connexion' : 'Bonus pris'}
            tone="dark"
            disabled={!connectionReady}
            onPress={() => dispatch({ type: 'claimConnectionBonus' })}
          />
        </View>
      </PremiumCard>

      <PremiumCard>
        <Text style={styles.cardTitle}>Missions quotidiennes</Text>
        {state.dailyRewards.dailyMissions.map((mission) => {
          const progress = getDailyMissionProgress(mission.id, state, stats);
          const done = progress >= mission.target;
          const claimed = mission.claimedDay === today;
          return (
            <View key={mission.id} style={styles.dailyMission}>
              <View style={styles.dailyMissionTop}>
                <Text style={styles.dailyTitle}>{mission.title}</Text>
                <Text style={styles.dailyReward}>€ {formatMoney(mission.reward)}</Text>
              </View>
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: `${Math.min(100, progress / mission.target * 100)}%` }]} />
              </View>
              <EmpireButton
                label={claimed ? 'Reclamee' : done ? 'Reclamer' : `${Math.min(progress, mission.target).toLocaleString('fr-FR')}/${mission.target.toLocaleString('fr-FR')}`}
                tone={done && !claimed ? 'gold' : 'dark'}
                disabled={!done || claimed}
                onPress={() => dispatch({ type: 'claimDailyMission', id: mission.id })}
              />
            </View>
          );
        })}
      </PremiumCard>

      {state.economyEvent ? (
        <PremiumCard style={state.economyEvent.tone === 'crash' ? styles.crashCard : styles.eventCard}>
          <Text style={styles.cardTitle}>{state.economyEvent.title}</Text>
          <Text style={styles.line}>{state.economyEvent.description}</Text>
          <Text style={styles.line}>Fin dans {state.economyEvent.secondsRemaining}s</Text>
        </PremiumCard>
      ) : null}

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
          <EmpireButton label="Entreprise" onPress={() => onNavigate('business')} />
          <EmpireButton label="Invest" tone="dark" onPress={() => onNavigate('investments')} />
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

function MiniMetric({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.miniMetric}>
      <Text style={styles.miniLabel}>{label}</Text>
      <Text style={styles.miniValue} numberOfLines={1} adjustsFontSizeToFit>
        {value}
      </Text>
    </View>
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
  alphaGuideCard: {
    borderColor: premium.colors.lineStrong,
    backgroundColor: premium.colors.panelElevated,
  },
  alphaGuideTop: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  alphaBadge: {
    color: '#110D05',
    backgroundColor: premium.colors.goldBright,
    borderRadius: premium.radius.sm,
    overflow: 'hidden',
    paddingHorizontal: 9,
    paddingVertical: 5,
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  alphaTitle: {
    color: premium.colors.goldBright,
    fontSize: 17,
    fontWeight: '900',
    marginTop: 10,
  },
  alphaMetrics: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  miniMetric: {
    flex: 1,
    borderWidth: 1,
    borderColor: premium.colors.line,
    borderRadius: premium.radius.sm,
    padding: 9,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  miniLabel: {
    color: premium.colors.muted,
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  miniValue: {
    color: premium.colors.champagne,
    fontSize: 13,
    fontWeight: '900',
    marginTop: 5,
  },
  dangerLine: {
    color: premium.colors.danger,
    fontSize: 14,
    fontWeight: '800',
    marginTop: 8,
  },
  prestigeCard: {
    borderColor: premium.colors.lineStrong,
    backgroundColor: premium.colors.panelElevated,
  },
  prestigeActions: {
    marginTop: 14,
  },
  rewardCard: {
    borderColor: premium.colors.goldBright,
    backgroundColor: 'rgba(242, 200, 107, 0.10)',
  },
  notificationCard: {
    borderColor: premium.colors.goldBright,
    backgroundColor: 'rgba(242, 200, 107, 0.09)',
  },
  rewardAvailable: {
    color: premium.colors.goldBright,
    fontSize: 13,
    fontWeight: '900',
    marginTop: 8,
    textTransform: 'uppercase',
  },
  notificationRow: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 12,
    paddingTop: 12,
  },
  notificationText: {
    flex: 1,
    minWidth: 0,
  },
  historyBlock: {
    marginTop: 14,
  },
  historyTitle: {
    color: premium.colors.text,
    fontSize: 13,
    fontWeight: '900',
  },
  historyLine: {
    color: premium.colors.muted,
    fontSize: 12,
    marginTop: 6,
  },
  eventCard: {
    borderColor: premium.colors.goldBright,
    backgroundColor: premium.colors.panelElevated,
  },
  crashCard: {
    borderColor: 'rgba(248, 113, 113, 0.5)',
    backgroundColor: 'rgba(127, 29, 29, 0.26)',
  },
  dailyMission: {
    gap: 10,
    marginTop: 14,
  },
  dailyMissionTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  dailyTitle: {
    color: premium.colors.text,
    flex: 1,
    fontSize: 13,
    fontWeight: '900',
  },
  dailyReward: {
    color: premium.colors.goldBright,
    fontSize: 13,
    fontWeight: '900',
  },
  progressTrack: {
    height: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: premium.colors.goldBright,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 14,
  },
});

const getDailyMissionProgress = (
  id: 'income' | 'invest' | 'asset',
  state: EmpireState,
  stats: EmpireStats,
) => {
  if (id === 'income') return state.totalEarned;
  if (id === 'invest') return stats.marketUnits;
  return stats.realEstateOwned + stats.carsOwned + stats.luxuryOwned + stats.collectionsOwned;
};

const getAlphaGuide = (
  state: EmpireState,
  stats: EmpireStats,
  rewardCount: number,
): { title: string; detail: string; primaryLabel: string; primaryTab: EmpireTab } => {
  if (rewardCount > 0) {
    return {
      title: `${rewardCount} récompense(s) à récupérer`,
      detail: 'Récupère les bonus gratuits avant d’acheter ou améliorer. C’est le meilleur boost sans risque.',
      primaryLabel: 'Voir accueil',
      primaryTab: 'dashboard',
    };
  }

  const bestBusinessBuy = findBestBusinessBuy(state, stats);

  if (stats.businessLevels === 0 && bestBusinessBuy) {
    return {
      title: `Fonde ${bestBusinessBuy.business.name}`,
      detail: `Coût € ${formatMoney(bestBusinessBuy.cost)}. Paiement estimé toutes les 40 sec : € ${formatMoney(bestBusinessBuy.payout40)}.`,
      primaryLabel: 'Entreprise',
      primaryTab: 'business',
    };
  }

  const upgradeTarget = findBestBusinessUpgrade(state, stats);

  if (upgradeTarget) {
    return {
      title: `Améliore ${upgradeTarget.business.name}`,
      detail: `Meilleur ROI actuel : +€ ${formatMoney(upgradeTarget.gainPerSecond)} / sec pour € ${formatMoney(upgradeTarget.cost)}.`,
      primaryLabel: 'Améliorer',
      primaryTab: 'business',
    };
  }

  if (bestBusinessBuy) {
    return {
      title: `Nouvelle activité rentable`,
      detail: `${bestBusinessBuy.business.name} peut ajouter environ € ${formatMoney(bestBusinessBuy.payout40)} toutes les 40 sec.`,
      primaryLabel: 'Acheter',
      primaryTab: 'business',
    };
  }

  const investmentTarget = findBestInvestment(state);
  if (investmentTarget && state.cash >= investmentTarget.price) {
    return {
      title: `Investissement intéressant`,
      detail: `${investmentTarget.name} est en momentum positif. Prix actuel : € ${formatMoney(investmentTarget.price)}.`,
      primaryLabel: 'Investir',
      primaryTab: 'investments',
    };
  }

  if (stats.nextPassivePayout > 0) {
    return {
      title: `Prochain paiement : € ${formatMoney(stats.nextPassivePayout)}`,
      detail: 'Attends le paiement passif, puis réinvestis dans Entreprise ou Investissements pour accélérer.',
      primaryLabel: 'Investir',
      primaryTab: 'investments',
    };
  }

  return {
    title: 'Démarre ton empire',
    detail: 'Va dans Entreprise pour acheter une première activité, puis utilise les revenus pour diversifier.',
    primaryLabel: 'Entreprise',
    primaryTab: 'business',
  };
};

const findBestBusinessBuy = (state: EmpireState, stats: EmpireStats) =>
  state.businesses
    .filter((business) => business.level <= 0)
    .map((business) => {
      const cost = getBusinessFoundingCost(business);
      const income = getEnterpriseIncome({ ...business, level: 1, projectProgress: 100 }, stats.totalRevenueMultiplier);
      return {
        business,
        cost,
        payout40: income * 40,
        score: income / Math.max(1, cost),
      };
    })
    .filter((item) => state.cash >= item.cost)
    .sort((left, right) => right.score - left.score)[0];

const findBestBusinessUpgrade = (state: EmpireState, stats: EmpireStats) =>
  state.businesses
    .filter((business) => business.level > 0 && business.level < 50)
    .map((business) => {
      const cost = getBusinessFoundingCost(business);
      const currentIncome = getEnterpriseIncome(business, stats.totalRevenueMultiplier);
      const nextIncome = getEnterpriseIncome(getBusinessAfterUpgrade(business), stats.totalRevenueMultiplier);
      const gainPerSecond = Math.max(0, nextIncome - currentIncome);
      return {
        business,
        cost,
        gainPerSecond,
        score: gainPerSecond / Math.max(1, cost),
      };
    })
    .filter((item) => state.cash >= item.cost && item.gainPerSecond > 0)
    .sort((left, right) => right.score - left.score)[0];

const getBusinessAfterUpgrade = (business: BusinessAsset): BusinessAsset => ({
  ...business,
  level: Math.min(50, business.level + 1),
  employees: business.employees + 2,
  vehicles:
    business.vehicles +
    (/Transport|Hospitalite/.test(business.sector) || /taxi|transport|concession|flotte/i.test(business.name) ? 1 : 0),
  buildings: business.buildings + (business.level > 0 && business.level % 5 === 0 ? 1 : 0),
  projectProgress: business.level <= 0 ? 100 : business.projectProgress,
});

const findBestInvestment = (state: EmpireState): MarketAsset | undefined =>
  state.market
    .filter((asset) => asset.price > 0 && asset.momentum > 0 && asset.price <= state.cash)
    .sort((left, right) => right.momentum - left.momentum)[0];
