import {
  buildBusinesses,
  buildCars,
  buildCollections,
  buildLuxury,
  buildMarket,
  buildMissions,
  buildRealEstate,
} from '@/data/empireCatalog';
import { EmpireState } from '@/game/types';

export const SAVE_VERSION = 1;

export const createInitialState = (): EmpireState => ({
  version: SAVE_VERSION,
  cash: 5000,
  bank: 0,
  debt: 0,
  taxDebt: 0,
  lastSeizureAmount: 0,
  seizureCount: 0,
  prestigeCount: 0,
  prestigePoints: 0,
  totalPrestigePoints: 0,
  highestNetWorth: 0,
  adRewards: {
    rewardedAdsWatched: 0,
    noAds: false,
    bonusMultiplier: 1,
    bonusSecondsRemaining: 0,
    totalAdCashEarned: 0,
    rewardedAdCooldownSeconds: 90,
    rewardedAdDailyCount: 0,
    rewardedAdDailyLimit: 12,
  },
  dailyRewards: {
    streak: 0,
    rewardHistory: [],
    dailyMissions: [
      { id: 'income', title: 'Generer 100k de revenus', target: 100000, reward: 35000 },
      { id: 'invest', title: 'Posseder 3 investissements', target: 3, reward: 45000 },
      { id: 'asset', title: 'Posseder 5 biens premium', target: 5, reward: 55000 },
    ],
  },
  level: 1,
  xp: 0,
  totalEarned: 0,
  secondsPlayed: 0,
  passiveIncomeElapsed: 0,
  businesses: buildBusinesses(),
  realEstate: buildRealEstate(),
  cars: buildCars(),
  luxury: buildLuxury(),
  collections: buildCollections(),
  market: buildMarket(),
  missions: buildMissions(),
});
