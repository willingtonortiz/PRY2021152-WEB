import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterQuery } from '@datorama/akita-ng-router-store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { LogOutUseCase, NoParams } from '../../../domain';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss'],
})
export class SideBarComponent implements OnInit, OnDestroy {
  destroyed = new Subject<void>();
  selected: number = 0;

  constructor(
    private readonly routerQuery: RouterQuery,
    private readonly logOutUseCase: LogOutUseCase
  ) {}

  ngOnInit(): void {
    this.initializeRouterObservable();
  }

  initializeRouterObservable(): void {
    this.routerQuery
      .select()
      .pipe(takeUntil(this.destroyed))
      .subscribe({
        next: ({ state }) => {
          const url = state?.url;
          if (url?.includes('learning')) {
            this.selected = 0;
          }

          if (url?.includes('equipments')) {
            this.selected = 1;
          }

          if (url?.includes('enemies')) {
            this.selected = 2;
          }
        },
      });
  }

  async logout(): Promise<void> {
    await this.logOutUseCase.execute(new NoParams());
  }

  ngOnDestroy(): void {
    this.destroyed.next();
    this.destroyed.complete();
  }
}
