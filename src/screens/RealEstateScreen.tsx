import React from 'react';

import { OwnablesScreen } from '@/screens/OwnablesScreen';
import { EmpireAction } from '@/game/reducer';
import { OwnableAsset } from '@/game/types';

type Props = {
  items: OwnableAsset[];
  cash: number;
  level: number;
  prestigeMultiplier: number;
  dispatch: React.Dispatch<EmpireAction>;
};

export function RealEstateScreen({ items, cash, level, prestigeMultiplier, dispatch }: Props) {
  return (
    <OwnablesScreen
      title="Immobilier"
      subtitle="Biens premium avec revenu locatif passif."
      category="realEstate"
      items={items}
      cash={cash}
      level={level}
      prestigeMultiplier={prestigeMultiplier}
      dispatch={dispatch}
    />
  );
}
