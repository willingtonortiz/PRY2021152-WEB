import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../shared/shared.module';

import {
  AuthGuard,
  DrawerQuery,
  DrawerStore,
  HomeLayoutComponent,
  LoggedinGuard,
  SideBarComponent,
} from './presentation';
import {
  DifficultyLevelsRepository,
  GetDifficultyLevelsUseCase,
  LogOutUseCase,
  SessionStorage,
} from './domain';
import {
  DifficultyLevelsRepositoryImpl,
  SessionStorageImpl,
} from './infrastructure';

const COMPONENTS = [HomeLayoutComponent, SideBarComponent];

@NgModule({
  imports: [CommonModule, SharedModule, HttpClientModule, RouterModule],
  declarations: [...COMPONENTS],
  providers: [
    // Guards
    LoggedinGuard,
    AuthGuard,

    // State
    DrawerStore,
    DrawerQuery,

    // Usecases
    LogOutUseCase,
    GetDifficultyLevelsUseCase,

    // Repositories
    { provide: SessionStorage, useClass: SessionStorageImpl },
    {
      provide: DifficultyLevelsRepository,
      useClass: DifficultyLevelsRepositoryImpl,
      deps: [HttpClient, SessionStorage],
    },
  ],
  exports: [...COMPONENTS],
})
export class CoreModule {}
