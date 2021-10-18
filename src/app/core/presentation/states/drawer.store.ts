import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';

export interface DrawerState {
  isOpen: boolean;
}

@StoreConfig({ name: 'drawer' })
@Injectable()
export class DrawerStore extends Store<DrawerState> {
  constructor() {
    super({ isOpen: true });
  }

  openDrawer() {
    this.update({ isOpen: true });
  }

  closeDrawer() {
    this.update({ isOpen: false });
  }
}
