import { createInitialState } from '@/game/initialState';
import { PASSIVE_PAYOUT_INTERVAL_SECONDS, getMetricValue, getPrestigeGain, getStats } from '@/game/selectors';
import { AdRewardType, AuthProvider, EmpireState, OwnableCategory } from '@/game/types';
import { getAdCooldownRemaining, getRewardedAdRewardCash, getRewardedAdsWatchedToday } from '@/ads/adMob';
import { buildBusinesses } from '@/data/empireCatalog';
import {
  getEnterpriseProgressRate,
  getEnterpriseResourcesPerTick,
  getEnterpriseStatus,
  getEnterpriseTaxLimit,
} from '@/utils/enterprise';
import {
  BUSINESS_MAX_LEVEL,
  canBuyOwnable,
  canFoundBusiness,
  getBusinessFoundingCost,
  getBusinessResalePrice,
} from '@/utils/progression';
import { getResalePrice } from '@/utils/resale';

export type EmpireAction =
  | { type: 'hydrate'; state: EmpireState }
  | { type: 'tick'; deltaSeconds?: number }
  | { type: 'marketTick' }
  | { type: 'upgradeBusiness'; id: string }
  | { type: 'sellBusiness'; id: string }
  | { type: 'buyOwnable'; category: OwnableCategory; id: string }
  | { type: 'sellOwnable'; category: OwnableCategory; id: string }
  | { type: 'buyMarket'; id: string }
  | { type: 'sellMarket'; id: string }
  | { type: 'deposit'; amount: number }
  | { type: 'withdraw'; amount: number }
  | { type: 'borrow'; amount: number }
  | { type: 'repay'; amount: number }
  | { type: 'payTaxes'; amount: number }
  | { type: 'payBusinessTax'; id: string }
  | { type: 'dismissOfflineSummary' }
  | { type: 'claimMission'; id: string }
  | { type: 'prestige' }
  | { type: 'connectPlayer'; provider: AuthProvider }
  | { type: 'disconnectPlayer' }
  | { type: 'claimRewardAd'; reward: AdRewardType }
  | { type: 'buyNoAds' }
  | { type: 'claimDailyReward' }
  | { type: 'openDailyChest' }
  | { type: 'spinLuckyWheel' }
  | { type: 'claimConnectionBonus' }
  | { type: 'claimDailyMission'; id: 'income' | 'invest' | 'asset' }
  | { type: 'reset' };

const addXp = (state: EmpireState, amount: number): EmpireState => {
  let nextXp = state.xp + amount;
  let nextLevel = state.level;

  while (nextXp >= nextLevel * 100) {
    nextXp -= nextLevel * 100;
    nextLevel += 1;
  }

  return {
    ...state,
    level: nextLevel,
    xp: nextXp,
  };
};

const getOwnableList = (state: EmpireState, category: OwnableCategory) => state[category];

export const empireReducer = (state: EmpireState, action: EmpireAction): EmpireState => {
  switch (action.type) {
    case 'hydrate':
      return action.state;

    case 'tick': {
      const stats = getStats(state);
      const deltaSeconds = Math.max(0, Math.min(10, action.deltaSeconds ?? 1));
      const passiveElapsed = (state.passiveIncomeElapsed ?? 0) + deltaSeconds;
      const completedPayouts = Math.floor(passiveElapsed / PASSIVE_PAYOUT_INTERVAL_SECONDS);
      const passiveIncomeElapsed = passiveElapsed % PASSIVE_PAYOUT_INTERVAL_SECONDS;
      const earnedIncome = stats.nextPassivePayout * completedPayouts;
      const taxableIncome = Math.floor(earnedIncome * TAX_RATE);
      const nextSecondsPlayed = state.secondsPlayed + deltaSeconds;
      const previousWholeSecond = Math.floor(state.secondsPlayed);
      const nextWholeSecond = Math.floor(nextSecondsPlayed);
      const nextState = {
        ...state,
        cash: state.cash + earnedIncome,
        taxDebt: state.taxDebt + taxableIncome,
        totalEarned: state.totalEarned + earnedIncome,
        highestNetWorth: Math.max(state.highestNetWorth, stats.netWorth),
        secondsPlayed: nextSecondsPlayed,
        passiveIncomeElapsed,
        businesses: simulateBusinesses(state.businesses, deltaSeconds),
        economyEvent: state.economyEvent
          ? {
              ...state.economyEvent,
              secondsRemaining: state.economyEvent.secondsRemaining - deltaSeconds,
            }
          : maybeCreateEconomyEvent(previousWholeSecond, nextWholeSecond),
        cashPopup:
          earnedIncome > 0 ? createCashPopup(earnedIncome, 'Revenus reçus', state) : state.cashPopup,
        adRewards: {
          ...state.adRewards,
          bonusSecondsRemaining: Math.max(0, state.adRewards.bonusSecondsRemaining - deltaSeconds),
          bonusMultiplier:
            state.adRewards.bonusSecondsRemaining > deltaSeconds ? state.adRewards.bonusMultiplier : 1,
        },
      };

      const updatedState = {
        ...nextState,
        economyEvent:
          nextState.economyEvent && nextState.economyEvent.secondsRemaining > 0
            ? nextState.economyEvent
            : undefined,
      };

      return earnedIncome > 0 ? applyTaxSeizure(updatedState) : updatedState;
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
          const eventModifier = state.economyEvent?.marketModifier ?? 0;
          const nextPrice = normalizeMarketPrice(
            asset.price * (1 + nextMomentum + liquidityDrag + eventModifier),
          );

          return {
            ...asset,
            previousPrice: asset.price,
            price: nextPrice,
            momentum: nextMomentum,
            volume: Math.min(
              MAX_MARKET_VOLUME,
              Math.max(10000, Math.round(asset.volume * (0.94 + Math.random() * 0.14))),
            ),
          };
        }),
      };

    case 'upgradeBusiness': {
      const business = state.businesses.find((item) => item.id === action.id);
      const effectiveMaxLevel = business ? getEffectiveBusinessMaxLevel(business.maxLevel, state.prestigeCount) : 0;
      if (!business || business.level >= effectiveMaxLevel) return state;

      const cost = getBusinessFoundingCost(business);
      if (business.level <= 0 && !canFoundBusiness(business, state.cash, state.level)) return state;
      if (business.level > 0 && state.cash < cost) return state;

      const upgraded = {
        ...state,
        cash: state.cash - cost,
        businesses: state.businesses.map((item) =>
          item.id === action.id
            ? {
                ...item,
                level: Math.min(BUSINESS_MAX_LEVEL, item.level + 1),
                employees: item.employees + 2,
                vehicles: item.vehicles + (isTransportBusiness(item) ? 1 : 0),
                buildings: item.buildings + (item.level > 0 && item.level % 5 === 0 ? 1 : 0),
                projectProgress: item.level <= 0 ? 100 : item.projectProgress,
                maintenance: Math.max(8, item.maintenance - 1),
                reputation: Math.min(100, item.reputation + 1),
              }
            : item,
        ),
      };

      return addXp(upgraded, 18);
    }

    case 'sellBusiness': {
      const business = state.businesses.find((item) => item.id === action.id);
      if (!business || business.level <= 0) return state;

      const resalePrice = getBusinessResalePrice(business);
      const freshBusiness = buildBusinesses().find((item) => item.id === action.id);

      return {
        ...state,
        cash: state.cash + resalePrice,
        cashPopup: createCashPopup(resalePrice, 'Vente entreprise', state),
        businesses: state.businesses.map((item) =>
          item.id === action.id
            ? {
                ...(freshBusiness ?? item),
                level: 0,
                resources: 0,
                projectProgress: 0,
                enterpriseTaxDebt: 0,
                synergyBonus: 0,
              }
            : item,
        ),
      };
    }

    case 'buyOwnable': {
      const list = getOwnableList(state, action.category);
      const asset = list.find((item) => item.id === action.id);
      if (!asset || asset.owned || !canBuyOwnable(asset, state.cash, state.level)) {
        return state;
      }

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

    case 'sellOwnable': {
      const list = getOwnableList(state, action.category);
      const asset = list.find((item) => item.id === action.id);
      if (!asset || !asset.owned) return state;

      return {
        ...state,
        cash: state.cash + getResalePrice(asset.price),
        cashPopup: createCashPopup(getResalePrice(asset.price), 'Vente', state),
        [action.category]: list.map((item) =>
          item.id === action.id ? { ...item, owned: false } : item,
        ),
      };
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
        cashPopup: createCashPopup(bidPrice, 'Vente marche', state),
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
      const maxDebt = state.level * 50000 * (1 + state.prestigeCount * 0.25);
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

    case 'payBusinessTax': {
      const business = state.businesses.find((item) => item.id === action.id);
      if (!business || business.enterpriseTaxDebt <= 0 || state.cash < business.enterpriseTaxDebt) {
        return state;
      }

      return {
        ...state,
        cash: state.cash - business.enterpriseTaxDebt,
        businesses: state.businesses.map((item) =>
          item.id === action.id
            ? {
                ...item,
                enterpriseTaxDebt: 0,
                reputation: Math.max(45, item.reputation),
                auditRisk: Math.max(0.02, item.auditRisk * 0.7),
              }
            : item,
        ),
      };
    }

    case 'dismissOfflineSummary':
      return {
        ...state,
        offlineSummary: state.offlineSummary
          ? {
              ...state.offlineSummary,
              shown: true,
            }
          : undefined,
      };

    case 'claimMission': {
      const mission = state.missions.find((item) => item.id === action.id);
      if (!mission || mission.claimed || getMetricValue(state, mission.metric) < mission.target) {
        return state;
      }

      return addXp(
        {
          ...state,
          cash: state.cash + mission.reward,
          cashPopup: createCashPopup(mission.reward, 'Mission', state),
          missions: state.missions.map((item) =>
            item.id === action.id ? { ...item, claimed: true } : item,
          ),
        },
        35,
      );
    }

    case 'reset':
      return createInitialState();

    case 'prestige': {
      const stats = getStats(state);
      const gainedPoints = getPrestigeGain(stats.netWorth);
      if (gainedPoints <= 0) return state;

      const fresh = createInitialState();

      return {
        ...fresh,
        cash: fresh.cash + gainedPoints * 2500,
        level: 1,
        xp: 0,
        prestigeCount: state.prestigeCount + 1,
        prestigePoints: state.prestigePoints + gainedPoints,
        totalPrestigePoints: state.totalPrestigePoints + gainedPoints,
        highestNetWorth: Math.max(state.highestNetWorth, stats.netWorth),
        totalEarned: state.totalEarned,
        secondsPlayed: state.secondsPlayed,
        playerProfile: state.playerProfile,
        adRewards: {
          ...fresh.adRewards,
          noAds: state.adRewards.noAds,
          rewardedAdsWatched: state.adRewards.rewardedAdsWatched,
          totalAdCashEarned: state.adRewards.totalAdCashEarned,
          rewardedAdDailyLimit: state.adRewards.rewardedAdDailyLimit,
        },
        dailyRewards: state.dailyRewards,
      };
    }

    case 'connectPlayer': {
      const providerName = action.provider === 'google' ? 'Google' : 'Apple';
      return {
        ...state,
        playerProfile: {
          id: `${action.provider}-${Date.now()}`,
          name: `Joueur ${providerName}`,
          provider: action.provider,
          cloudLinked: true,
          lastCloudSyncAt: 0,
        },
      };
    }

    case 'disconnectPlayer':
      return {
        ...state,
        playerProfile: undefined,
      };

    case 'claimRewardAd': {
      const stats = getStats(state);
      const now = Date.now();
      const cooldown = getAdCooldownRemaining(state.adRewards, now);
      const watchedToday = getRewardedAdsWatchedToday(state.adRewards);

      if (cooldown > 0 || watchedToday >= state.adRewards.rewardedAdDailyLimit) {
        return {
          ...state,
          adRewards: {
            ...state.adRewards,
            lastRewardedAdStatus:
              cooldown > 0 ? `Cooldown ${cooldown}s` : 'Limite journaliere atteinte',
          },
        };
      }

      const rewardCash = getRewardedAdRewardCash(action.reward, stats);
      const rewardedAdDay = getDayKey();

      return {
        ...state,
        cash: state.cash + rewardCash,
        totalEarned: state.totalEarned + rewardCash,
        cashPopup:
          rewardCash > 0
            ? createCashPopup(rewardCash, action.reward === 'skipTime' ? 'Skip temps' : 'Pub recompensee', state)
            : state.cashPopup,
        secondsPlayed: action.reward === 'skipTime' ? state.secondsPlayed + 600 : state.secondsPlayed,
        passiveIncomeElapsed:
          action.reward === 'skipTime'
            ? (state.passiveIncomeElapsed + 600) % PASSIVE_PAYOUT_INTERVAL_SECONDS
            : state.passiveIncomeElapsed,
        adRewards: {
          ...state.adRewards,
          rewardedAdsWatched: state.adRewards.rewardedAdsWatched + 1,
          lastRewardedAdAt: now,
          rewardedAdDay,
          rewardedAdDailyCount:
            state.adRewards.rewardedAdDay === rewardedAdDay
              ? state.adRewards.rewardedAdDailyCount + 1
              : 1,
          totalAdCashEarned: state.adRewards.totalAdCashEarned + rewardCash,
          lastRewardedAdStatus: 'Reward validee',
          bonusMultiplier: action.reward === 'doubleIncome' ? 2 : state.adRewards.bonusMultiplier,
          bonusSecondsRemaining:
            action.reward === 'doubleIncome'
              ? state.adRewards.bonusSecondsRemaining + 300
              : state.adRewards.bonusSecondsRemaining,
        },
      };
    }

    case 'buyNoAds':
      return {
        ...state,
        adRewards: {
          ...state.adRewards,
          noAds: true,
        },
      };

    case 'claimDailyReward': {
      const today = getDayKey();
      if (state.dailyRewards.lastDailyRewardDay === today) return state;
      const streak = state.dailyRewards.lastDailyRewardDay ? state.dailyRewards.streak + 1 : 1;
      const reward = 25000 * Math.min(streak, 30);
      const label = 'Recompense quotidienne';

      return {
        ...state,
        cash: state.cash + reward,
        totalEarned: state.totalEarned + reward,
        cashPopup: createCashPopup(reward, label, state),
        dailyRewards: {
          ...state.dailyRewards,
          streak,
          lastDailyRewardDay: today,
          rewardHistory: appendRewardHistory(state, label, reward),
        },
      };
    }

    case 'openDailyChest': {
      const today = getDayKey();
      if (state.dailyRewards.lastChestDay === today) return state;
      const reward = Math.max(50000, Math.floor(getStats(state).totalIncome * 240));
      const label = 'Coffre quotidien';

      return {
        ...state,
        cash: state.cash + reward,
        totalEarned: state.totalEarned + reward,
        cashPopup: createCashPopup(reward, label, state),
        dailyRewards: {
          ...state.dailyRewards,
          lastChestDay: today,
          rewardHistory: appendRewardHistory(state, label, reward),
        },
      };
    }

    case 'spinLuckyWheel': {
      const today = getDayKey();
      if (state.dailyRewards.lastWheelDay === today) return state;
      const rewards = [35000, 75000, 125000, Math.max(150000, Math.floor(getStats(state).totalIncome * 300))];
      const reward = rewards[(state.secondsPlayed + state.level + state.prestigeCount) % rewards.length];
      const label = 'Roue de la chance';

      return {
        ...state,
        cash: state.cash + reward,
        totalEarned: state.totalEarned + reward,
        cashPopup: createCashPopup(reward, label, state),
        dailyRewards: {
          ...state.dailyRewards,
          lastWheelDay: today,
          rewardHistory: appendRewardHistory(state, label, reward),
        },
      };
    }

    case 'claimConnectionBonus': {
      const today = getDayKey();
      if (state.dailyRewards.lastConnectionBonusDay === today) return state;
      const reward = Math.max(15000, Math.floor(getStats(state).totalIncome * 120));
      const label = 'Bonus de retour';

      return {
        ...state,
        cash: state.cash + reward,
        totalEarned: state.totalEarned + reward,
        cashPopup: createCashPopup(reward, label, state),
        dailyRewards: {
          ...state.dailyRewards,
          lastConnectionBonusDay: today,
          rewardHistory: appendRewardHistory(state, label, reward),
        },
      };
    }

    case 'claimDailyMission': {
      const today = getDayKey();
      const mission = state.dailyRewards.dailyMissions.find((item) => item.id === action.id);
      if (!mission || mission.claimedDay === today) return state;
      if (getDailyMissionProgress(action.id, state) < mission.target) return state;

      return {
        ...state,
        cash: state.cash + mission.reward,
        totalEarned: state.totalEarned + mission.reward,
        cashPopup: createCashPopup(mission.reward, 'Mission quotidienne', state),
        dailyRewards: {
          ...state.dailyRewards,
          rewardHistory: appendRewardHistory(state, mission.title, mission.reward),
          dailyMissions: state.dailyRewards.dailyMissions.map((item) =>
            item.id === action.id ? { ...item, claimedDay: today } : item,
          ),
        },
      };
    }
  }
};

const normalizeMarketPrice = (value: number) => {
  if (value < 0.000001) return 0.000001;
  if (value < 1) return Number(value.toPrecision(4));
  return Math.max(1, Math.round(value));
};

const TAX_RATE = 0.08;
const TAX_SEIZURE_THRESHOLD = 50000;
const MAX_MARKET_VOLUME = 999000000000;

const isTransportBusiness = (business: EmpireState['businesses'][number]) =>
  /Transport|Hospitalite/.test(business.sector) || /taxi|transport|concession|flotte/i.test(business.name);

const simulateBusinesses = (businesses: EmpireState['businesses'], deltaSeconds: number) =>
  businesses.map((business) => {
    if (business.level <= 0) return business;

    const status = getEnterpriseStatus(business);
    const resources = business.resources + getEnterpriseResourcesPerTick(business) * deltaSeconds;
    const maintenance = Math.min(
      100,
      business.maintenance + (business.vehicles * 0.01 + business.buildings * 0.006) * deltaSeconds,
    );
    const projectProgress =
      status === 'suspendu'
        ? business.projectProgress
        : Math.min(100, business.projectProgress + getEnterpriseProgressRate(business) * deltaSeconds);
    const completed = business.projectProgress < 100 && projectProgress >= 100;
    const enterpriseTaxDebt =
      business.enterpriseTaxDebt + Math.floor(business.level * business.baseIncome * 0.012 * deltaSeconds);
    const auditHit = enterpriseTaxDebt > getEnterpriseTaxLimit(business) ? 8 : business.auditRisk > 0.1 ? 0.05 : 0;

    return {
      ...business,
      resources,
      maintenance,
      projectProgress,
      reputation: Math.max(0, Math.min(100, business.reputation - auditHit + (completed ? 2 : 0))),
      enterpriseTaxDebt,
      quality: Math.min(100, business.quality + (completed ? 1 : 0)),
      synergyBonus: business.synergyBonus + (completed ? 0.002 : 0),
    };
  });

const getDayKey = () => new Date().toISOString().slice(0, 10);

const createCashPopup = (amount: number, label: string, state: EmpireState) => ({
  amount,
  label,
  nonce: state.secondsPlayed + Math.floor(Math.random() * 100000),
});

const appendRewardHistory = (state: EmpireState, label: string, amount: number) => [
  {
    id: `${Date.now()}-${label}`,
    label,
    amount,
    claimedAt: Date.now(),
  },
  ...state.dailyRewards.rewardHistory,
].slice(0, 8);

const maybeCreateEconomyEvent = (previousSecond: number, nextSecond: number) => {
  const secondsPlayed = Math.floor(nextSecond / 90) * 90;
  if (secondsPlayed === 0 || Math.floor(previousSecond / 90) === Math.floor(nextSecond / 90)) return undefined;
  const events = [
    {
      id: `boom-${secondsPlayed}`,
      title: 'Hausse des marches',
      description: 'Les investisseurs reviennent, les prix accelerent.',
      tone: 'boom' as const,
      marketModifier: 0.018,
      secondsRemaining: 45,
    },
    {
      id: `crash-${secondsPlayed}`,
      title: 'Crash economique',
      description: 'Panique temporaire, les marches corrigent fortement.',
      tone: 'crash' as const,
      marketModifier: -0.022,
      secondsRemaining: 35,
    },
    {
      id: `flow-${secondsPlayed}`,
      title: 'Rotation capital',
      description: 'Les prix deviennent plus volatils pendant quelques instants.',
      tone: 'neutral' as const,
      marketModifier: 0.006,
      secondsRemaining: 40,
    },
  ];

  return events[Math.floor(secondsPlayed / 90) % events.length];
};

const getDailyMissionProgress = (
  id: 'income' | 'invest' | 'asset',
  state: EmpireState,
) => {
  const stats = getStats(state);
  if (id === 'income') return state.totalEarned;
  if (id === 'invest') return stats.marketUnits;
  return stats.realEstateOwned + stats.carsOwned + stats.luxuryOwned + stats.collectionsOwned;
};

const applyTaxSeizure = (state: EmpireState): EmpireState => {
  const limit = Math.max(TAX_SEIZURE_THRESHOLD, state.level * 25000 * (1 + state.prestigeCount * 0.2));

  if (state.taxDebt < limit) {
    return state;
  }

  const incomeBuffer = Math.max(10000, getStats(state).totalIncome * 10);
  const availableAfterProtection = Math.max(0, state.cash + state.bank - incomeBuffer);
  const seizureAmount = Math.min(availableAfterProtection, Math.ceil(state.taxDebt * 0.25));
  if (seizureAmount <= 0) return state;

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

const getEffectiveBusinessMaxLevel = (baseMaxLevel: number, _prestigeCount: number) =>
  Math.min(BUSINESS_MAX_LEVEL, baseMaxLevel);
