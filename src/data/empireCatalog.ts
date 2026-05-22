import { AssetRarity, BusinessAsset, MarketAsset, Mission, OwnableAsset } from '@/game/types';

const businessSeeds = [
  ['premium-restaurant', 'Restaurant signature', 'Restaurants', 'RS', 4500, 18, 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=900&q=80'],
  ['private-cafe', 'Cafe prive', 'Cafes', 'CP', 8200, 32, 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=900&q=80'],
  ['boutique-hotel', 'Hotel boutique', 'Hotels', 'HT', 26000, 95, 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80'],
  ['luxury-gym', 'Club fitness prestige', 'Fitness', 'FT', 52000, 190, 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=900&q=80'],
  ['taxi-fleet', 'Flotte taxi executive', 'Taxis', 'TX', 95000, 360, 'https://images.unsplash.com/photo-1494515843206-f3117d3f51b7?auto=format&fit=crop&w=900&q=80'],
  ['logistics-hub', 'Hub transport premium', 'Transport', 'TR', 180000, 720, 'https://images.unsplash.com/photo-1494412519320-aa613dfb7738?auto=format&fit=crop&w=900&q=80'],
  ['smart-factory', 'Usine intelligente', 'Usines', 'US', 360000, 1450, 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=900&q=80'],
  ['construction-group', 'Groupe construction', 'Construction', 'GC', 720000, 3000, 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=900&q=80'],
  ['software-studio', 'Studio informatique', 'Informatique', 'SI', 1400000, 6400, 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80'],
  ['private-bank', 'Banque privee', 'Banques', 'BP', 2900000, 13500, 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=900&q=80'],
  ['retail-plaza', 'Galerie commerciale', 'Immobilier commercial', 'IC', 5600000, 27000, 'https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?auto=format&fit=crop&w=900&q=80'],
  ['energy-grid', 'Reseau energie', 'Energie', 'EN', 11000000, 56000, 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=900&q=80'],
  ['luxury-house', 'Maison luxe', 'Luxe', 'LX', 22000000, 118000, 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=900&q=80'],
  ['airline', 'Compagnie aviation', 'Aviation', 'AV', 43000000, 245000, 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=900&q=80'],
  ['medical-network', 'Reseau sante privee', 'Sante', 'SP', 86000000, 520000, 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=900&q=80'],
  ['entertainment-studio', 'Studio divertissement', 'Divertissement', 'DV', 170000000, 1100000, 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=900&q=80'],
  ['tech-campus', 'Campus technologie', 'Technologie', 'TC', 330000000, 2300000, 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80'],
  ['ai-lab', 'Laboratoire IA', 'IA', 'IA', 640000000, 4900000, 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80'],
  ['blockchain-protocol', 'Protocole blockchain', 'Blockchain', 'BC', 1250000000, 10500000, 'https://images.unsplash.com/photo-1642104704074-907c0698cbd9?auto=format&fit=crop&w=900&q=80'],
  ['orbital-venture', 'Venture orbital', 'Aerospace', 'OR', 2400000000, 22500000, 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=900&q=80'],
  ['multinational-group', 'Multinationale empire', 'Multinationales', 'MN', 4800000000, 46000000, 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=900&q=80'],
  ['sovereign-holding', 'Holding souveraine', 'Holdings', 'HD', 7200000000, 72000000, 'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=900&q=80'],
  ['quant-hedge-fund', 'Hedge fund quant', 'Hedge funds', 'HF', 10500000000, 118000000, 'https://images.unsplash.com/photo-1642790106117-e829e14a795f?auto=format&fit=crop&w=900&q=80'],
  ['private-equity-office', 'Private equity office', 'Private equity', 'PE', 15500000000, 184000000, 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=900&q=80'],
  ['couture-maison', 'Maison de luxe mondiale', 'Marques de luxe', 'ML', 22000000000, 280000000, 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=900&q=80'],
  ['private-aviation-group', 'Aviation privee elite', 'Aviation privee', 'AP', 31000000000, 420000000, 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?auto=format&fit=crop&w=900&q=80'],
  ['ai-business-suite', 'IA business suite', 'IA business', 'IB', 44000000000, 660000000, 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=900&q=80'],
  ['mega-commercial-estate', 'Mega parc commercial', 'Immobilier commercial geant', 'MG', 61000000000, 920000000, 'https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?auto=format&fit=crop&w=900&q=80'],
  ['global-franchise-network', 'Franchise mondiale', 'Franchises mondiales', 'FM', 84000000000, 1350000000, 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=900&q=80'],
  ['unicorn-venture', 'Startup unicorn', 'Startups unicorn', 'SU', 115000000000, 1980000000, 'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=900&q=80'],
  ['empire-conglomerate', 'Conglomerat imperial', 'Conglomerats', 'CG', 165000000000, 3100000000, 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=900&q=80'],
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

const premiumImagePools = {
  businesses: [
    'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=720&h=540&q=82',
    'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=720&h=540&q=82',
    'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=720&h=540&q=82',
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=720&h=540&q=82',
    'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=720&h=540&q=82',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=720&h=540&q=82',
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=720&h=540&q=82',
    'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=720&h=540&q=82',
    'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=720&h=540&q=82',
    'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=720&h=540&q=82',
  ],
  realEstate: [
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=720&h=540&q=82',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=720&h=540&q=82',
    'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=720&h=540&q=82',
    'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=720&h=540&q=82',
    'https://images.unsplash.com/photo-1600607687644-c7171b42498b?auto=format&fit=crop&w=720&h=540&q=82',
    'https://images.unsplash.com/photo-1600573472592-401b489a3cdc?auto=format&fit=crop&w=720&h=540&q=82',
    'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=720&h=540&q=82',
    'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=720&h=540&q=82',
    'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=720&h=540&q=82',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=720&h=540&q=82',
  ],
  cars: [
    'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=720&h=540&q=82',
    'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=720&h=540&q=82',
    'https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=720&h=540&q=82',
    'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&w=720&h=540&q=82',
    'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=720&h=540&q=82',
    'https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?auto=format&fit=crop&w=720&h=540&q=82',
    'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=720&h=540&q=82',
    'https://images.unsplash.com/photo-1549925862-99055b663c2e?auto=format&fit=crop&w=720&h=540&q=82',
    'https://images.unsplash.com/photo-1555353540-64580b51c258?auto=format&fit=crop&w=720&h=540&q=82',
    'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=720&h=540&q=82',
  ],
  luxury: [
    'https://images.unsplash.com/photo-1540962351504-03099e0a754b?auto=format&fit=crop&w=720&h=540&q=82',
    'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&w=720&h=540&q=82',
    'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=720&h=540&q=82',
    'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=720&h=540&q=82',
    'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=720&h=540&q=82',
    'https://images.unsplash.com/photo-1523292562811-8fa7962a78c8?auto=format&fit=crop&w=720&h=540&q=82',
    'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=720&h=540&q=82',
    'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=720&h=540&q=82',
    'https://images.unsplash.com/photo-1589994965851-a8f479c573a9?auto=format&fit=crop&w=720&h=540&q=82',
    'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=720&h=540&q=82',
  ],
  collections: [
    'https://images.unsplash.com/photo-1605792657660-596af9009e82?auto=format&fit=crop&w=720&h=540&q=82',
    'https://images.unsplash.com/photo-1613771404784-3a5686aa2be3?auto=format&fit=crop&w=720&h=540&q=82',
    'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=720&h=540&q=82',
    'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=720&h=540&q=82',
    'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=720&h=540&q=82',
    'https://images.unsplash.com/photo-1564399579883-451a5d44ec08?auto=format&fit=crop&w=720&h=540&q=82',
    'https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?auto=format&fit=crop&w=720&h=540&q=82',
    'https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=720&h=540&q=82',
    'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=720&h=540&q=82',
    'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=720&h=540&q=82',
  ],
} as const;

const getPremiumImageUrl = (
  category: keyof typeof premiumImagePools,
  index: number,
  fallback: string,
) => premiumImagePools[category][index % premiumImagePools[category].length] ?? fallback;

const getRarity = (rank: number): AssetRarity => {
  if (rank >= 104) return 'Mythique';
  if (rank >= 78) return 'Legendaire';
  if (rank >= 48) return 'Epic';
  if (rank >= 18) return 'Rare';
  return 'Commun';
};

const getUnlockLevel = (rank: number) => {
  if (rank < 12) return 1;
  return Math.min(220, Math.floor(rank * 1.8));
};

const stableShuffle = <T,>(items: T[]) =>
  items
    .map((item, index) => ({ item, score: (index * 37 + 17) % items.length }))
    .sort((left, right) => left.score - right.score)
    .map(({ item }) => item);

const businessCities = stableShuffle([
  'Monaco',
  'Dubai',
  'Tokyo',
  'Paris',
  'NYC',
  'Singapore',
  'London',
  'Casablanca',
  'Miami',
  'Geneve',
  'Seoul',
  'Riyadh',
  'Marrakech',
  'Los Angeles',
  'Doha',
]);

const BUSINESS_VARIANTS_PER_SEED = 15;

const getBusinessRarity = (rank: number): AssetRarity => {
  if (rank >= 450) return 'Mythique';
  if (rank >= 420) return 'Legendaire';
  if (rank >= 260) return 'Epic';
  if (rank >= 110) return 'Rare';
  return 'Commun';
};

export const buildBusinesses = (): BusinessAsset[] =>
  Array.from({ length: businessSeeds.length * BUSINESS_VARIANTS_PER_SEED }, (_, rank) => {
        const seed = businessSeeds[rank % businessSeeds.length];
        const index = Math.floor(rank / businessSeeds.length);
        const seedIndex = rank % businessSeeds.length;
        const isTransportSector = ['Taxis', 'Transport', 'Aviation', 'Aviation privee'].includes(seed[2]);
        const economy = getBusinessEconomy(rank, seed[5]);
        return {
          id: `${seed[0]}-${index + 1}`,
          name: `${seed[1]} ${businessCities[index % businessCities.length]}`,
          sector: seed[2],
          icon: seed[3],
          basePrice: economy.basePrice,
          baseIncome: economy.baseIncome,
          level: 0,
          maxLevel: 50,
          rarity: getBusinessRarity(rank),
          unlockLevel: getUnlockLevel(rank),
          employees: Math.max(2, 3 + Math.floor(rank / 24) + index * 2),
          vehicles: isTransportSector ? Math.max(1, index + 1 + Math.floor(seedIndex / 5)) : Math.floor(index / 3),
          buildings: Math.max(1, Math.floor(seedIndex / 5) + Math.floor(index / 3) + 1),
          resources: 0,
          projectName: getBusinessProjectName(seed[2]),
          projectProgress: 0,
          quality: 70 + (rank % 20),
          maintenance: 18 + (rank % 28),
          efficiency: 0.8 + (rank % 10) / 30,
          reputation: 80,
          enterpriseTaxDebt: 0,
          auditRisk: 0.05 + (rank % 12) / 200,
          synergyBonus: 0,
          imageSlot: `businesses/${seed[0]}-${index + 1}`,
          imageUrl: getPremiumImageUrl('businesses', rank, seed[6]),
        };
      });

const businessPriceMilestones = [
  500,
  1200,
  2500,
  5000,
  10000,
  18000,
  28000,
  38000,
  50000,
] as const;

const getBusinessEconomy = (rank: number, seedIncome: number) => {
  const basePrice = getBusinessBasePrice(rank);
  const roiSeconds = getBusinessTargetRoiSeconds(rank);
  const seedFlavor = 0.95 + (seedIncome % 17) / 100;
  return {
    basePrice,
    baseIncome: Math.max(1, Math.floor((basePrice / roiSeconds) * seedFlavor)),
  };
};

const getBusinessBasePrice = (rank: number) => {
  if (rank < businessPriceMilestones.length) return businessPriceMilestones[rank];
  if (rank < 45) return interpolatePrice(rank, 9, 44, 50000, 1000000);
  if (rank < 120) return interpolatePrice(rank, 45, 119, 1000000, 25000000);
  if (rank < 210) return interpolatePrice(rank, 120, 209, 25000000, 500000000);
  if (rank < 315) return interpolatePrice(rank, 210, 314, 500000000, 10000000000);

  return interpolatePrice(rank, 315, businessSeeds.length * BUSINESS_VARIANTS_PER_SEED - 1, 10000000000, 55000000000);
};

const getBusinessTargetRoiSeconds = (rank: number) => {
  if (rank < 12) return interpolateLinear(rank, 0, 11, 180, 300);
  if (rank < 45) return interpolateLinear(rank, 12, 44, 300, 480);
  if (rank < 120) return interpolateLinear(rank, 45, 119, 540, 900);
  if (rank < 210) return interpolateLinear(rank, 120, 209, 900, 1260);
  if (rank < 315) return interpolateLinear(rank, 210, 314, 1260, 1620);
  return 1800;
};

const interpolateLinear = (
  value: number,
  startIndex: number,
  endIndex: number,
  startValue: number,
  endValue: number,
) => {
  const progress = Math.max(0, Math.min(1, (value - startIndex) / Math.max(1, endIndex - startIndex)));
  return Math.round(startValue + (endValue - startValue) * progress);
};

const interpolatePrice = (
  value: number,
  startIndex: number,
  endIndex: number,
  startPrice: number,
  endPrice: number,
) => {
  const progress = Math.max(0, Math.min(1, (value - startIndex) / Math.max(1, endIndex - startIndex)));
  return Math.round(startPrice * Math.pow(endPrice / startPrice, progress));
};

const getBusinessProjectName = (sector: string) => {
  if (sector === 'Restaurants' || sector === 'Cafes') return 'Service premium';
  if (sector === 'Hotels') return 'Ouverture suites';
  if (sector === 'Fitness') return 'Abonnements elite';
  if (sector === 'Taxis') return 'Rotation chauffeurs';
  if (sector === 'Technologie') return 'Sprint produit';
  if (sector === 'Informatique') return 'Sprint produit';
  if (sector === 'Transport') return 'Rotation flotte';
  if (sector === 'Usines') return 'Production automatisee';
  if (sector === 'Construction') return 'Chantier premium';
  if (sector === 'Banques') return 'Audit capital';
  if (sector === 'Immobilier commercial') return 'Location boutiques';
  if (sector === 'Energie') return 'Rendement reseau';
  if (sector === 'Luxe') return 'Collection capsule';
  if (sector === 'Aviation') return 'Lignes privees';
  if (sector === 'Sante') return 'Clinique premium';
  if (sector === 'Divertissement') return 'Production globale';
  if (sector === 'IA') return 'Prototype IA';
  if (sector === 'Blockchain') return 'Validation reseau';
  if (sector === 'Aerospace') return 'Module orbital';
  if (sector === 'Multinationales') return 'Expansion continentale';
  if (sector === 'Holdings') return 'Allocation capital';
  if (sector === 'Hedge funds') return 'Strategie quant';
  if (sector === 'Private equity') return 'Acquisition cible';
  if (sector === 'Marques de luxe') return 'Lancement maison';
  if (sector === 'Aviation privee') return 'Flotte executive';
  if (sector === 'IA business') return 'Automatisation board';
  if (sector === 'Immobilier commercial geant') return 'Mega leasing';
  if (sector === 'Franchises mondiales') return 'Deploiement global';
  if (sector === 'Startups unicorn') return 'Scale-up mondial';
  if (sector === 'Conglomerats') return 'Synergie empire';
  return 'Projet operationnel';
};

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
        price: getOwnablePrice(category, seedIndex, index),
        passiveIncome: getOwnablePassiveIncome(category, seedIndex, index, seed[5]),
        owned: false,
        rarity: getRarity(rank),
        unlockLevel: getUnlockLevel(rank),
        imageSlot: `${category}/${seed[0]}-${index + 1}`,
        imageUrl: getPremiumImageUrl(category, rank, seed[6]),
      };
	    }),
	  );

const getOwnablePrice = (
  category: OwnableAsset['category'],
  seedIndex: number,
  index: number,
) => {
  if (category === 'realEstate') {
    const ranges = [
      [80000, 500000],
      [5000000, 50000000],
      [800000, 10000000],
      [100000000, 2000000000],
      [50000000, 1200000000],
    ] as const;
    return getRangePrice(index, ranges[seedIndex]);
  }

  if (category === 'cars') {
    const ranges = [
      [50000, 300000],
      [50000, 300000],
      [300000, 1000000],
      [300000, 1000000],
      [1000000, 20000000],
    ] as const;
    return getRangePrice(index, ranges[seedIndex]);
  }

  if (category === 'luxury') {
    const ranges = [
      [50000, 300000],
      [300000, 20000000],
      [5000000, 80000000],
      [2000000, 200000000],
      [1000000, 30000000],
    ] as const;
    return getRangePrice(index, ranges[seedIndex]);
  }

  const collectionRanges = [
    [10000, 500000],
    [50000, 2000000],
    [500000, 30000000],
    [1000000, 25000000],
    [2000000, 50000000],
  ] as const;
  return getRangePrice(index, collectionRanges[seedIndex]);
};

const getRangePrice = (index: number, range: readonly [number, number]) =>
  interpolatePrice(index, 0, 23, range[0], range[1]);

const getOwnablePassiveIncome = (
  category: OwnableAsset['category'],
  seedIndex: number,
  index: number,
  seedPassiveIncome: number,
) => {
  if (seedPassiveIncome <= 0) return 0;
  const price = getOwnablePrice(category, seedIndex, index);
  const roiSeconds = interpolateLinear(seedIndex * 24 + index, 0, 119, 900, 2400);
  return Math.max(1, Math.floor(price / roiSeconds));
};

const realEstateNames = stableShuffle(
  [
    'Penthouse',
    'Villa',
    'Loft',
    'Chateau',
    'Appartement',
    'Residence',
    'Tour Business',
    'Palais',
    'Manoir',
    'Domaine',
    'Sky Villa',
    'Maison Privee',
  ].flatMap((type) =>
    [
      'Monaco',
      'Dubai',
      'Tokyo',
      'Suisse',
      'Malibu',
      'Paris',
      'Beverly Hills',
      'NYC',
      'Miami',
      'Singapore',
    ].map((city) => `${type} ${city}`),
  ),
);

const carNames = stableShuffle(
  [
    'Aston Martin Valhalla',
    'Bentley Continental',
    'Bugatti Chiron',
    'Ferrari Roma',
    'Lamborghini Revuelto',
    'McLaren Artura',
    'Mercedes AMG One',
    'Porsche Turbo S',
    'Range Rover SV',
    'Rolls Royce Phantom',
    'Maserati MC20',
    'Koenigsegg Jesko',
  ].flatMap((model) =>
    [
      'Monaco',
      'Dubai',
      'Tokyo',
      'Black Gold',
      'Sovereign',
      'Midnight',
      'Atelier',
      'Carbon',
      'Imperial',
      'Royal',
    ].map((edition) => `${model} ${edition}`),
  ),
);

const luxuryNames = stableShuffle(
  [
    'Jet Prive',
    'Yacht Eclipse',
    'Montre Heritage',
    'Diamant Noir',
    'Couronne Royale',
    'Suite Flottante',
    'Helicoptere VIP',
    'Coffre Or',
    'Tableau Prestige',
    'Bijou Imperial',
    'Submersible Luxe',
    'Salon Cigare',
  ].flatMap((item) =>
    [
      'Monaco',
      'Dubai',
      'Geneve',
      'Riviera',
      'Platinum',
      'Black Gold',
      'Signature',
      'Sovereign',
      'Eclipse',
      'Majestic',
    ].map((edition) => `${item} ${edition}`),
  ),
);

const collectionNames = stableShuffle(
  [
    'Piece Antique',
    'Carte Rookie',
    'Toile de Maitre',
    'Meteorite Rare',
    'Archive Royale',
    'Sculpture Privee',
    'Manuscrit Secret',
    'Vin Millesime',
    'Masque Imperial',
    'Sabre Ceremoniel',
    'Fossile Noir',
    'Medaille Historique',
  ].flatMap((item) =>
    [
      'Rome',
      'Paris',
      'Tokyo',
      'Londres',
      'Monaco',
      'Suisse',
      'Empire',
      'Dynastie',
      'Musee Prive',
      'Collection Or',
    ].map((origin) => `${item} ${origin}`),
  ),
);

const buildNamedOwnables = (
  category: OwnableAsset['category'],
  seeds: readonly (readonly [string, string, string, string, number, number, string])[],
  names: string[],
) =>
  stableShuffle(buildOwnables(category, seeds)).map((asset, index) => ({
    ...asset,
    name: names[index] ?? asset.name,
  }));

const premiumLuxuryCatalog = [
  ['Gulfstream G700', 'Jet privé', 'G7', 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?auto=format&fit=crop&w=720&h=540&q=82'],
  ['Bombardier Global 7500', 'Jet privé', 'G7', 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?auto=format&fit=crop&w=720&h=540&q=82'],
  ['Dassault Falcon 8X', 'Jet privé', 'G7', 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?auto=format&fit=crop&w=720&h=540&q=82'],
  ['Cessna Citation Longitude', 'Jet privé', 'G7', 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?auto=format&fit=crop&w=720&h=540&q=82'],
  ['Embraer Praetor 600', 'Jet privé', 'G7', 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?auto=format&fit=crop&w=720&h=540&q=82'],
  ['Azimut Grande', 'Yacht', 'YS', 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&w=720&h=540&q=82'],
  ['Sunseeker 131', 'Yacht', 'YS', 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&w=720&h=540&q=82'],
  ['Benetti Oasis', 'Yacht', 'YS', 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&w=720&h=540&q=82'],
  ['Lürssen Mega Yacht', 'Yacht', 'YS', 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&w=720&h=540&q=82'],
  ['Oceanco Superyacht', 'Yacht', 'YS', 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&w=720&h=540&q=82'],
  ['Diamant bleu impérial', 'Bijoux', 'BD', 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=720&h=540&q=82'],
  ['Collier rubis royal', 'Bijoux', 'BD', 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=720&h=540&q=82'],
  ['Montre Rolex Daytona or', 'Bijoux', 'DX', 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=720&h=540&q=82'],
  ['Couronne maison souveraine', 'Bijoux', 'CR', 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=720&h=540&q=82'],
  ['Tableau prestige Monaco', 'Art', 'AR', 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=720&h=540&q=82'],
  ['Sculpture or contemporain', 'Art', 'AR', 'https://images.unsplash.com/photo-1564399579883-451a5d44ec08?auto=format&fit=crop&w=720&h=540&q=82'],
] as const;

const premiumCollectionCatalog = [
  ['NFT Genesis Black Gold', 'NFT', 'NF', 'https://images.unsplash.com/photo-1642104704074-907c0698cbd9?auto=format&fit=crop&w=720&h=540&q=82'],
  ['Crypto Art Sovereign', 'NFT', 'NF', 'https://images.unsplash.com/photo-1642104704074-907c0698cbd9?auto=format&fit=crop&w=720&h=540&q=82'],
  ['Collection NFT Monaco', 'NFT', 'NF', 'https://images.unsplash.com/photo-1642104704074-907c0698cbd9?auto=format&fit=crop&w=720&h=540&q=82'],
  ['Carte rookie signée', 'Collection rare', 'RC', 'https://images.unsplash.com/photo-1613771404784-3a5686aa2be3?auto=format&fit=crop&w=720&h=540&q=82'],
  ['Météorite noire rare', 'Collection rare', 'MT', 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=720&h=540&q=82'],
  ['Fossile noir musée privé', 'Collection rare', 'MT', 'https://images.unsplash.com/photo-1564399579883-451a5d44ec08?auto=format&fit=crop&w=720&h=540&q=82'],
  ['Pièce antique impériale', 'Objet historique', 'PI', 'https://images.unsplash.com/photo-1605792657660-596af9009e82?auto=format&fit=crop&w=720&h=540&q=82'],
  ['Archive royale historique', 'Objet historique', 'AR', 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=720&h=540&q=82'],
  ['Manuscrit secret dynastie', 'Objet historique', 'AR', 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=720&h=540&q=82'],
  ['Sabre cérémoniel impérial', 'Objet historique', 'AR', 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=720&h=540&q=82'],
] as const;

const applyCuratedOwnables = (
  items: OwnableAsset[],
  catalog: readonly (readonly [string, string, string, string])[],
) =>
  items.map((item, index) => {
    const curated = catalog[index];
    return curated
      ? {
          ...item,
          name: curated[0],
          tier: curated[1],
          icon: curated[2],
          imageUrl: curated[3],
        }
      : item;
  });

export const buildRealEstate = () =>
  buildNamedOwnables('realEstate', ownableSeeds.realEstate, realEstateNames);
export const buildCars = () => buildNamedOwnables('cars', ownableSeeds.cars, carNames);
export const buildLuxury = () =>
  applyCuratedOwnables(buildNamedOwnables('luxury', ownableSeeds.luxury, luxuryNames), premiumLuxuryCatalog)
    .map(normalizeLuxuryAsset);
export const buildCollections = () =>
  applyCuratedOwnables(buildNamedOwnables('collections', ownableSeeds.collections, collectionNames), premiumCollectionCatalog)
    .map(normalizeCollectionAsset);

const normalizeLuxuryAsset = (item: OwnableAsset, index: number): OwnableAsset => {
  if (index < premiumLuxuryCatalog.length) return item;
  const suffix = luxurySuffixes[index % luxurySuffixes.length];

  if (item.icon === 'G7') return { ...item, name: `Jet privé ${suffix}`, tier: 'Jet privé' };
  if (item.icon === 'YS') return { ...item, name: `Yacht premium ${suffix}`, tier: 'Yacht' };
  if (item.icon === 'DX') return { ...item, name: `Montre luxe ${suffix}`, tier: 'Bijoux' };
  if (item.icon === 'BD') return { ...item, name: `Diamant prestige ${suffix}`, tier: 'Bijoux' };
  if (item.icon === 'CR') return { ...item, name: `Couronne royale ${suffix}`, tier: 'Bijoux' };

  return item;
};

const normalizeCollectionAsset = (item: OwnableAsset, index: number): OwnableAsset => {
  if (index < premiumCollectionCatalog.length) return item;
  const suffix = luxurySuffixes[index % luxurySuffixes.length];

  if (item.icon === 'PI') return { ...item, name: `Pièce antique ${suffix}`, tier: 'Objet historique' };
  if (item.icon === 'RC') return { ...item, name: `Carte rare ${suffix}`, tier: 'Collection rare' };
  if (item.icon === 'TM') return { ...item, name: `Toile de maître ${suffix}`, tier: 'Art' };
  if (item.icon === 'MT') return { ...item, name: `Météorite rare ${suffix}`, tier: 'Collection rare' };
  if (item.icon === 'AR') return { ...item, name: `Archive historique ${suffix}`, tier: 'Objet historique' };

  return item;
};

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
  ['apple', 'Apple', 'Action', 'AAPL', 195, 0.035, 0.003, 0.003, 920000000, 'Modere'],
  ['tesla', 'Tesla', 'Action', 'TSLA', 245, 0.075, 0.006, 0.006, 760000000, 'Eleve'],
  ['amazon', 'Amazon', 'Action', 'AMZN', 185, 0.04, 0.004, 0.004, 680000000, 'Modere'],
  ['nvidia', 'Nvidia', 'Action', 'NVDA', 920, 0.085, 0.007, 0.006, 980000000, 'Extreme'],
  ['google', 'Google', 'Action', 'GOOG', 172, 0.035, 0.003, 0.003, 640000000, 'Modere'],
  ['meta', 'Meta', 'Action', 'META', 485, 0.055, 0.005, 0.004, 520000000, 'Eleve'],
  ['microsoft', 'Microsoft', 'Action', 'MSFT', 430, 0.032, 0.003, 0.003, 890000000, 'Modere'],
  ['ferrari', 'Ferrari', 'Action', 'RACE', 410, 0.045, 0.004, 0.004, 220000000, 'Eleve'],
  ['lvmh', 'LVMH', 'Action', 'LVMH', 760, 0.038, 0.003, 0.004, 310000000, 'Modere'],
  ['netflix', 'Netflix', 'Action', 'NFLX', 610, 0.06, 0.005, 0.005, 330000000, 'Eleve'],
  ['btc', 'Bitcoin', 'Crypto', 'BTC', 65000, 0.08, 0.006, 0.006, 840000000, 'Extreme'],
  ['aurum', 'Aurum Index', 'Indice', 'AUR', 1450, 0.035, 0.003, 0.003, 185000000, 'Modere'],
  ['oil', 'Black Oil', 'Matiere premiere', 'OIL', 86, 0.045, 0.001, 0.004, 420000000, 'Eleve'],
  ['aiq', 'AI Quant Fund', 'Action', 'AIQ', 510, 0.075, 0.008, 0.007, 260000000, 'Extreme'],
  ['lux', 'Luxury Holdings', 'Action', 'LUX', 980, 0.04, 0.004, 0.005, 124000000, 'Modere'],
  ['eth', 'Ethereum', 'Crypto', 'ETH', 3200, 0.07, 0.005, 0.006, 620000000, 'Extreme'],
  ['sol', 'Solana', 'Crypto', 'SOL', 180, 0.09, 0.006, 0.008, 310000000, 'Extreme'],
  ['bnb', 'BNB', 'Crypto', 'BNB', 590, 0.065, 0.005, 0.006, 360000000, 'Eleve'],
  ['xrp', 'XRP', 'Crypto', 'XRP', 0.62, 0.08, 0.004, 0.008, 410000000, 'Eleve'],
  ['ada', 'Cardano', 'Crypto', 'ADA', 0.48, 0.075, 0.004, 0.008, 270000000, 'Eleve'],
  ['avax', 'Avalanche', 'Crypto', 'AVAX', 38, 0.09, 0.006, 0.008, 240000000, 'Extreme'],
  ['matic', 'Polygon', 'Crypto', 'MATIC', 0.72, 0.082, 0.004, 0.008, 210000000, 'Eleve'],
  ['mev', 'MEV Coin', 'Crypto', 'MEV', 4.2, 0.16, 0.008, 0.018, 145000000, 'Extreme'],
  ['estate', 'Prime Real Estate Fund', 'Immobilier', 'REF', 760, 0.025, 0.002, 0.003, 96000000, 'Faible'],
  ['reit-dubai', 'REIT Dubai', 'Immobilier', 'RDX', 980, 0.028, 0.002, 0.003, 120000000, 'Faible'],
  ['reit-paris', 'REIT Paris', 'Immobilier', 'RPA', 720, 0.024, 0.002, 0.003, 98000000, 'Faible'],
  ['reit-nyc', 'REIT New York', 'Immobilier', 'RNY', 1150, 0.032, 0.003, 0.004, 155000000, 'Modere'],
  ['reit-tokyo', 'REIT Tokyo', 'Immobilier', 'RTK', 680, 0.027, 0.002, 0.003, 87000000, 'Faible'],
  ['villa-fund', 'Fonds Villas Luxe', 'Immobilier', 'FVL', 2400, 0.038, 0.003, 0.004, 132000000, 'Modere'],
  ['hotel-fund', 'Fonds Hotel', 'Immobilier', 'FHT', 1850, 0.034, 0.003, 0.004, 118000000, 'Modere'],
  ['mall-fund', 'Fonds Centres commerciaux', 'Immobilier', 'FCC', 1320, 0.03, 0.002, 0.003, 103000000, 'Faible'],
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
      const typedPrice = getInvestmentPrice(seed[2], rawPrice);
      const symbol = index === 0 ? seed[3] : `${seed[3]}${index + 1}`;

      return {
        id: index === 0 ? seed[0] : `${seed[0]}-${index + 1}`,
        name: index === 0 ? seed[1] : `${seed[1]} ${series}`,
        type: seed[2],
        symbol,
        price: typedPrice,
        previousPrice: typedPrice,
        dayOpen: typedPrice,
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

const getInvestmentPrice = (type: MarketAsset['type'], rawPrice: number) => {
  if (type === 'Action') return Math.min(1000, Math.max(50, Math.floor(rawPrice)));
  if (type === 'Immobilier') return Math.min(10000, Math.max(100, Math.floor(rawPrice)));
  if (rawPrice < 1) return Number(rawPrice.toPrecision(3));
  return Math.floor(rawPrice);
};

export const buildMissions = (): Mission[] => [
  { id: 'cash-100k', title: 'Atteindre 100 000 cash', reward: 6000, target: 100000, metric: 'cash', claimed: false },
  { id: 'networth-1m', title: 'Construire 1M de patrimoine', reward: 25000, target: 1000000, metric: 'netWorth', claimed: false },
  { id: 'business-25', title: 'Cumuler 25 niveaux business', reward: 18000, target: 25, metric: 'businessLevels', claimed: false },
  { id: 'estate-3', title: 'Posseder 3 biens immobiliers', reward: 40000, target: 3, metric: 'realEstateOwned', claimed: false },
  { id: 'cars-3', title: 'Monter un garage de 3 voitures', reward: 22000, target: 3, metric: 'carsOwned', claimed: false },
  { id: 'bank-250k', title: 'Placer 250 000 en banque', reward: 18000, target: 250000, metric: 'bank', claimed: false },
  { id: 'market-20', title: 'Detenir 20 positions de trading', reward: 16000, target: 20, metric: 'marketUnits', claimed: false },
];
