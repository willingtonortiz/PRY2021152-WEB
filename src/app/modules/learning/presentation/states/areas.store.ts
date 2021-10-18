import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';

import { Area } from '../../domain';

export interface AreasState extends EntityState<Area, string> {}

@StoreConfig({ name: 'areas' })
@Injectable()
export class AreasStore extends EntityStore<AreasState> {
  constructor() {
    super({ loading: false });
  }
}
