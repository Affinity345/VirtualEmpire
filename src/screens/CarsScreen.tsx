import React from 'react';

import { GarageScreen } from '@/screens/GarageScreen';
import { EmpireAction } from '@/game/reducer';
import { OwnableAsset } from '@/game/types';

type Props = {
  cars: OwnableAsset[];
  luxury: OwnableAsset[];
  cash: number;
  level: number;
  dispatch: React.Dispatch<EmpireAction>;
};

export function CarsScreen({ cars, luxury, cash, level, dispatch }: Props) {
  return <GarageScreen cars={cars} luxury={luxury} cash={cash} level={level} dispatch={dispatch} />;
}
