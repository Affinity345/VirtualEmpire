import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { EmpireButton } from '@/components/empire/EmpireButton';
import { formatDuration, formatMoney } from '@/utils/format';
import { PremiumCard } from '@/components/empire/PremiumCard';
import { SectionHeader } from '@/components/empire/SectionHeader';
import { premium } from '@/utils/premiumTheme';
import { EmpireAction } from '@/game/reducer';
import { EmpireState, EmpireStats, EmpireTab } from '@/game/types';

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

      <View style={styles.grid}>
        <Stat label="Patrimoine" value={`€ ${formatMoney(stats.netWorth)}`} />
        <Stat label="Revenu passif" value={`€ ${formatMoney(stats.totalIncome)} / sec`} />
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
