import { EmpireState, EmpireStats } from '@/game/types';

export const getStats = (state: EmpireState): EmpireStats => {
  const businessIncome = state.businesses.reduce(
    (sum, business) => sum + business.level * business.baseIncome,
    0,
  );
  const realEstateIncome = state.realEstate.reduce(
    (sum, item) => sum + (item.owned ? item.passiveIncome : 0),
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
