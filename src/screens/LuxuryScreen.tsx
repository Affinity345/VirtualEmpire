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

export function LuxuryScreen({ items, cash, level, prestigeMultiplier, dispatch }: Props) {
  return (
    <OwnablesScreen
      title="Jets, yachts et luxe"
      subtitle="Objets de prestige pour poser l'identite premium."
      category="luxury"
      items={items}
      cash={cash}
      level={level}
      prestigeMultiplier={prestigeMultiplier}
      dispatch={dispatch}
    />
  );
}
