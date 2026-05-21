import AsyncStorage from '@react-native-async-storage/async-storage';

import { buildMarket } from '@/data/empireCatalog';
import { SAVE_VERSION, createInitialState } from '@/game/initialState';
import { BusinessAsset, EmpireState, MarketAsset, OwnableAsset } from '@/game/types';

const SAVE_KEY = 'virtual-empire/save-v1';

export const loadEmpireState = async (): Promise<EmpireState> => {
  const raw = await AsyncStorage.getItem(SAVE_KEY);

  if (!raw) {
    return createInitialState();
  }

  try {
    const parsed = JSON.parse(raw) as EmpireState;

    if (parsed.version !== SAVE_VERSION) {
      return createInitialState();
    }

    return normalizeEmpireState(parsed);
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
    taxDebt: state.taxDebt ?? 0,
    lastSeizureAmount: state.lastSeizureAmount ?? 0,
    seizureCount: state.seizureCount ?? 0,
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
      volume: previous.volume ?? asset.volume,
      risk: previous.risk ?? asset.risk,
    };
  });

const mergeBusinesses = (fresh: BusinessAsset[], saved: BusinessAsset[]) =>
  fresh.map((business) => {
    const previous = saved.find((item) => item.id === business.id);
    return previous ? { ...business, level: previous.level } : business;
  });

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

export const clearEmpireState = async () => {
  await AsyncStorage.removeItem(SAVE_KEY);
};
