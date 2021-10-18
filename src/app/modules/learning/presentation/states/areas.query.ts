import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';

import { AreasState, AreasStore } from './areas.store';

@Injectable()
export class AreasQuery extends QueryEntity<AreasState> {
  constructor(protected readonly store: AreasStore) {
    super(store);
  }
}
