export type EmpireTab =
  | 'dashboard'
  | 'business'
  | 'trading'
  | 'bank'
  | 'realEstate'
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

export type BusinessAsset = {
  id: string;
  name: string;
  sector: string;
  icon: string;
  basePrice: number;
  baseIncome: number;
  level: number;
  maxLevel: number;
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
  imageSlot: string;
  imageUrl: string;
};

export type MarketAsset = {
  id: string;
  name: string;
  type: 'Crypto' | 'Action' | 'Matiere premiere' | 'Indice';
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
};
