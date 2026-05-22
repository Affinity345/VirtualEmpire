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

export function CollectionsScreen({ items, cash, level, prestigeMultiplier, dispatch }: Props) {
  return (
    <OwnablesScreen
      title="Collections rares"
      subtitle="Pieces uniques preparees pour images IA."
      category="collections"
      items={items}
      cash={cash}
      level={level}
      prestigeMultiplier={prestigeMultiplier}
      dispatch={dispatch}
    />
  );
}
