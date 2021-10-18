import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {
  AddEquipmentPageComponent,
  EquipmentDetailsPageComponent,
  EquipmentsPageComponent,
} from './presentation';

const routes: Routes = [
  {
    path: '',
    component: EquipmentsPageComponent,
  },
  {
    path: ':id',
    component: EquipmentDetailsPageComponent,
  },
  {
    path: 'add',
    component: AddEquipmentPageComponent,
  },
  {
    path: ':id/edit',
    component: AddEquipmentPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EquipmentRoutingModule {}
