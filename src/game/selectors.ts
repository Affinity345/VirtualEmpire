import { EmpireState, EmpireStats } from '@/game/types';
import { getEnterpriseIncome } from '@/utils/enterprise';

export const getPrestigeMultiplier = (state: EmpireState) =>
  1 + state.totalPrestigePoints * 0.04 + state.prestigeCount * 0.03;

export const getPrestigeGain = (netWorth: number) => {
  if (netWorth < PRESTIGE_MIN_NET_WORTH) return 0;
  return Math.max(1, Math.floor(Math.sqrt(netWorth / PRESTIGE_MIN_NET_WORTH)));
};

export const getStats = (state: EmpireState): EmpireStats => {
  const prestigeMultiplier = getPrestigeMultiplier(state);
  const adBonusMultiplier =
    state.adRewards.bonusSecondsRemaining > 0 ? state.adRewards.bonusMultiplier : 1;
  const totalRevenueMultiplier = prestigeMultiplier * adBonusMultiplier;
  const businessIncome = state.businesses.reduce(
    (sum, business) => sum + getEnterpriseIncome(business, totalRevenueMultiplier),
    0,
  );
  const realEstateIncome = state.realEstate.reduce(
    (sum, item) => sum + (item.owned ? item.passiveIncome * totalRevenueMultiplier : 0),
    0,
  );
  const marketValue = state.market.reduce((sum, item) => sum + item.owned * item.price, 0);
  const marketInvested = state.market.reduce((sum, item) => sum + item.invested, 0);
  const marketRealizedProfit = state.market.reduce((sum, item) => sum + item.realizedProfit, 0);
  const marketUnrealizedProfit = marketValue - marketInvested;
  const assetValue = [...state.realEstate, ...state.cars, ...state.luxury, ...state.collections].reduce(
    (sum, item) => sum + (item.owned ? item.price : 0),
    0,
  );
  const businessLevels = state.businesses.reduce((sum, business) => sum + business.level, 0);

  return {
    businessIncome,
    realEstateIncome,
    totalIncome: businessIncome + realEstateIncome,
    marketValue,
    marketInvested,
    marketUnrealizedProfit,
    marketRealizedProfit,
    assetValue,
    netWorth: state.cash + state.bank + marketValue + assetValue - state.debt,
    businessLevels,
    realEstateOwned: state.realEstate.filter((item) => item.owned).length,
    carsOwned: state.cars.filter((item) => item.owned).length,
    luxuryOwned: state.luxury.filter((item) => item.owned).length,
    collectionsOwned: state.collections.filter((item) => item.owned).length,
    marketUnits: state.market.reduce((sum, item) => sum + item.owned, 0),
    prestigeMultiplier,
    adBonusMultiplier,
    totalRevenueMultiplier,
    nextPrestigePoints: getPrestigeGain(state.cash + state.bank + marketValue + assetValue - state.debt),
  };
};

export const getMetricValue = (
  state: EmpireState,
  metric: EmpireState['missions'][number]['metric'],
) => {
  const stats = getStats(state);

  switch (metric) {
    case 'cash':
      return state.cash;
    case 'bank':
      return state.bank;
    case 'netWorth':
      return stats.netWorth;
    case 'businessLevels':
      return stats.businessLevels;
    case 'realEstateOwned':
      return stats.realEstateOwned;
    case 'carsOwned':
      return stats.carsOwned;
    case 'luxuryOwned':
      return stats.luxuryOwned;
    case 'collectionsOwned':
      return stats.collectionsOwned;
    case 'marketUnits':
      return stats.marketUnits;
  }
};

export const PRESTIGE_MIN_NET_WORTH = 1000000000;
