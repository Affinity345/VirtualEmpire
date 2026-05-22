export type EmpireTab =
  | 'dashboard'
  | 'business'
  | 'trading'
  | 'investments'
  | 'bank'
  | 'realEstate'
  | 'wealth'
  | 'profile'
  | 'cars'
  | 'luxury'
  | 'collections'
  | 'missions'
  | 'stats';

export type CatalogKind =
  | 'businesses'
  | 'realEstate'
  | 'cars'
  | 'luxury'
  | 'collections';

export type OwnableCategory = Exclude<CatalogKind, 'businesses'>;

export type AssetRarity = 'Commun' | 'Rare' | 'Epic' | 'Legendaire' | 'Mythique';

export type OfflineSummary = {
  secondsAway: number;
  cashEarned: number;
  taxesAdded: number;
  projectsCompleted: number;
  events: string[];
  shown: boolean;
};

export type BusinessAsset = {
  id: string;
  name: string;
  sector: string;
  icon: string;
  basePrice: number;
  baseIncome: number;
  level: number;
  maxLevel: number;
  rarity: AssetRarity;
  unlockLevel: number;
  employees: number;
  vehicles: number;
  buildings: number;
  resources: number;
  projectName: string;
  projectProgress: number;
  quality: number;
  maintenance: number;
  efficiency: number;
  reputation: number;
  enterpriseTaxDebt: number;
  auditRisk: number;
  synergyBonus: number;
  imageSlot: string;
  imageUrl: string;
};

export type OwnableAsset = {
  id: string;
  name: string;
  category: OwnableCategory;
  tier: string;
  icon: string;
  price: number;
  passiveIncome: number;
  owned: boolean;
  rarity: AssetRarity;
  unlockLevel: number;
  imageSlot: string;
  imageUrl: string;
};

export type MarketAsset = {
  id: string;
  name: string;
  type: 'Crypto' | 'Action' | 'Immobilier' | 'Matiere premiere' | 'Indice';
  symbol: string;
  price: number;
  previousPrice: number;
  dayOpen: number;
  owned: number;
  averageCost: number;
  invested: number;
  realizedProfit: number;
  trades: number;
  volatility: number;
  trend: number;
  momentum: number;
  spread: number;
  volume: number;
  risk: 'Faible' | 'Modere' | 'Eleve' | 'Extreme';
};

export type AuthProvider = 'google' | 'apple';

export type PlayerProfile = {
  id: string;
  name: string;
  provider: AuthProvider;
  cloudLinked: boolean;
  lastCloudSyncAt: number;
};

export type AdRewards = {
  rewardedAdsWatched: number;
  noAds: boolean;
  bonusMultiplier: number;
  bonusSecondsRemaining: number;
  totalAdCashEarned: number;
};

export type CashPopup = {
  amount: number;
  label: string;
  nonce: number;
};

export type DailyMission = {
  id: 'income' | 'invest' | 'asset';
  title: string;
  target: number;
  reward: number;
  claimedDay?: string;
};

export type DailyRewards = {
  streak: number;
  lastDailyRewardDay?: string;
  lastChestDay?: string;
  lastWheelDay?: string;
  lastConnectionBonusDay?: string;
  dailyMissions: DailyMission[];
};

export type EconomyEvent = {
  id: string;
  title: string;
  description: string;
  tone: 'boom' | 'crash' | 'neutral';
  marketModifier: number;
  secondsRemaining: number;
};

export type Mission = {
  id: string;
  title: string;
  reward: number;
  target: number;
  metric:
    | 'cash'
    | 'netWorth'
    | 'businessLevels'
    | 'realEstateOwned'
    | 'carsOwned'
    | 'luxuryOwned'
    | 'collectionsOwned'
    | 'marketUnits'
    | 'bank';
  claimed: boolean;
};

export type EmpireState = {
  version: number;
  cash: number;
  bank: number;
  debt: number;
  taxDebt: number;
  lastSeizureAmount: number;
  seizureCount: number;
  prestigeCount: number;
  prestigePoints: number;
  totalPrestigePoints: number;
  highestNetWorth: number;
  playerProfile?: PlayerProfile;
  adRewards: AdRewards;
  dailyRewards: DailyRewards;
  economyEvent?: EconomyEvent;
  cashPopup?: CashPopup;
  offlineSummary?: OfflineSummary;
  level: number;
  xp: number;
  totalEarned: number;
  secondsPlayed: number;
  businesses: BusinessAsset[];
  realEstate: OwnableAsset[];
  cars: OwnableAsset[];
  luxury: OwnableAsset[];
  collections: OwnableAsset[];
  market: MarketAsset[];
  missions: Mission[];
  lastSavedAt?: number;
};

export type EmpireStats = {
  businessIncome: number;
  realEstateIncome: number;
  totalIncome: number;
  marketValue: number;
  marketInvested: number;
  marketUnrealizedProfit: number;
  marketRealizedProfit: number;
  assetValue: number;
  netWorth: number;
  businessLevels: number;
  realEstateOwned: number;
  carsOwned: number;
  luxuryOwned: number;
  collectionsOwned: number;
  marketUnits: number;
  prestigeMultiplier: number;
  adBonusMultiplier: number;
  totalRevenueMultiplier: number;
  nextPrestigePoints: number;
};
