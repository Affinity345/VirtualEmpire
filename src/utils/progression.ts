import { BusinessAsset, OwnableAsset } from '@/game/types';
import { RESALE_RATE } from '@/utils/resale';

export const BUSINESS_MAX_LEVEL = 50;

const endgameRarities = new Set(['Legendaire', 'Mythique']);

export const isBusinessLevelGated = (business: BusinessAsset) =>
  endgameRarities.has(business.rarity);

export const isOwnableLevelGated = (item: OwnableAsset) =>
  endgameRarities.has(item.rarity) || item.tier === 'Mythique';

export const canFoundBusiness = (business: BusinessAsset, cash: number, level: number) =>
  cash >= getBusinessFoundingCost(business) &&
  (!isBusinessLevelGated(business) || level >= business.unlockLevel);

export const canBuyOwnable = (item: OwnableAsset, cash: number, level: number) =>
  cash >= item.price && (!isOwnableLevelGated(item) || level >= item.unlockLevel);

export const getBusinessFoundingCost = (business: BusinessAsset) =>
  getBusinessUpgradeCost(business);

export const getBusinessUpgradeCost = (business: BusinessAsset) => {
  if (business.level >= BUSINESS_MAX_LEVEL) return Number.POSITIVE_INFINITY;
  if (business.level <= 0) return business.basePrice;

  const midGamePressure = business.level >= 25 ? 1.12 : 1;
  const endGamePressure = business.level >= 40 ? 1.22 : 1;
  return Math.round(business.basePrice * Math.pow(1.22, business.level) * midGamePressure * endGamePressure);
};

export const getBusinessTotalInvested = (business: BusinessAsset) => {
  const paidLevels = Math.max(0, Math.min(BUSINESS_MAX_LEVEL, Math.floor(business.level)));

  return Array.from({ length: paidLevels }, (_, level) =>
    getBusinessUpgradeCost({ ...business, level }),
  ).reduce((sum, cost) => sum + cost, 0);
};

export const getBusinessResalePrice = (business: BusinessAsset) =>
  Math.floor(getBusinessTotalInvested(business) * RESALE_RATE);

export const getBusinessLevelBonus = (level: number) => {
  if (level >= 50) return 3;
  if (level >= 25) return 2;
  if (level >= 10) return 1.5;
  return 1;
};

export const getBusinessMilestoneLabel = (level: number) => {
  if (level >= 50) return 'Max premium x3';
  if (level >= 25) return 'Bonus empire x2';
  if (level >= 10) return 'Bonus croissance x1.5';
  return 'Prochain bonus au niveau 10';
};

export const getBusinessLevelProgress = (level: number) =>
  Math.max(0, Math.min(100, (level / BUSINESS_MAX_LEVEL) * 100));

export const getBusinessFoundingBlock = (business: BusinessAsset, cash: number, level: number) => {
  if (isBusinessLevelGated(business) && level < business.unlockLevel) {
    return `Endgame niveau ${business.unlockLevel}`;
  }
  if (cash < getBusinessFoundingCost(business)) return "Pas assez d'argent";
  return undefined;
};

export const getOwnableBuyBlock = (item: OwnableAsset, cash: number, level: number) => {
  if (isOwnableLevelGated(item) && level < item.unlockLevel) {
    return `Endgame niveau ${item.unlockLevel}`;
  }
  if (cash < item.price) return "Pas assez d'argent";
  return undefined;
};
