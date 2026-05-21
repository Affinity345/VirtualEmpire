import { BusinessAsset, MarketAsset, Mission, OwnableAsset } from '@/game/types';

const businessSeeds = [
  ['private-cafe', 'Cafe prive', 'Hospitalite', 'VC', 5000, 18, 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=900&q=80'],
  ['luxury-gym', 'Club fitness prestige', 'Bien-etre', 'FG', 28000, 105, 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=900&q=80'],
  ['night-venue', 'Lounge nocturne', 'Divertissement', 'LN', 92000, 410, 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=900&q=80'],
  ['boutique-hotel', 'Hotel boutique', 'Hotellerie', 'HB', 260000, 1250, 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80'],
  ['media-studio', 'Studio media', 'Creation', 'SM', 780000, 3800, 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80'],
  ['fintech-app', 'App fintech', 'Technologie', 'FT', 2200000, 11500, 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80'],
  ['private-bank', 'Banque privee', 'Finance', 'BP', 8900000, 46000, 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=900&q=80'],
  ['airline', 'Compagnie aerienne', 'Transport', 'CA', 36000000, 188000, 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=900&q=80'],
  ['ai-lab', 'Laboratoire IA', 'Innovation', 'IA', 145000000, 820000, 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80'],
  ['space-holdings', 'Groupe orbital', 'Aerospace', 'GO', 680000000, 4100000, 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=900&q=80'],
] as const;

const ownableSeeds = {
  realEstate: [
    ['marble-loft', 'Loft marbre', 'Prime', 'LF', 85000, 280, 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80'],
    ['sky-penthouse', 'Penthouse skyline', 'Elite', 'PH', 420000, 1450, 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=80'],
    ['coastal-villa', 'Villa cote privee', 'Prestige', 'VL', 2100000, 7200, 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=900&q=80'],
    ['business-tower', 'Tour corporate', 'Empire', 'TR', 18000000, 66000, 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=900&q=80'],
    ['private-island', 'Ile souveraine', 'Legendary', 'IL', 120000000, 420000, 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80'],
  ],
  cars: [
    ['amg-gt', 'AMG GT Black', 'Sport', 'GT', 118000, 0, 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=80'],
    ['porsche-turbo', '911 Turbo S', 'Performance', '911', 240000, 0, 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=900&q=80'],
    ['ferrari-sf', 'Ferrari SF90', 'Hypercar', 'SF', 620000, 0, 'https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=900&q=80'],
    ['rolls-ghost', 'Rolls Ghost', 'Executive', 'RG', 760000, 0, 'https://images.unsplash.com/photo-1549925862-99055b663c2e?auto=format&fit=crop&w=900&q=80'],
    ['bugatti-royal', 'Bugatti Royale', 'Collector', 'BR', 4200000, 0, 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&w=900&q=80'],
  ],
  luxury: [
    ['daytona-gold', 'Daytona or noir', 'Horlogerie', 'DX', 56000, 0, 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=900&q=80'],
    ['blue-diamond', 'Diamant bleu', 'Joaillerie', 'BD', 320000, 0, 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=900&q=80'],
    ['g700', 'Gulfstream G700', 'Aviation', 'G7', 78000000, 0, 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?auto=format&fit=crop&w=900&q=80'],
    ['shadow-yacht', 'Yacht Shadow 90', 'Nautique', 'YS', 145000000, 0, 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&w=900&q=80'],
    ['royal-crown', 'Couronne maison', 'Heritage', 'CR', 380000000, 0, 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=900&q=80'],
  ],
  collections: [
    ['roman-coin', 'Piece imperiale', 'Antiquite', 'PI', 12000, 0, 'https://images.unsplash.com/photo-1605792657660-596af9009e82?auto=format&fit=crop&w=900&q=80'],
    ['rare-card', 'Carte signee rare', 'Culture', 'RC', 88000, 0, 'https://images.unsplash.com/photo-1613771404784-3a5686aa2be3?auto=format&fit=crop&w=900&q=80'],
    ['old-master', 'Toile de maitre', 'Art', 'TM', 720000, 0, 'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=900&q=80'],
    ['meteorite', 'Meteorite noire', 'Science', 'MT', 1600000, 0, 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=900&q=80'],
    ['royal-archive', 'Archive royale', 'Histoire', 'AR', 7800000, 0, 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=900&q=80'],
  ],
} as const;

export const buildBusinesses = (): BusinessAsset[] =>
  businessSeeds.flatMap((seed, cycle) =>
    Array.from({ length: 12 }, (_, index) => {
      const rank = cycle * 12 + index;
      const region = businessRegions[rank % businessRegions.length];
      return {
        id: `${seed[0]}-${index + 1}`,
        name: index === 0 ? seed[1] : `${seed[1]} ${region}`,
        sector: seed[2],
        icon: seed[3],
        basePrice: Math.floor(seed[4] * Math.pow(1.34, index) * Math.pow(1.18, cycle)),
        baseIncome: Math.floor(seed[5] * Math.pow(1.25, index) * Math.pow(1.14, cycle)),
        level: 0,
        maxLevel: rank > 84 ? 100 : rank > 48 ? 75 : 50,
        imageSlot: `businesses/${seed[0]}-${index + 1}`,
        imageUrl: seed[6],
      };
    }),
  );

const buildOwnables = (
  category: OwnableAsset['category'],
  seeds: readonly (readonly [string, string, string, string, number, number, string])[],
): OwnableAsset[] =>
  seeds.flatMap((seed, seedIndex) =>
    Array.from({ length: 24 }, (_, index) => {
      const rank = seedIndex * 24 + index;
      const suffix = luxurySuffixes[rank % luxurySuffixes.length];

      return {
        id: `${seed[0]}-${index + 1}`,
        name: index === 0 ? seed[1] : `${seed[1]} ${suffix}`,
        category,
        tier: rank > 96 ? 'Mythique' : rank > 60 ? 'Empire' : seed[2],
        icon: seed[3],
        price: Math.floor(seed[4] * Math.pow(1.19, index) * Math.pow(1.32, seedIndex)),
        passiveIncome:
          seed[5] > 0 ? Math.floor(seed[5] * Math.pow(1.15, index) * Math.pow(1.18, seedIndex)) : 0,
        owned: false,
        imageSlot: `${category}/${seed[0]}-${index + 1}`,
        imageUrl: seed[6],
      };
    }),
  );

export const buildRealEstate = () => buildOwnables('realEstate', ownableSeeds.realEstate);
export const buildCars = () => buildOwnables('cars', ownableSeeds.cars);
export const buildLuxury = () => buildOwnables('luxury', ownableSeeds.luxury);
export const buildCollections = () => buildOwnables('collections', ownableSeeds.collections);

const businessRegions = [
  'Paris',
  'Dubai',
  'Monaco',
  'New York',
  'Tokyo',
  'Singapore',
  'London',
  'Casablanca',
  'Miami',
  'Geneva',
  'Doha',
  'Seoul',
];

const luxurySuffixes = [
  'Noir',
  'Gold',
  'Signature',
  'Royal',
  'One',
  'Imperial',
  'Atelier',
  'Reserve',
  'Eclipse',
  'Majestic',
  'Platinum',
  'Sovereign',
];

const investmentSeeds = [
  ['btc', 'Bitcoin Reserve', 'Crypto', 'BTC', 65000, 0.08, 0.006, 0.006, 840000000, 'Extreme'],
  ['aurum', 'Aurum Index', 'Indice', 'AUR', 1450, 0.035, 0.003, 0.003, 185000000, 'Modere'],
  ['oil', 'Black Oil', 'Matiere premiere', 'OIL', 86, 0.045, 0.001, 0.004, 420000000, 'Eleve'],
  ['aiq', 'AI Quant Fund', 'Action', 'AIQ', 510, 0.075, 0.008, 0.007, 260000000, 'Extreme'],
  ['lux', 'Luxury Holdings', 'Action', 'LUX', 980, 0.04, 0.004, 0.005, 124000000, 'Modere'],
  ['eth', 'Ethereum Treasury', 'Crypto', 'ETH', 3200, 0.07, 0.005, 0.006, 620000000, 'Extreme'],
  ['sol', 'Solana Velocity', 'Crypto', 'SOL', 180, 0.09, 0.006, 0.008, 310000000, 'Extreme'],
  ['estate', 'Prime Real Estate Fund', 'Indice', 'REF', 760, 0.025, 0.002, 0.003, 96000000, 'Faible'],
  ['gold', 'Gold Vault Contract', 'Matiere premiere', 'GLD', 2350, 0.022, 0.001, 0.002, 540000000, 'Faible'],
  ['robotics', 'Robotics Equity', 'Action', 'RBX', 420, 0.055, 0.005, 0.005, 170000000, 'Eleve'],
  ['doge', 'Doge Crown', 'Crypto', 'DOGE', 0.16, 0.14, 0.004, 0.018, 720000000, 'Extreme'],
  ['shiba', 'Shiba Gold', 'Crypto', 'SHIB', 0.000025, 0.16, 0.004, 0.022, 680000000, 'Extreme'],
  ['pepe', 'Pepe Vault', 'Crypto', 'PEPE', 0.000011, 0.18, 0.005, 0.024, 520000000, 'Extreme'],
  ['floki', 'Floki Empire', 'Crypto', 'FLOKI', 0.00019, 0.17, 0.005, 0.023, 310000000, 'Extreme'],
  ['bonk', 'Bonk Reserve', 'Crypto', 'BONK', 0.000028, 0.19, 0.006, 0.026, 260000000, 'Extreme'],
  ['wif', 'Hat Coin', 'Crypto', 'WIF', 2.75, 0.18, 0.006, 0.021, 430000000, 'Extreme'],
  ['meme', 'Meme Index', 'Crypto', 'MEME', 0.034, 0.15, 0.004, 0.019, 190000000, 'Extreme'],
  ['cat', 'Cat Mogul', 'Crypto', 'CAT', 0.006, 0.2, 0.006, 0.027, 155000000, 'Extreme'],
] as const;

const investmentSeries = [
  'Prime',
  'Capital',
  'Alpha',
  'Omega',
  'Global',
  'Sovereign',
  'Apex',
  'Nova',
  'Summit',
  'Atlas',
  'Crown',
  'Legacy',
] as const;

export const buildMarket = (): MarketAsset[] =>
  investmentSeeds.flatMap((seed) =>
    investmentSeries.map((series, index) => {
      const rawPrice = seed[4] * Math.pow(1.11, index);
      const price = rawPrice < 1 ? Number(rawPrice.toPrecision(3)) : Math.floor(rawPrice);
      const symbol = index === 0 ? seed[3] : `${seed[3]}${index + 1}`;

      return {
        id: index === 0 ? seed[0] : `${seed[0]}-${index + 1}`,
        name: index === 0 ? seed[1] : `${seed[1]} ${series}`,
        type: seed[2],
        symbol,
        price,
        previousPrice: price,
        dayOpen: price,
        owned: 0,
        averageCost: 0,
        invested: 0,
        realizedProfit: 0,
        trades: 0,
        volatility: seed[5],
        trend: seed[6],
        momentum: seed[6] * 0.2,
        spread: seed[7],
        volume: Math.floor(seed[8] * Math.pow(1.04, index)),
        risk: seed[9],
      };
    }),
  );

export const buildMissions = (): Mission[] => [
  { id: 'cash-100k', title: 'Atteindre 100 000 cash', reward: 6000, target: 100000, metric: 'cash', claimed: false },
  { id: 'networth-1m', title: 'Construire 1M de patrimoine', reward: 25000, target: 1000000, metric: 'netWorth', claimed: false },
  { id: 'business-25', title: 'Cumuler 25 niveaux business', reward: 18000, target: 25, metric: 'businessLevels', claimed: false },
  { id: 'estate-3', title: 'Posseder 3 biens immobiliers', reward: 40000, target: 3, metric: 'realEstateOwned', claimed: false },
  { id: 'cars-3', title: 'Monter un garage de 3 voitures', reward: 22000, target: 3, metric: 'carsOwned', claimed: false },
  { id: 'bank-250k', title: 'Placer 250 000 en banque', reward: 18000, target: 250000, metric: 'bank', claimed: false },
  { id: 'market-20', title: 'Detenir 20 positions de trading', reward: 16000, target: 20, metric: 'marketUnits', claimed: false },
];
