import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { EquipmentRoutingModule } from './equipment-routing.module';
import { SessionStorage } from '../../core/domain';
import {
  AddEquipmentUseCase,
  EditEquipmentUseCase,
  EquipmentsRepository,
  EquipmentTypes,
  GetEquipmentsByTypeUseCase,
  EnableEquipmentUseCase,
  DisableEquipmentUseCase,
} from './domain';
import { EquipmentsRepositoryImpl } from './infrastructure';
import {
  AddEquipmentPageComponent,
  EquipmentDetailsPageComponent,
  EquipmentImageComponent,
  EquipmentsPageComponent,
  EquipmentsQuery,
  EquipmentsStore,
} from './presentation';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    EquipmentRoutingModule,
    NgScrollbarModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
  ],
  declarations: [
    EquipmentsPageComponent,
    EquipmentImageComponent,
    AddEquipmentPageComponent,
    EquipmentDetailsPageComponent,
  ],
  providers: [
    // * State
    EquipmentsStore,
    EquipmentsQuery,

    // * Usecases
    GetEquipmentsByTypeUseCase,
    AddEquipmentUseCase,
    EditEquipmentUseCase,
    EnableEquipmentUseCase,
    DisableEquipmentUseCase,

    // * Repositories
    {
      provide: EquipmentsRepository,
      useClass: EquipmentsRepositoryImpl,
      deps: [HttpClient, SessionStorage],
    },
  ],
})
export class EquipmentModule {
  constructor(
    private readonly snackBar: MatSnackBar,
    private readonly getEquipmentUseCase: GetEquipmentsByTypeUseCase
  ) {
    this.fetchEquipments(EquipmentTypes.helmet);
  }

  async fetchEquipments(type: EquipmentTypes): Promise<void> {
    (await this.getEquipmentUseCase.execute({ type })).caseOf({
      Right: (_) => {},
      Left: (failure) => {
        this.snackBar.open(failure.message, '', { duration: 2000 });
      },
    });
  }
}
