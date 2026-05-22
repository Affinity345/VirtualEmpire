import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import {
  getAdCooldownRemaining,
  getRewardedAdBlockReason,
  getRewardedAdRewardCash,
  getRewardedAdsWatchedToday,
  showRewardedAd,
} from '@/ads/adMob';
import { EmpireButton } from '@/components/empire/EmpireButton';
import { PremiumCard } from '@/components/empire/PremiumCard';
import { SectionHeader } from '@/components/empire/SectionHeader';
import { EmpireAction } from '@/game/reducer';
import { AdRewardType, EmpireState, EmpireStats } from '@/game/types';
import { formatDuration, formatMoney } from '@/utils/format';
import { premium } from '@/utils/premiumTheme';

type Props = {
  state: EmpireState;
  stats: EmpireStats;
  dispatch: React.Dispatch<EmpireAction>;
  onSaveCloud: () => void;
  onRecoverCloud: () => void;
};

export function ProfileScreen({ state, stats, dispatch, onSaveCloud, onRecoverCloud }: Props) {
  const [adMessage, setAdMessage] = useState<string | undefined>();
  const [loadingReward, setLoadingReward] = useState<AdRewardType | undefined>();
  const [now, setNow] = useState(Date.now());
  const totalGoods =
    stats.realEstateOwned + stats.carsOwned + stats.luxuryOwned + stats.collectionsOwned;
  const profile = state.playerProfile;
  const bonusActive = state.adRewards.bonusSecondsRemaining > 0;
  const cooldown = getAdCooldownRemaining(state.adRewards, now);
  const watchedToday = getRewardedAdsWatchedToday(state.adRewards);
  const blockReason = getRewardedAdBlockReason(state.adRewards, now);
  const rewardCash = getRewardedAdRewardCash('cash', stats);
  const skipCash = getRewardedAdRewardCash('skipTime', stats);

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const requestReward = async (reward: AdRewardType) => {
    const reason = getRewardedAdBlockReason(state.adRewards);
    if (reason) {
      setAdMessage(reason);
      return;
    }

    setLoadingReward(reward);
    const result = await showRewardedAd();
    setLoadingReward(undefined);
    setAdMessage(result.message);

    if (result.completed) {
      dispatch({ type: 'claimRewardAd', reward });
    }
  };

  return (
    <View style={styles.gap}>
      <SectionHeader
        title="Profil joueur"
        subtitle="Compte, cloud, statistiques et monetisation mobile prets pour la version publiee."
      />

      <PremiumCard style={styles.profileCard}>
        <Text style={styles.kicker}>{profile ? 'Compte connecte' : 'Compte invite'}</Text>
        <Text style={styles.profileName}>{profile?.name ?? 'Joueur Virtual Empire'}</Text>
        <Text style={styles.line}>
          Statut cloud : {profile?.cloudLinked ? 'pret' : 'connexion requise'}
        </Text>
        <View style={styles.actions}>
          <EmpireButton
            label="Google bientôt disponible"
            disabled
            onPress={() => setAdMessage('Connexion Google bientôt disponible')}
          />
          <EmpireButton
            label="Apple bientôt disponible"
            tone="dark"
            disabled
            onPress={() => setAdMessage('Connexion Apple bientôt disponible')}
          />
        </View>
        <Text style={styles.line}>
          Connexion Google / Apple désactivée en alpha : architecture préparée, Firebase/Auth pas encore branché.
        </Text>
        {profile ? (
          <View style={styles.actions}>
            <EmpireButton label="Sauvegarder cloud" onPress={onSaveCloud} />
            <EmpireButton label="Recuperer" tone="dark" onPress={onRecoverCloud} />
          </View>
        ) : null}
      </PremiumCard>

      <PremiumCard>
        <Text style={styles.cardTitle}>Statistiques joueur</Text>
        <StatRow label="Fortune totale" value={`€ ${formatMoney(stats.netWorth)}`} />
        <StatRow label="Revenus totaux" value={`€ ${formatMoney(state.totalEarned)}`} />
        <StatRow label="Revenu / sec" value={`€ ${formatMoney(stats.totalIncome)} / sec`} />
        <StatRow label="Nombre de biens" value={totalGoods.toLocaleString('fr-FR')} />
        <StatRow label="Niveau prestige" value={state.prestigeCount.toString()} />
        <StatRow label="Temps joue" value={formatDuration(state.secondsPlayed)} />
      </PremiumCard>

      <PremiumCard style={styles.adsCard}>
        <Text style={styles.cardTitle}>Bonus pubs</Text>
        <Text style={styles.line}>Pubs vues : {state.adRewards.rewardedAdsWatched}</Text>
        <Text style={styles.line}>
          {"Aujourd'hui"} : {watchedToday}/{state.adRewards.rewardedAdDailyLimit}
        </Text>
        <Text style={styles.line}>Cash gagne : € {formatMoney(state.adRewards.totalAdCashEarned)}</Text>
        <Text style={styles.line}>
          Bonus x2 : {bonusActive ? `${state.adRewards.bonusSecondsRemaining}s` : 'inactif'}
        </Text>
        <Text style={styles.line}>
          Cooldown : {cooldown > 0 ? `${cooldown}s` : 'pret'}
        </Text>
        <Text style={styles.line}>
          Reward cash : € {formatMoney(rewardCash)} - Skip temps : € {formatMoney(skipCash)}
        </Text>
        {adMessage || state.adRewards.lastRewardedAdStatus ? (
          <Text style={styles.adStatus}>{adMessage ?? state.adRewards.lastRewardedAdStatus}</Text>
        ) : null}
        <View style={styles.actions}>
          <EmpireButton
            label={loadingReward === 'cash' ? 'Chargement...' : 'Pub recompensee'}
            disabled={Boolean(blockReason) || Boolean(loadingReward)}
            onPress={() => requestReward('cash')}
          />
          <EmpireButton
            label={loadingReward === 'doubleIncome' ? 'Chargement...' : 'Bonus x2'}
            tone="dark"
            disabled={Boolean(blockReason) || Boolean(loadingReward)}
            onPress={() => requestReward('doubleIncome')}
          />
        </View>
        <View style={styles.actions}>
          <EmpireButton
            label="Cash gratuit"
            disabled={Boolean(blockReason) || Boolean(loadingReward)}
            onPress={() => requestReward('cash')}
          />
          <EmpireButton
            label={loadingReward === 'skipTime' ? 'Chargement...' : 'Skip temps'}
            tone="dark"
            disabled={Boolean(blockReason) || Boolean(loadingReward)}
            onPress={() => requestReward('skipTime')}
          />
        </View>
        <EmpireButton
          label={state.adRewards.noAds ? 'NO ADS actif' : 'NO ADS'}
          tone={state.adRewards.noAds ? 'dark' : 'gold'}
          disabled={state.adRewards.noAds}
          onPress={() => dispatch({ type: 'buyNoAds' })}
        />
      </PremiumCard>

      <PremiumCard>
        <Text style={styles.cardTitle}>Integrations mobiles</Text>
        <Text style={styles.line}>Google Sign-In : pret pour @react-native-google-signin/google-signin</Text>
        <Text style={styles.line}>Apple Sign-In : pret pour expo-apple-authentication</Text>
        <Text style={styles.line}>AdMob : architecture Rewarded Ads prête, vraie pub active seulement en build natif/dev-client</Text>
        <Text style={styles.line}>Achats integres : pret pour RevenueCat / react-native-purchases</Text>
      </PremiumCard>
    </View>
  );
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.statRow}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  gap: {
    gap: 12,
  },
  profileCard: {
    backgroundColor: premium.colors.panelElevated,
  },
  adsCard: {
    borderColor: premium.colors.lineStrong,
    backgroundColor: premium.colors.panelElevated,
  },
  kicker: {
    color: premium.colors.goldBright,
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  profileName: {
    color: premium.colors.text,
    fontSize: 24,
    fontWeight: '900',
    marginTop: 6,
  },
  cardTitle: {
    color: premium.colors.text,
    fontSize: 18,
    fontWeight: '900',
  },
  line: {
    color: premium.colors.muted,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 8,
  },
  adStatus: {
    color: premium.colors.goldBright,
    fontSize: 13,
    fontWeight: '900',
    marginTop: 10,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 14,
  },
  statRow: {
    minHeight: 36,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  statLabel: {
    color: premium.colors.muted,
    fontSize: 13,
  },
  statValue: {
    color: premium.colors.goldBright,
    fontSize: 14,
    fontWeight: '900',
    textAlign: 'right',
  },
});
