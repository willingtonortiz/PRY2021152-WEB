import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

import { DrawerState, DrawerStore } from './drawer.store';

@Injectable()
export class DrawerQuery extends Query<DrawerState> {
  isOpen$ = this.select('isOpen');

  constructor(protected store: DrawerStore) {
    super(store);
  }
}
