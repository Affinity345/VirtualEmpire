import { createInitialState } from '@/game/initialState';
import { getMetricValue, getStats } from '@/game/selectors';
import { EmpireState, OwnableCategory } from '@/game/types';

export type EmpireAction =
  | { type: 'hydrate'; state: EmpireState }
  | { type: 'tick' }
  | { type: 'marketTick' }
  | { type: 'upgradeBusiness'; id: string }
  | { type: 'buyOwnable'; category: OwnableCategory; id: string }
  | { type: 'buyMarket'; id: string }
  | { type: 'sellMarket'; id: string }
  | { type: 'deposit'; amount: number }
  | { type: 'withdraw'; amount: number }
  | { type: 'borrow'; amount: number }
  | { type: 'repay'; amount: number }
  | { type: 'payTaxes'; amount: number }
  | { type: 'claimMission'; id: string }
  | { type: 'reset' };

const addXp = (state: EmpireState, amount: number): EmpireState => {
  const nextXp = state.xp + amount;
  const needed = state.level * 100;

  if (nextXp >= needed) {
    return {
      ...state,
      level: state.level + 1,
      xp: nextXp - needed,
    };
  }

  return {
    ...state,
    xp: nextXp,
  };
};

const getOwnableList = (state: EmpireState, category: OwnableCategory) => state[category];

export const empireReducer = (state: EmpireState, action: EmpireAction): EmpireState => {
  switch (action.type) {
    case 'hydrate':
      return action.state;

    case 'tick': {
      const { totalIncome } = getStats(state);
      const taxableIncome = Math.floor(totalIncome * TAX_RATE);
      const nextState = {
        ...state,
        cash: state.cash + totalIncome,
        taxDebt: state.taxDebt + taxableIncome,
        lastSeizureAmount: 0,
        totalEarned: state.totalEarned + totalIncome,
        secondsPlayed: state.secondsPlayed + 1,
      };

      return applyTaxSeizure(nextState);
    }

    case 'marketTick':
      return {
        ...state,
        market: state.market.map((asset) => {
          const shock = (Math.random() * asset.volatility * 2 - asset.volatility) * 0.08;
          const liquidityDrag = (Math.random() - 0.5) * asset.spread * 0.16;
          const meanReversion = ((asset.dayOpen - asset.price) / asset.dayOpen) * 0.012;
          const nextMomentum = Math.max(
            -asset.volatility * 0.08,
            Math.min(
              asset.volatility * 0.08,
              asset.momentum * 0.62 + shock + asset.trend * 0.08 + meanReversion,
            ),
          );
          const nextPrice = normalizeMarketPrice(asset.price * (1 + nextMomentum + liquidityDrag));

          return {
            ...asset,
            previousPrice: asset.price,
            price: nextPrice,
            momentum: nextMomentum,
            volume: Math.max(10000, Math.round(asset.volume * (0.94 + Math.random() * 0.14))),
          };
        }),
      };

    case 'upgradeBusiness': {
      const business = state.businesses.find((item) => item.id === action.id);
      if (!business || business.level >= business.maxLevel) return state;

      const cost = Math.round(business.basePrice * Math.pow(1.34, business.level));
      if (state.cash < cost) return state;

      const upgraded = {
        ...state,
        cash: state.cash - cost,
        businesses: state.businesses.map((item) =>
          item.id === action.id ? { ...item, level: item.level + 1 } : item,
        ),
      };

      return addXp(upgraded, 18);
    }

    case 'buyOwnable': {
      const list = getOwnableList(state, action.category);
      const asset = list.find((item) => item.id === action.id);
      if (!asset || asset.owned || state.cash < asset.price) return state;

      const updated = list.map((item) =>
        item.id === action.id ? { ...item, owned: true } : item,
      );

      const nextState = {
        ...state,
        cash: state.cash - asset.price,
        [action.category]: updated,
      };

      return addXp(nextState, asset.passiveIncome > 0 ? 48 : 32);
    }

    case 'buyMarket': {
      const asset = state.market.find((item) => item.id === action.id);
      const askPrice = asset ? normalizeMarketPrice(asset.price * (1 + asset.spread)) : 0;
      if (!asset || state.cash < askPrice) return state;
      const nextOwned = asset.owned + 1;
      const nextInvested = asset.invested + askPrice;

      return addXp(
        {
          ...state,
          cash: state.cash - askPrice,
          market: state.market.map((item) =>
            item.id === action.id
              ? {
                  ...item,
                  owned: nextOwned,
                  invested: nextInvested,
                  averageCost: nextInvested / nextOwned,
                  trades: item.trades + 1,
                }
              : item,
          ),
        },
        8,
      );
    }

    case 'sellMarket': {
      const asset = state.market.find((item) => item.id === action.id);
      if (!asset || asset.owned <= 0) return state;
      const bidPrice = normalizeMarketPrice(asset.price * (1 - asset.spread));
      const costBasisSold = asset.owned > 0 ? asset.invested / asset.owned : 0;
      const nextOwned = asset.owned - 1;
      const nextInvested = Math.max(0, asset.invested - costBasisSold);
      const realizedProfit = bidPrice - costBasisSold;

      return {
        ...state,
        cash: state.cash + bidPrice,
        market: state.market.map((item) =>
          item.id === action.id
            ? {
                ...item,
                owned: nextOwned,
                invested: nextOwned === 0 ? 0 : nextInvested,
                averageCost: nextOwned === 0 ? 0 : nextInvested / nextOwned,
                realizedProfit: item.realizedProfit + realizedProfit,
                trades: item.trades + 1,
              }
            : item,
        ),
      };
    }

    case 'deposit':
      if (state.cash < action.amount) return state;
      return {
        ...state,
        cash: state.cash - action.amount,
        bank: state.bank + action.amount,
      };

    case 'withdraw':
      if (state.bank < action.amount) return state;
      return {
        ...state,
        bank: state.bank - action.amount,
        cash: state.cash + action.amount,
      };

    case 'borrow': {
      const maxDebt = state.level * 50000;
      if (state.debt + action.amount > maxDebt) return state;
      return {
        ...state,
        debt: state.debt + action.amount,
        cash: state.cash + action.amount,
      };
    }

    case 'repay': {
      const payment = Math.min(action.amount, state.debt);
      if (payment <= 0 || state.cash < payment) return state;
      return {
        ...state,
        debt: state.debt - payment,
        cash: state.cash - payment,
      };
    }

    case 'payTaxes': {
      const payment = Math.min(action.amount, state.taxDebt);
      if (payment <= 0 || state.cash < payment) return state;

      return {
        ...state,
        cash: state.cash - payment,
        taxDebt: state.taxDebt - payment,
        lastSeizureAmount: 0,
      };
    }

    case 'claimMission': {
      const mission = state.missions.find((item) => item.id === action.id);
      if (!mission || mission.claimed || getMetricValue(state, mission.metric) < mission.target) {
        return state;
      }

      return addXp(
        {
          ...state,
          cash: state.cash + mission.reward,
          missions: state.missions.map((item) =>
            item.id === action.id ? { ...item, claimed: true } : item,
          ),
        },
        35,
      );
    }

    case 'reset':
      return createInitialState();
  }
};

const normalizeMarketPrice = (value: number) => {
  if (value < 0.000001) return 0.000001;
  if (value < 1) return Number(value.toPrecision(4));
  return Math.max(1, Math.round(value));
};

const TAX_RATE = 0.08;
const TAX_SEIZURE_THRESHOLD = 50000;

const applyTaxSeizure = (state: EmpireState): EmpireState => {
  const limit = Math.max(TAX_SEIZURE_THRESHOLD, state.level * 25000);

  if (state.taxDebt < limit) {
    return state;
  }

  const seizureAmount = Math.min(state.cash + state.bank, Math.ceil(state.taxDebt * 0.45));
  const cashTaken = Math.min(state.cash, seizureAmount);
  const bankTaken = Math.min(state.bank, seizureAmount - cashTaken);

  return {
    ...state,
    cash: state.cash - cashTaken,
    bank: state.bank - bankTaken,
    taxDebt: Math.max(0, state.taxDebt - seizureAmount),
    lastSeizureAmount: seizureAmount,
    seizureCount: state.seizureCount + 1,
  };
};
