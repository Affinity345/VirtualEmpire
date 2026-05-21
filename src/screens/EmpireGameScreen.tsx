import React, { useState } from 'react';
import { ActivityIndicator, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BottomNav } from '@/components/empire/BottomNav';
import { EmpireHeader } from '@/components/empire/EmpireHeader';
import { BankScreen } from '@/screens/BankScreen';
import { BusinessScreen } from '@/screens/BusinessScreen';
import { CarsScreen } from '@/screens/CarsScreen';
import { CollectionsScreen } from '@/screens/CollectionsScreen';
import { HomeScreen } from '@/screens/HomeScreen';
import { LuxuryScreen } from '@/screens/LuxuryScreen';
import { MissionsScreen } from '@/screens/MissionsScreen';
import { RealEstateScreen } from '@/screens/RealEstateScreen';
import { StatsScreen } from '@/screens/StatsScreen';
import { TradingScreen } from '@/screens/TradingScreen';
import { premium } from '@/utils/premiumTheme';
import { EmpireTab } from '@/game/types';
import { useEmpireGame } from '@/game/useEmpireGame';

export function EmpireGameScreen() {
  const { state, stats, ready, dispatch, reset } = useEmpireGame();
  const [tab, setTab] = useState<EmpireTab>('dashboard');
  const insets = useSafeAreaInsets();

  const renderScreen = () => {
    switch (tab) {
      case 'dashboard':
        return <HomeScreen state={state} stats={stats} onNavigate={setTab} onReset={reset} />;
      case 'business':
        return <BusinessScreen businesses={state.businesses} cash={state.cash} dispatch={dispatch} />;
      case 'trading':
        return <TradingScreen market={state.market} cash={state.cash} dispatch={dispatch} />;
      case 'bank':
        return <BankScreen state={state} dispatch={dispatch} />;
      case 'realEstate':
        return <RealEstateScreen items={state.realEstate} cash={state.cash} dispatch={dispatch} />;
      case 'cars':
        return <CarsScreen cars={state.cars} luxury={state.luxury} cash={state.cash} dispatch={dispatch} />;
      case 'luxury':
        return <LuxuryScreen items={state.luxury} cash={state.cash} dispatch={dispatch} />;
      case 'collections':
        return <CollectionsScreen items={state.collections} cash={state.cash} dispatch={dispatch} />;
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
      <View style={styles.topGlow} />
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
        {renderScreen()}
      </ScrollView>
      <BottomNav active={tab} onChange={setTab} />
    </View>
  );
}

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
