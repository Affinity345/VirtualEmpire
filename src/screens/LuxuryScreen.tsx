import React from 'react';

import { OwnablesScreen } from '@/screens/OwnablesScreen';
import { EmpireAction } from '@/game/reducer';
import { OwnableAsset } from '@/game/types';

type Props = {
  items: OwnableAsset[];
  cash: number;
  dispatch: React.Dispatch<EmpireAction>;
};

export function LuxuryScreen({ items, cash, dispatch }: Props) {
  return (
    <OwnablesScreen
      title="Jets, yachts et luxe"
      subtitle="Objets de prestige pour poser l'identite premium."
      category="luxury"
      items={items}
      cash={cash}
      dispatch={dispatch}
    />
  );
}
