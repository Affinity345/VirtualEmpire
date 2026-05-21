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
  level: 1,
  xp: 0,
  totalEarned: 0,
  secondsPlayed: 0,
  businesses: buildBusinesses(),
  realEstate: buildRealEstate(),
  cars: buildCars(),
  luxury: buildLuxury(),
  collections: buildCollections(),
  market: buildMarket(),
  missions: buildMissions(),
});
