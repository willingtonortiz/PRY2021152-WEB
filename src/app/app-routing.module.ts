import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {
  AuthGuard,
  HomeLayoutComponent,
  LoggedinGuard,
} from './core/presentation';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    canActivate: [LoggedinGuard],
    loadChildren: () =>
      import('./modules/auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'learning',
    component: HomeLayoutComponent,
    canActivate: [AuthGuard],
    canLoad: [AuthGuard],
    loadChildren: () =>
      import('./modules/learning/learning.module').then(
        (m) => m.LearningModule
      ),
  },
  {
    path: 'enemies',
    component: HomeLayoutComponent,
    canLoad: [AuthGuard],

    loadChildren: () =>
      import('./modules/enemies/enemies.module').then((m) => m.EnemiesModule),
  },
  {
    path: 'equipments',
    component: HomeLayoutComponent,
    canActivate: [AuthGuard],
    canLoad: [AuthGuard],
    loadChildren: () =>
      import('./modules/equipment/equipment.module').then(
        (m) => m.EquipmentModule
      ),
  },
  { path: '**', redirectTo: 'auth' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
