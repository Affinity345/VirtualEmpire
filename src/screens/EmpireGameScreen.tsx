import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Animated, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BottomNav } from '@/components/empire/BottomNav';
import { EmpireButton } from '@/components/empire/EmpireButton';
import { EmpireHeader } from '@/components/empire/EmpireHeader';
import { PremiumCard } from '@/components/empire/PremiumCard';
import { BankScreen } from '@/screens/BankScreen';
import { BusinessScreen } from '@/screens/BusinessScreen';
import { CarsScreen } from '@/screens/CarsScreen';
import { CollectionsScreen } from '@/screens/CollectionsScreen';
import { HomeScreen } from '@/screens/HomeScreen';
import { InvestmentsScreen } from '@/screens/InvestmentsScreen';
import { LuxuryScreen } from '@/screens/LuxuryScreen';
import { MissionsScreen } from '@/screens/MissionsScreen';
import { ProfileScreen } from '@/screens/ProfileScreen';
import { RealEstateScreen } from '@/screens/RealEstateScreen';
import { StatsScreen } from '@/screens/StatsScreen';
import { TradingScreen } from '@/screens/TradingScreen';
import { WealthScreen } from '@/screens/WealthScreen';
import { premium } from '@/utils/premiumTheme';
import { EmpireTab } from '@/game/types';
import { useEmpireGame } from '@/game/useEmpireGame';

export function EmpireGameScreen() {
  const { state, stats, ready, dispatch, reset, saveCloud, recoverCloud } = useEmpireGame();
  const [tab, setTab] = useState<EmpireTab>('dashboard');
  const insets = useSafeAreaInsets();

  const renderScreen = () => {
    switch (tab) {
      case 'dashboard':
        return (
          <HomeScreen
            state={state}
            stats={stats}
            onNavigate={setTab}
            onPrestige={() => dispatch({ type: 'prestige' })}
            dispatch={dispatch}
            onReset={reset}
          />
        );
      case 'business':
        return <BusinessScreen state={state} stats={stats} dispatch={dispatch} />;
      case 'trading':
        return <TradingScreen market={state.market} cash={state.cash} dispatch={dispatch} />;
      case 'investments':
        return (
          <InvestmentsScreen
            market={state.market}
            realEstate={state.realEstate}
            cash={state.cash}
            level={state.level}
            prestigeMultiplier={stats.prestigeMultiplier}
            dispatch={dispatch}
          />
        );
      case 'bank':
        return <BankScreen state={state} dispatch={dispatch} />;
      case 'realEstate':
        return (
          <RealEstateScreen
            items={state.realEstate}
            cash={state.cash}
            level={state.level}
            prestigeMultiplier={stats.prestigeMultiplier}
            dispatch={dispatch}
          />
        );
      case 'wealth':
        return (
          <WealthScreen
            cars={state.cars}
            luxury={state.luxury}
            collections={state.collections}
            cash={state.cash}
            level={state.level}
            dispatch={dispatch}
          />
        );
      case 'profile':
        return (
          <ProfileScreen
            state={state}
            stats={stats}
            dispatch={dispatch}
            onSaveCloud={saveCloud}
            onRecoverCloud={recoverCloud}
          />
        );
      case 'cars':
        return (
          <CarsScreen
            cars={state.cars}
            luxury={state.luxury}
            cash={state.cash}
            level={state.level}
            dispatch={dispatch}
          />
        );
      case 'luxury':
        return (
          <LuxuryScreen
            items={state.luxury}
            cash={state.cash}
            level={state.level}
            prestigeMultiplier={stats.prestigeMultiplier}
            dispatch={dispatch}
          />
        );
      case 'collections':
        return (
          <CollectionsScreen
            items={state.collections}
            cash={state.cash}
            level={state.level}
            prestigeMultiplier={stats.prestigeMultiplier}
            dispatch={dispatch}
          />
        );
      case 'missions':
        return <MissionsScreen state={state} dispatch={dispatch} />;
      case 'stats':
        return <StatsScreen state={state} stats={stats} />;
    }
  };

  if (!ready) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={premium.colors.goldBright} />
        <Text style={styles.loadingText}>Chargement de ton empire...</Text>
      </View>
    );
  }

  return (
    <View style={styles.app}>
      <GoldGlow />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: insets.top + (Platform.OS === 'web' ? 88 : 18),
            paddingBottom: insets.bottom + 116,
          },
        ]}>
        <EmpireHeader state={state} stats={stats} />
        <OfflineSummaryCard state={state} dispatch={dispatch} />
        <ScreenTransition activeKey={tab}>
          {renderScreen()}
        </ScreenTransition>
      </ScrollView>
      <CashGainPopup popup={state.cashPopup} />
      <BottomNav active={tab} onChange={setTab} />
    </View>
  );
}

function OfflineSummaryCard({
  state,
  dispatch,
}: {
  state: ReturnType<typeof useEmpireGame>['state'];
  dispatch: ReturnType<typeof useEmpireGame>['dispatch'];
}) {
  const summary = state.offlineSummary;
  if (!summary || summary.shown) return null;

  const minutes = Math.max(1, Math.floor(summary.secondsAway / 60));

  return (
    <PremiumCard style={styles.offlineCard}>
      <Text style={styles.offlineTitle}>Empire actif hors ligne</Text>
      <Text style={styles.offlineLine}>Absence : {minutes.toLocaleString('fr-FR')} min</Text>
      <Text style={styles.offlineGain}>+ € {formatPopupMoney(summary.cashEarned)}</Text>
      <Text style={styles.offlineLine}>Taxes ajoutees : € {formatPopupMoney(summary.taxesAdded)}</Text>
      <Text style={styles.offlineLine}>Projets termines : {summary.projectsCompleted}</Text>
      {summary.events.map((event) => (
        <Text key={event} style={styles.offlineEvent}>{event}</Text>
      ))}
      <EmpireButton label="Continuer" onPress={() => dispatch({ type: 'dismissOfflineSummary' })} />
    </PremiumCard>
  );
}

function GoldGlow() {
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 1800,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 1800,
          useNativeDriver: true,
        }),
      ]),
    );

    animation.start();
    return () => animation.stop();
  }, [pulse]);

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.topGlow,
        {
          opacity: pulse.interpolate({
            inputRange: [0, 1],
            outputRange: [0.55, 1],
          }),
          transform: [
            {
              scaleY: pulse.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 1.12],
              }),
            },
          ],
        },
      ]}
    />
  );
}

function ScreenTransition({ activeKey, children }: { activeKey: string; children: React.ReactNode }) {
  const fade = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    fade.setValue(0);
    Animated.timing(fade, {
      toValue: 1,
      duration: 220,
      useNativeDriver: true,
    }).start();
  }, [activeKey, fade]);

  return (
    <Animated.View style={{ opacity: fade, transform: [{ translateY: fade.interpolate({
      inputRange: [0, 1],
      outputRange: [10, 0],
    }) }] }}>
      {children}
    </Animated.View>
  );
}

function CashGainPopup({ popup }: { popup?: { amount: number; label: string; nonce: number } }) {
  const lift = useRef(new Animated.Value(0)).current;
  const [visiblePopup, setVisiblePopup] = useState(popup);

  useEffect(() => {
    if (!popup || popup.amount <= 0) return;
    setVisiblePopup(popup);
    lift.setValue(0);
    Animated.timing(lift, {
      toValue: 1,
      duration: 1200,
      useNativeDriver: true,
    }).start();
  }, [lift, popup]);

  if (!visiblePopup) return null;

  const opacity = lift.interpolate({
    inputRange: [0, 0.2, 1],
    outputRange: [0, 1, 0],
  });
  const translateY = lift.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -54],
  });

  return (
    <Animated.View style={[styles.cashPopup, { opacity, transform: [{ translateY }] }]}>
      <Text style={styles.cashPopupText}>+ € {formatPopupMoney(visiblePopup.amount)}</Text>
      <Text style={styles.cashPopupLabel}>{visiblePopup.label}</Text>
    </Animated.View>
  );
}

const formatPopupMoney = (value: number) => {
  if (value >= 1000000) return `${(value / 1000000).toFixed(2)}M`;
  if (value >= 1000) return Math.round(value).toLocaleString('fr-FR');
  return Math.round(value).toString();
};

const styles = StyleSheet.create({
  app: {
    flex: 1,
    backgroundColor: premium.colors.ink,
  },
  topGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 180,
    backgroundColor: 'rgba(122, 86, 24, 0.18)',
  },
  cashPopup: {
    position: 'absolute',
    top: 112,
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: premium.colors.goldBright,
    borderRadius: premium.radius.sm,
    backgroundColor: 'rgba(8, 7, 4, 0.94)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    shadowColor: premium.colors.goldBright,
    shadowOpacity: 0.45,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  cashPopupText: {
    color: premium.colors.goldBright,
    fontSize: 16,
    fontWeight: '900',
    textAlign: 'center',
  },
  cashPopupLabel: {
    color: premium.colors.champagne,
    fontSize: 11,
    fontWeight: '800',
    marginTop: 2,
    textAlign: 'center',
  },
  offlineCard: {
    borderColor: premium.colors.goldBright,
    backgroundColor: premium.colors.panelElevated,
    marginBottom: 14,
  },
  offlineTitle: {
    color: premium.colors.text,
    fontSize: 18,
    fontWeight: '900',
  },
  offlineGain: {
    color: premium.colors.goldBright,
    fontSize: 28,
    fontWeight: '900',
    marginTop: 8,
  },
  offlineLine: {
    color: premium.colors.champagne,
    fontSize: 13,
    fontWeight: '800',
    marginTop: 6,
  },
  offlineEvent: {
    color: premium.colors.muted,
    fontSize: 12,
    marginTop: 6,
    marginBottom: 10,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: premium.colors.ink,
    gap: 12,
  },
  loadingText: {
    color: premium.colors.muted,
    fontWeight: '700',
  },
});
