import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';

import { EquipmentsQuery } from '../..';
import {
  DisableEquipmentUseCase,
  EnableEquipmentUseCase,
  Equipment,
  EquipmentTypes,
  GetEquipmentsByTypeUseCase,
} from '../../../domain';

@Component({
  selector: 'app-equipments-page',
  templateUrl: './equipments-page.component.html',
  styleUrls: ['./equipments-page.component.scss'],
})
export class EquipmentsPageComponent {
  displayedColumns = [
    'name',
    'description',
    'attack',
    'defense',
    'buyPrice',
    'sellPrice',
    'actions',
  ];

  equipmentType$ = this.equipmentsQuery.selectFilter$;
  equipments$: Observable<Equipment[]> = this.equipmentsQuery.selectAll();
  areEquipmentsLoading$ = this.equipmentsQuery.selectLoading();

  constructor(
    private readonly snackBar: MatSnackBar,
    private readonly equipmentsQuery: EquipmentsQuery,
    private readonly getEquipmentsByTypeUseCase: GetEquipmentsByTypeUseCase,
    private readonly enableEquipmentUseCase: EnableEquipmentUseCase,
    private readonly disableEquipmentUseCase: DisableEquipmentUseCase
  ) {}

  async fetchEquipments(type: EquipmentTypes): Promise<void> {
    (await this.getEquipmentsByTypeUseCase.execute({ type })).caseOf({
      Right: (_) => {},
      Left: (failure) => this.showSnackBar(failure.message),
    });
  }

  async onFilterSelected(type: EquipmentTypes): Promise<void> {
    await this.fetchEquipments(type);
  }

  async onToggle(
    event: PointerEvent | MouseEvent | KeyboardEvent,
    id: string,
    isChecked: boolean
  ): Promise<void> {
    event.preventDefault();
    if (isChecked) {
      (await this.disableEquipmentUseCase.execute({ id })).caseOf({
        Left: (failure) => this.showSnackBar(failure.message),
        Right: (_) => this.showSnackBar('Equipamiento desactivado!'),
      });
    } else {
      (await this.enableEquipmentUseCase.execute({ id })).caseOf({
        Left: (failure) => this.showSnackBar(failure.message),
        Right: (_) => this.showSnackBar('Equipamiento activado!'),
      });
    }
  }

  showSnackBar(message: string) {
    this.snackBar.open(message, '', { duration: 4000 });
  }

  get EquipmentType() {
    return EquipmentTypes;
  }
}
