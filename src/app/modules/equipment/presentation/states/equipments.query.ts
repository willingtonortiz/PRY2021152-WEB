import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { Observable } from 'rxjs';

import { EquipmentTypes } from '../../domain';
import { EquipmentsState, EquipmentsStore } from './equipments.store';

@Injectable()
export class EquipmentsQuery extends QueryEntity<EquipmentsState> {
  selectFilter$: Observable<EquipmentTypes> = this.select('filter');

  constructor(protected readonly store: EquipmentsStore) {
    super(store);
  }

  getSelectedFilter(): EquipmentTypes {
    return this.getValue().filter;
  }
}
