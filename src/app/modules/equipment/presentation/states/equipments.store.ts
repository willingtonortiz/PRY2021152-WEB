import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';

import { Equipment, EquipmentTypes } from '../../domain';

export interface EquipmentsState extends EntityState<Equipment, string> {
  filter: EquipmentTypes;
}

const createInitialState = (): EquipmentsState => {
  return {
    filter: EquipmentTypes.helmet,
    loading: false,
  };
};

@StoreConfig({ name: 'equipments' })
@Injectable()
export class EquipmentsStore extends EntityStore<EquipmentsState> {
  constructor() {
    super(createInitialState());
  }
}
