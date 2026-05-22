import { BusinessAsset } from '@/game/types';

export type EnterpriseStatus = 'rentable' | 'attente' | 'suspendu' | 'construction';

export const getEnterpriseStatus = (business: BusinessAsset): EnterpriseStatus => {
  if (business.level <= 0) return 'attente';
  if (business.enterpriseTaxDebt >= getEnterpriseTaxLimit(business) || business.reputation < 25) {
    return 'suspendu';
  }
  if (business.projectProgress > 0 && business.projectProgress < 100) return 'construction';
  return 'rentable';
};

export const getEnterpriseStatusLabel = (status: EnterpriseStatus) => {
  if (status === 'rentable') return 'Rentable';
  if (status === 'attente') return 'En attente';
  if (status === 'suspendu') return 'Suspendue';
  return 'Construction';
};

export const getEnterpriseCause = (business: BusinessAsset) => {
  if (business.level <= 0) return 'Entreprise non fondee.';
  if (business.enterpriseTaxDebt >= getEnterpriseTaxLimit(business)) {
    return `Dette fiscale entreprise : € ${Math.floor(business.enterpriseTaxDebt).toLocaleString('fr-FR')}`;
  }
  if (business.reputation < 25) return 'Reputation trop faible. Regle les audits et stabilise les operations.';
  if (business.projectProgress < 100) return `${business.projectName} en cours.`;
  return 'Operations automatiques actives.';
};

export const getEnterpriseTaxLimit = (business: BusinessAsset) =>
  Math.max(20000, business.basePrice * 0.4 * Math.max(1, business.level));

export const getEnterpriseEfficiency = (business: BusinessAsset) => {
  const workforce = business.employees * 0.018;
  const mobility = business.vehicles * 0.025;
  const infrastructure = business.buildings * 0.04;
  const quality = business.quality * 0.003;
  const maintenanceDrag = business.maintenance * 0.0025;
  return Math.max(0.2, Math.min(3.5, business.efficiency + workforce + mobility + infrastructure + quality - maintenanceDrag));
};

export const getEnterpriseIncome = (business: BusinessAsset, multiplier: number) => {
  const status = getEnterpriseStatus(business);
  if (status === 'suspendu' || status === 'attente') return 0;
  const projectBonus = business.projectProgress >= 100 ? 1.18 : 1;
  const synergyBonus = 1 + business.synergyBonus;
  return business.level * business.baseIncome * getEnterpriseEfficiency(business) * projectBonus * synergyBonus * multiplier;
};

export const getEnterpriseProgressRate = (business: BusinessAsset) => {
  if (business.level <= 0 || getEnterpriseStatus(business) === 'suspendu') return 0;
  const teamSpeed = business.employees * 0.015 + business.buildings * 0.04 + business.vehicles * 0.01;
  return Math.max(0.05, teamSpeed * getEnterpriseEfficiency(business));
};

export const getEnterpriseResourcesPerTick = (business: BusinessAsset) =>
  Math.max(0, business.employees * 0.08 + business.vehicles * 0.12 + business.buildings * 0.16);

export const getEnterpriseMaintenanceCost = (business: BusinessAsset) =>
  Math.floor((business.employees * 8 + business.vehicles * 22 + business.buildings * 55) * Math.max(1, business.level));
