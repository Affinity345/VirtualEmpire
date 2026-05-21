import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { EmpireButton } from '@/components/empire/EmpireButton';
import { formatMoney } from '@/utils/format';
import { PremiumCard } from '@/components/empire/PremiumCard';
import { SectionHeader } from '@/components/empire/SectionHeader';
import { premium } from '@/utils/premiumTheme';
import { EmpireAction } from '@/game/reducer';
import { getMetricValue } from '@/game/selectors';
import { EmpireState } from '@/game/types';

type Props = {
  state: EmpireState;
  dispatch: React.Dispatch<EmpireAction>;
};

export function MissionsScreen({ state, dispatch }: Props) {
  return (
    <View style={styles.gap}>
      <SectionHeader title="Missions" subtitle="Objectifs courts pour guider la croissance et injecter des recompenses." />
      {state.missions.map((mission) => {
        const current = getMetricValue(state, mission.metric);
        const complete = current >= mission.target;
        return (
          <PremiumCard key={mission.id}>
            <View style={styles.row}>
              <View style={styles.info}>
                <Text style={styles.title}>{mission.title}</Text>
                <Text style={styles.meta}>
                  {Math.min(current, mission.target).toLocaleString('fr-FR')} / {mission.target.toLocaleString('fr-FR')}
                </Text>
                <Text style={styles.reward}>Recompense : € {formatMoney(mission.reward)}</Text>
              </View>
              <EmpireButton
                label={mission.claimed ? 'Recu' : 'Claim'}
                tone={mission.claimed ? 'dark' : 'gold'}
                disabled={!complete || mission.claimed}
                onPress={() => dispatch({ type: 'claimMission', id: mission.id })}
              />
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
  info: {
    flex: 1,
  },
  title: {
    color: premium.colors.text,
    fontSize: 15,
    fontWeight: '900',
  },
  meta: {
    color: premium.colors.muted,
    marginTop: 5,
  },
  reward: {
    color: premium.colors.goldBright,
    fontSize: 13,
    fontWeight: '800',
    marginTop: 5,
  },
});
