import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { EmpireButton } from '@/components/empire/EmpireButton';
import { PremiumCard } from '@/components/empire/PremiumCard';
import { SectionHeader } from '@/components/empire/SectionHeader';
import { EmpireAction } from '@/game/reducer';
import { EmpireState, EmpireStats } from '@/game/types';
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
  const totalGoods =
    stats.realEstateOwned + stats.carsOwned + stats.luxuryOwned + stats.collectionsOwned;
  const profile = state.playerProfile;
  const bonusActive = state.adRewards.bonusSecondsRemaining > 0;

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
            label="Google"
            onPress={() => dispatch({ type: 'connectPlayer', provider: 'google' })}
          />
          <EmpireButton
            label="Apple"
            tone="dark"
            onPress={() => dispatch({ type: 'connectPlayer', provider: 'apple' })}
          />
        </View>
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
        <Text style={styles.line}>Cash gagne : € {formatMoney(state.adRewards.totalAdCashEarned)}</Text>
        <Text style={styles.line}>
          Bonus x2 : {bonusActive ? `${state.adRewards.bonusSecondsRemaining}s` : 'inactif'}
        </Text>
        <View style={styles.actions}>
          <EmpireButton
            label="Pub recompensee"
            onPress={() => dispatch({ type: 'claimRewardAd', reward: 'cash' })}
          />
          <EmpireButton
            label="Bonus x2"
            tone="dark"
            onPress={() => dispatch({ type: 'claimRewardAd', reward: 'doubleIncome' })}
          />
        </View>
        <View style={styles.actions}>
          <EmpireButton
            label="Cash gratuit"
            onPress={() => dispatch({ type: 'claimRewardAd', reward: 'cash' })}
          />
          <EmpireButton
            label="Skip temps"
            tone="dark"
            onPress={() => dispatch({ type: 'claimRewardAd', reward: 'skipTime' })}
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
        <Text style={styles.line}>AdMob : pret pour react-native-google-mobile-ads</Text>
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
