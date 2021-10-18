import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgScrollbarModule } from 'ngx-scrollbar';

import { LearningRoutingModule } from './learning-routing.module';
import { SharedModule } from '../../shared/shared.module';

import { SessionStorage } from '../../core/domain';
import {
  AddProblemPageComponent,
  AddTopicPageComponent,
  AreasQuery,
  AreasStore,
  MainPageComponent,
  ProblemDetailsPageComponent,
  ProblemPreviewComponent,
  ProblemsQuery,
  ProblemsStore,
  TopicDetailsPageComponent,
  TopicsQuery,
  TopicsStore,
} from './presentation';
import {
  AddProblemUseCase,
  AddTopicUseCase,
  Area,
  AreasRepository,
  DeleteProblemUseCase,
  DeleteTopicUseCase,
  EnemiesRepository,
  GetAllAreasUseCase,
  GetAllEnemiesUseCase,
  GetAllProblemsByTopicUseCase,
  GetAllTopicsByAreaUseCase,
  GetAllUnasignedEnemiesUseCase,
  GetOneProblemUseCase,
  GetOneTopicUseCase,
  ProblemsRepository,
  TopicsRepository,
  UpdateProblemUseCase,
  UpdateTopicUseCase,
} from './domain';
import {
  AreasRepositoryImpl,
  EnemiesRepositoryImpl,
  ProblemsRepositoryImpl,
  TopicsRepositoryImpl,
} from './infrastructure';
import { KatexModule } from 'ng-katex';

@NgModule({
  imports: [
    CommonModule,
    LearningRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgScrollbarModule,
    KatexModule,

    // Local
    SharedModule,
  ],
  declarations: [
    MainPageComponent,
    AddTopicPageComponent,
    TopicDetailsPageComponent,
    AddProblemPageComponent,
    ProblemDetailsPageComponent,
    ProblemPreviewComponent,
  ],
  providers: [
    // State
    AreasStore,
    AreasQuery,
    ProblemsStore,
    ProblemsQuery,
    TopicsStore,
    TopicsQuery,

    // Usecases
    GetAllAreasUseCase,

    GetAllTopicsByAreaUseCase,
    GetOneTopicUseCase,
    AddTopicUseCase,
    UpdateTopicUseCase,
    DeleteTopicUseCase,

    GetAllEnemiesUseCase,
    GetAllUnasignedEnemiesUseCase,

    GetAllProblemsByTopicUseCase,
    GetOneProblemUseCase,
    AddProblemUseCase,
    UpdateProblemUseCase,
    DeleteProblemUseCase,

    // Repositories
    {
      provide: AreasRepository,
      useClass: AreasRepositoryImpl,
      deps: [HttpClient, SessionStorage],
    },
    {
      provide: TopicsRepository,
      useClass: TopicsRepositoryImpl,
      deps: [HttpClient, SessionStorage],
    },
    {
      provide: EnemiesRepository,
      useClass: EnemiesRepositoryImpl,
      deps: [HttpClient, SessionStorage],
    },
    {
      provide: ProblemsRepository,
      useClass: ProblemsRepositoryImpl,
      deps: [HttpClient, SessionStorage],
    },
  ],
})
export class LearningModule {
  constructor(
    private readonly snackBar: MatSnackBar,
    private readonly areasStore: AreasStore,
    private readonly getAllAreasUseCase: GetAllAreasUseCase,
    private readonly getAllTopicsByAreaUseCase: GetAllTopicsByAreaUseCase
  ) {
    this.fetchAreas();
  }

  async fetchAreas(): Promise<void> {
    (await this.getAllAreasUseCase.execute({})).caseOf({
      Right: (areas) => {
        const firstArea = areas[0];
        this.areasStore.setActive(firstArea.id);
        this.fetchTopicsByArea(firstArea);
      },
      Left: (failure) => {
        this.snackBar.open(failure.message);
      },
    });
  }

  async fetchTopicsByArea(area: Area): Promise<void> {
    (await this.getAllTopicsByAreaUseCase.execute({ area })).caseOf({
      Right: (_) => {},
      Left: (failure) => {
        this.snackBar.open(failure.message);
      },
    });
  }
}
