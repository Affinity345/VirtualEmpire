import React from 'react';

import { OwnablesScreen } from '@/screens/OwnablesScreen';
import { EmpireAction } from '@/game/reducer';
import { OwnableAsset } from '@/game/types';

type Props = {
  items: OwnableAsset[];
  cash: number;
  dispatch: React.Dispatch<EmpireAction>;
};

export function RealEstateScreen({ items, cash, dispatch }: Props) {
  return (
    <OwnablesScreen
      title="Immobilier"
      subtitle="Biens premium avec revenu locatif passif."
      category="realEstate"
      items={items}
      cash={cash}
      dispatch={dispatch}
    />
  );
}
