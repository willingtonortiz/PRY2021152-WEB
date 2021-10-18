import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';

import { Problem } from '../../domain';

export interface ProblemsState extends EntityState<Problem, string> {}

@StoreConfig({ name: 'problems' })
@Injectable()
export class ProblemsStore extends EntityStore<ProblemsState> {
  constructor() {
    super({ loading: false });
  }
}
