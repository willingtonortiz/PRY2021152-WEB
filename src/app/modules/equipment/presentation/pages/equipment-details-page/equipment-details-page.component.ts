import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RouterQuery } from '@datorama/akita-ng-router-store';

import { EquipmentsQuery } from '../..';
import { Equipment, EquipmentTypes } from '../../../domain';

const AVATAR_IMAGE =
  'https://mathyfightstorage.blob.core.windows.net/mathyfight-assets/human_m.png';

@Component({
  selector: 'app-equipment-details-page',
  templateUrl: './equipment-details-page.component.html',
  styleUrls: ['./equipment-details-page.component.scss'],
})
export class EquipmentDetailsPageComponent implements OnInit {
  AVATAR_IMAGE = AVATAR_IMAGE;
  equipment?: Equipment;
  equipmentType?: EquipmentTypes;
  imageSrc?: string;

  constructor(
    private readonly router: Router,
    private readonly routerQuery: RouterQuery,

    private readonly equipmentsQuery: EquipmentsQuery
  ) {}

  ngOnInit(): void {
    const id = this.routerQuery.getParams<string>('id');
    if (!id) {
      this.router.navigateByUrl('/equipments');
      return;
    }

    const equipment = this.equipmentsQuery.getEntity(id);
    if (!equipment) {
      this.router.navigateByUrl('/equipments');
      return;
    }

    this.imageSrc = this.equipment?.imageUrl;
    this.equipmentType = this.equipmentsQuery.getSelectedFilter();
    this.equipment = equipment;
  }
}
