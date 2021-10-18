import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {
  AddProblemPageComponent,
  AddTopicPageComponent,
  MainPageComponent,
  ProblemDetailsPageComponent,
  TopicDetailsPageComponent,
} from './presentation';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'topics',
    pathMatch: 'full',
  },
  {
    path: 'areas/:id/topics/add',
    component: AddTopicPageComponent,
  },
  {
    path: 'topics',
    component: MainPageComponent,
  },
  {
    path: 'topics/:id',
    component: TopicDetailsPageComponent,
  },
  {
    path: 'topics/:id/edit',
    component: AddTopicPageComponent,
  },
  {
    path: 'problems/:id',
    component: ProblemDetailsPageComponent,
  },
  {
    path: 'topics/:id/problems/add',
    component: AddProblemPageComponent,
  },
  {
    path: 'problems/:id/edit',
    component: AddProblemPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LearningRoutingModule {}
