import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EnemiesPageComponent } from './presentation';

const routes: Routes = [
  {
    path: '',
    component: EnemiesPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EnemiesRoutingModule {}
