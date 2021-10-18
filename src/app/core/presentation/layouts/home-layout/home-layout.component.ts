import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';

import { DrawerQuery, DrawerStore } from '../..';

@Component({
  selector: 'app-home-layout',
  templateUrl: './home-layout.component.html',
  styleUrls: ['./home-layout.component.scss'],
})
export class HomeLayoutComponent implements OnDestroy {
  destroyed = new Subject<void>();

  isDrawerOpened$ = this.drawerQuery.isOpen$;

  constructor(
    private readonly drawerStore: DrawerStore,
    private readonly drawerQuery: DrawerQuery
  ) {}

  openDrawer() {
    this.drawerStore.openDrawer();
  }

  ngOnDestroy(): void {
    this.destroyed.next();
    this.destroyed.complete();
  }
}
