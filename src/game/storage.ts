import AsyncStorage from '@react-native-async-storage/async-storage';

import { buildMarket } from '@/data/empireCatalog';
import { SAVE_VERSION, createInitialState } from '@/game/initialState';
import { PASSIVE_PAYOUT_INTERVAL_SECONDS, getStats } from '@/game/selectors';
import { BusinessAsset, EmpireState, MarketAsset, OwnableAsset } from '@/game/types';
import { BUSINESS_MAX_LEVEL } from '@/utils/progression';
import { getEnterpriseProgressRate } from '@/utils/enterprise';

const SAVE_KEY = 'virtual-empire/save-v1';

export const loadEmpireState = async (): Promise<EmpireState> => {
  const raw = await AsyncStorage.getItem(SAVE_KEY);

  if (!raw) {
    return createInitialState();
  }

  try {
    const parsed = JSON.parse(raw) as EmpireState;

    if (!parsed.version || parsed.version <= SAVE_VERSION) {
      return applyOfflineProgress(normalizeEmpireState(parsed));
    }

    return createInitialState();
  } catch {
    return createInitialState();
  }
};

const normalizeEmpireState = (state: EmpireState): EmpireState => {
  const fresh = createInitialState();
  const marketDefaults = buildMarket();

  return {
    ...fresh,
    ...state,
    version: SAVE_VERSION,
    cash: getCanonicalCash(state, fresh.cash),
    passiveIncomeElapsed: state.passiveIncomeElapsed ?? fresh.passiveIncomeElapsed,
    taxDebt: state.taxDebt ?? 0,
    lastSeizureAmount: state.lastSeizureAmount ?? 0,
    seizureCount: state.seizureCount ?? 0,
    prestigeCount: state.prestigeCount ?? 0,
    prestigePoints: state.prestigePoints ?? 0,
    totalPrestigePoints: state.totalPrestigePoints ?? state.prestigePoints ?? 0,
    highestNetWorth: state.highestNetWorth ?? 0,
    playerProfile: state.playerProfile,
    adRewards: {
      ...fresh.adRewards,
      ...state.adRewards,
      rewardedAdCooldownSeconds:
        state.adRewards?.rewardedAdCooldownSeconds ?? fresh.adRewards.rewardedAdCooldownSeconds,
      rewardedAdDailyCount: state.adRewards?.rewardedAdDailyCount ?? 0,
      rewardedAdDailyLimit:
        state.adRewards?.rewardedAdDailyLimit ?? fresh.adRewards.rewardedAdDailyLimit,
    },
    dailyRewards: {
      ...fresh.dailyRewards,
      ...state.dailyRewards,
      dailyMissions: state.dailyRewards?.dailyMissions ?? fresh.dailyRewards.dailyMissions,
      rewardHistory: state.dailyRewards?.rewardHistory ?? [],
    },
    economyEvent: state.economyEvent,
    cashPopup: state.cashPopup,
    offlineSummary: state.offlineSummary,
    businesses: mergeBusinesses(fresh.businesses, state.businesses),
    realEstate: mergeOwnables(fresh.realEstate, state.realEstate),
    cars: mergeOwnables(fresh.cars, state.cars),
    luxury: mergeOwnables(fresh.luxury, state.luxury),
    collections: mergeOwnables(fresh.collections, state.collections),
    missions: fresh.missions.map((mission) => {
      const saved = state.missions.find((item) => item.id === mission.id);
      return saved ? { ...mission, claimed: saved.claimed } : mission;
    }),
    market: mergeMarket(marketDefaults, state.market),
  };
};

const mergeMarket = (fresh: MarketAsset[], saved: MarketAsset[]) =>
  fresh.map((asset) => {
    const previous = saved.find((item) => item.id === asset.id);

    if (!previous) {
      return asset;
    }

    const defaultPrice = asset.price;
    const hasAberrantPrice =
      previous.price > defaultPrice * 3 || previous.price < Math.max(1, defaultPrice * 0.25);
    const price = hasAberrantPrice ? defaultPrice : previous.price;
    const savedDayOpen = previous.dayOpen ?? previous.previousPrice ?? price;
    const hasStaleSessionOpen = Math.abs((price - savedDayOpen) / savedDayOpen) > 0.12;

      return {
        ...asset,
        owned: previous.owned,
        averageCost: previous.averageCost ?? (previous.owned > 0 ? price : 0),
        invested: previous.invested ?? previous.owned * price,
        realizedProfit: previous.realizedProfit ?? 0,
        trades: previous.trades ?? 0,
        price,
      previousPrice: hasAberrantPrice ? defaultPrice : previous.previousPrice,
      dayOpen: hasAberrantPrice || hasStaleSessionOpen ? price : savedDayOpen,
      momentum: previous.momentum ?? asset.momentum,
      spread: previous.spread ?? asset.spread,
      volume: Math.min(MAX_MARKET_VOLUME, previous.volume ?? asset.volume),
      risk: previous.risk ?? asset.risk,
    };
  });

const mergeBusinesses = (fresh: BusinessAsset[], saved: BusinessAsset[]) => {
  const merged = fresh.map((business) => {
    const previous = saved.find((item) => item.id === business.id);
    return previous
      ? {
          ...business,
          level: Math.min(previous.level, BUSINESS_MAX_LEVEL),
          employees: previous.employees ?? business.employees,
          vehicles: previous.vehicles ?? business.vehicles,
          buildings: previous.buildings ?? business.buildings,
          resources: previous.resources ?? business.resources,
          projectName: previous.projectName ?? business.projectName,
          projectProgress: previous.projectProgress ?? business.projectProgress,
          quality: previous.quality ?? business.quality,
          maintenance: previous.maintenance ?? business.maintenance,
          efficiency: previous.efficiency ?? business.efficiency,
          reputation: previous.reputation ?? business.reputation,
          enterpriseTaxDebt: previous.enterpriseTaxDebt ?? 0,
          auditRisk: previous.auditRisk ?? business.auditRisk,
          synergyBonus: previous.synergyBonus ?? 0,
        }
      : business;
  });
  const freshIds = new Set(fresh.map((business) => business.id));
  const legacyOwnedBusinesses = saved.filter(
    (business) => !freshIds.has(business.id) && business.level > 0,
  );

  return [...merged, ...legacyOwnedBusinesses];
};

const mergeOwnables = (fresh: OwnableAsset[], saved: OwnableAsset[]) =>
  fresh.map((asset) => {
    const previous = saved.find((item) => item.id === asset.id);
    return previous ? { ...asset, owned: previous.owned } : asset;
  });

export const saveEmpireState = async (state: EmpireState) => {
  await AsyncStorage.setItem(
    SAVE_KEY,
    JSON.stringify({
      ...state,
      lastSavedAt: Date.now(),
    }),
  );
};

export const saveCloudSnapshot = async (state: EmpireState) => {
  await AsyncStorage.setItem(
    CLOUD_SAVE_KEY,
    JSON.stringify({
      ...state,
      playerProfile: state.playerProfile
        ? { ...state.playerProfile, lastCloudSyncAt: Date.now() }
        : state.playerProfile,
      lastSavedAt: Date.now(),
    }),
  );
};

export const loadCloudSnapshot = async (): Promise<EmpireState | undefined> => {
  const raw = await AsyncStorage.getItem(CLOUD_SAVE_KEY);
  if (!raw) return undefined;

  try {
    return normalizeEmpireState(JSON.parse(raw) as EmpireState);
  } catch {
    return undefined;
  }
};

export const clearEmpireState = async () => {
  await AsyncStorage.removeItem(SAVE_KEY);
};

const MAX_MARKET_VOLUME = 999000000000;
const CLOUD_SAVE_KEY = 'virtual-empire/cloud-snapshot-v1';

const applyOfflineProgress = (state: EmpireState): EmpireState => {
  if (!state.lastSavedAt) return state;
  const secondsAway = Math.min(8 * 3600, Math.max(0, Math.floor((Date.now() - state.lastSavedAt) / 1000)));
  if (secondsAway < 60) return state;

  const stats = getStats(state);
  const totalPassiveElapsed = (state.passiveIncomeElapsed ?? 0) + secondsAway;
  const completedPayouts = Math.floor(totalPassiveElapsed / PASSIVE_PAYOUT_INTERVAL_SECONDS);
  const passiveIncomeElapsed = totalPassiveElapsed % PASSIVE_PAYOUT_INTERVAL_SECONDS;
  const cashEarned = Math.floor(stats.nextPassivePayout * completedPayouts * 0.65);
  const taxesAdded = Math.floor(cashEarned * 0.08);
  let projectsCompleted = 0;

  const businesses = state.businesses.map((business) => {
    if (business.level <= 0 || business.projectProgress >= 100) return business;
    const nextProgress = Math.min(100, business.projectProgress + getEnterpriseProgressRate(business) * secondsAway);
    if (nextProgress >= 100) projectsCompleted += 1;
    return {
      ...business,
      projectProgress: nextProgress,
      resources: business.resources + business.employees * secondsAway * 0.03,
    };
  });

  return {
    ...state,
    cash: state.cash + cashEarned,
    passiveIncomeElapsed,
    taxDebt: state.taxDebt + taxesAdded,
    totalEarned: state.totalEarned + cashEarned,
    businesses,
    offlineSummary: {
      secondsAway,
      cashEarned,
      taxesAdded,
      projectsCompleted,
      events: projectsCompleted > 0 ? ['Projets termines pendant ton absence'] : ['Empire actif hors ligne'],
      shown: false,
    },
    cashPopup: {
      amount: cashEarned,
      label: 'Revenus hors ligne',
      nonce: Date.now(),
    },
  };
};

const getCanonicalCash = (state: EmpireState, fallback: number) => {
  const legacyState = state as EmpireState & {
    money?: number;
    balance?: number;
    wallet?: number;
    playerCash?: number;
  };
  const candidates = [
    state.cash,
    legacyState.playerCash,
    legacyState.wallet,
    legacyState.balance,
    legacyState.money,
    fallback,
  ];
  const validValues = candidates.filter(
    (value): value is number => typeof value === 'number' && Number.isFinite(value),
  );
  if (validValues.length === 0) return fallback;

  const primaryCash = typeof state.cash === 'number' && Number.isFinite(state.cash) ? state.cash : undefined;
  if (primaryCash && primaryCash > 0) return primaryCash;

  return Math.max(...validValues, fallback);
};
