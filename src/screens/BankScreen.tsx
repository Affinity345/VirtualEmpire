import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { EmpireButton } from '@/components/empire/EmpireButton';
import { formatMoney } from '@/utils/format';
import { PremiumCard } from '@/components/empire/PremiumCard';
import { SectionHeader } from '@/components/empire/SectionHeader';
import { premium } from '@/utils/premiumTheme';
import { EmpireAction } from '@/game/reducer';
import { EmpireState } from '@/game/types';

type Props = {
  state: EmpireState;
  dispatch: React.Dispatch<EmpireAction>;
};

export function BankScreen({ state, dispatch }: Props) {
  const taxWarning = state.taxDebt >= Math.max(50000, state.level * 25000);

  return (
    <View style={styles.gap}>
      <SectionHeader title="Banque privee" subtitle="Liquidites, depot securise et credit limite par le niveau." />
      <PremiumCard>
        <Text style={styles.title}>Compte coffre</Text>
        <Text style={styles.amount}>€ {formatMoney(state.bank)}</Text>
        <View style={styles.actions}>
          <EmpireButton label="Deposer 10k" disabled={state.cash < 10000} onPress={() => dispatch({ type: 'deposit', amount: 10000 })} />
          <EmpireButton label="Retirer 10k" tone="dark" disabled={state.bank < 10000} onPress={() => dispatch({ type: 'withdraw', amount: 10000 })} />
        </View>
      </PremiumCard>
      <PremiumCard style={taxWarning && styles.taxDangerCard}>
        <Text style={styles.title}>Impots</Text>
        <Text style={taxWarning ? styles.taxDanger : styles.taxAmount}>
          A payer : € {formatMoney(state.taxDebt)}
        </Text>
        <Text style={styles.meta}>
          Si tu ne payes pas, une saisie peut prendre du cash puis de la banque.
        </Text>
        {state.lastSeizureAmount > 0 ? (
          <Text style={styles.seizure}>Derniere saisie : € {formatMoney(state.lastSeizureAmount)}</Text>
        ) : null}
        <View style={styles.actions}>
          <EmpireButton
            label="Payer 10k"
            disabled={state.taxDebt <= 0 || state.cash <= 0}
            onPress={() => dispatch({ type: 'payTaxes', amount: 10000 })}
          />
          <EmpireButton
            label="Tout payer"
            tone="dark"
            disabled={state.taxDebt <= 0 || state.cash <= 0}
            onPress={() => dispatch({ type: 'payTaxes', amount: state.taxDebt })}
          />
        </View>
      </PremiumCard>
      <PremiumCard>
        <Text style={styles.title}>Credit empire</Text>
        <Text style={styles.debt}>Dette : € {formatMoney(state.debt)}</Text>
        <Text style={styles.meta}>Limite actuelle : € {formatMoney(state.level * 50000)}</Text>
        <View style={styles.actions}>
          <EmpireButton label="Emprunter" onPress={() => dispatch({ type: 'borrow', amount: 10000 })} />
          <EmpireButton label="Rembourser" tone="dark" disabled={state.debt <= 0 || state.cash <= 0} onPress={() => dispatch({ type: 'repay', amount: 10000 })} />
        </View>
      </PremiumCard>
    </View>
  );
}

const styles = StyleSheet.create({
  gap: {
    gap: 12,
  },
  title: {
    color: premium.colors.text,
    fontSize: 18,
    fontWeight: '900',
  },
  amount: {
    color: premium.colors.goldBright,
    fontSize: 30,
    fontWeight: '900',
    marginTop: 8,
  },
  debt: {
    color: premium.colors.danger,
    fontSize: 22,
    fontWeight: '900',
    marginTop: 8,
  },
  taxAmount: {
    color: premium.colors.goldBright,
    fontSize: 22,
    fontWeight: '900',
    marginTop: 8,
  },
  taxDanger: {
    color: premium.colors.danger,
    fontSize: 22,
    fontWeight: '900',
    marginTop: 8,
  },
  taxDangerCard: {
    borderColor: 'rgba(248, 113, 113, 0.5)',
    backgroundColor: 'rgba(127, 29, 29, 0.16)',
  },
  seizure: {
    color: premium.colors.danger,
    marginTop: 8,
    fontWeight: '800',
  },
  meta: {
    color: premium.colors.muted,
    marginTop: 6,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 14,
  },
});
