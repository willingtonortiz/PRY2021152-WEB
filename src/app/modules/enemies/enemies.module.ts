import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { EnemiesRoutingModule } from './enemies-routing.module';

import { SessionStorage } from '../../core/domain';
import {
  AddEnemyUseCase,
  DeleteEnemyUseCase,
  EnemiesRepository,
  GetAllEnemiesUseCase,
  UpdateEnemyUseCase,
} from './domain';
import { EnemiesRepositoryImpl } from './infrastructure';
import { EnemiesPageComponent, EnemyCardComponent } from './presentation';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    EnemiesRoutingModule,
    NgScrollbarModule,
    SharedModule,
  ],
  declarations: [EnemiesPageComponent, EnemyCardComponent],
  providers: [
    // * Usecases
    GetAllEnemiesUseCase,
    AddEnemyUseCase,
    UpdateEnemyUseCase,
    DeleteEnemyUseCase,

    // * Repositories
    {
      provide: EnemiesRepository,
      useClass: EnemiesRepositoryImpl,
      deps: [HttpClient, SessionStorage],
    },
  ],
})
export class EnemiesModule {}
