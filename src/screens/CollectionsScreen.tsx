import React from 'react';

import { OwnablesScreen } from '@/screens/OwnablesScreen';
import { EmpireAction } from '@/game/reducer';
import { OwnableAsset } from '@/game/types';

type Props = {
  items: OwnableAsset[];
  cash: number;
  dispatch: React.Dispatch<EmpireAction>;
};

export function CollectionsScreen({ items, cash, dispatch }: Props) {
  return (
    <OwnablesScreen
      title="Collections rares"
      subtitle="Pieces uniques preparees pour images IA."
      category="collections"
      items={items}
      cash={cash}
      dispatch={dispatch}
    />
  );
}
