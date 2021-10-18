import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { RouterQuery } from '@datorama/akita-ng-router-store';

import { EquipmentsQuery } from '../..';
import {
  AddEquipmentUseCase,
  EditEquipmentUseCase,
  Equipment,
  EquipmentTypes,
} from '../../../domain';

const AVATAR_IMAGE =
  'https://mathyfightstorage.blob.core.windows.net/mathyfight-assets/human_m.png';
const MIN_EQUIPMENT_NAME_LENGTH = 3;
const MAX_EQUIPMENT_NAME_LENGTH = 25;
const MIN_EQUIPMENT_DESCRIPTION_LENGTH = 5;
const MAX_EQUIPMENT_DESCRIPTION_LENGTH = 200;
const MIN_EQUIPMENT_ATTACK_VALUE = 0;
const MAX_EQUIPMENT_ATTACK_VALUE = 92;
const MIN_EQUIPMENT_DEFENSE_VALUE = 0;
const MAX_EQUIPMENT_DEFENSE_VALUE = 13;
const MIN_EQUIPMENT_BUYPRICE_VALUE = 1;
const MAX_EQUIPMENT_BUYPRICE_VALUE = 23;

type ComponentMode = 'ADD' | 'EDIT';

@Component({
  selector: 'app-add-equipment-page',
  templateUrl: './add-equipment-page.component.html',
  styleUrls: ['./add-equipment-page.component.scss'],
})
export class AddEquipmentPageComponent implements OnInit {
  MIN_EQUIPMENT_NAME_LENGTH = MIN_EQUIPMENT_NAME_LENGTH;
  MAX_EQUIPMENT_NAME_LENGTH = MAX_EQUIPMENT_NAME_LENGTH;
  MIN_EQUIPMENT_DESCRIPTION_LENGTH = MIN_EQUIPMENT_DESCRIPTION_LENGTH;
  MAX_EQUIPMENT_DESCRIPTION_LENGTH = MAX_EQUIPMENT_DESCRIPTION_LENGTH;
  MIN_EQUIPMENT_ATTACK_VALUE = MIN_EQUIPMENT_ATTACK_VALUE;
  MAX_EQUIPMENT_ATTACK_VALUE = MAX_EQUIPMENT_ATTACK_VALUE;
  MIN_EQUIPMENT_DEFENSE_VALUE = MIN_EQUIPMENT_DEFENSE_VALUE;
  MAX_EQUIPMENT_DEFENSE_VALUE = MAX_EQUIPMENT_DEFENSE_VALUE;
  MIN_EQUIPMENT_BUYPRICE_VALUE = MIN_EQUIPMENT_BUYPRICE_VALUE;
  MAX_EQUIPMENT_BUYPRICE_VALUE = MAX_EQUIPMENT_BUYPRICE_VALUE;

  // * Constants
  AVATAR_IMAGE = AVATAR_IMAGE;

  mode: ComponentMode = 'ADD';
  equipmentTypes = [
    EquipmentTypes.helmet,
    EquipmentTypes.chestplate,
    EquipmentTypes.leggings,
    EquipmentTypes.boots,
    EquipmentTypes.weapon,
    EquipmentTypes.shield,
  ];

  selectedType: EquipmentTypes = EquipmentTypes.helmet;
  formGroup: FormGroup = this.formBuilder.group({});
  file?: File;
  imageSrc?: string;
  equipmentsLoading$ = this.equipmentsQuery.selectLoading();
  isEquipmentAdded = false;

  // * Editing
  equipmentEditedId?: string;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly snackBar: MatSnackBar,
    private readonly router: Router,
    private readonly routerQuery: RouterQuery,
    private readonly equipmentsQuery: EquipmentsQuery,
    private readonly addEquipmentUseCase: AddEquipmentUseCase,
    private readonly editEquipmentUseCase: EditEquipmentUseCase
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  onTypeChange(type: EquipmentTypes): void {
    this.selectedType = type;
  }

  addOrEditEquipment() {
    if (!this.isFormValid()) {
      return;
    }

    if (this.mode === 'ADD') {
      this.addEquipment();
    } else {
      this.editEquipment();
    }
  }

  async addEquipment(): Promise<void> {
    (
      await this.addEquipmentUseCase.execute({
        type: this.selectedType,
        equipment: {
          image: this.file!,
          name: this.fname.value,
          description: this.fdescription.value,
          attack: this.fattack.value,
          defense: this.fdefense.value,
          buyPrice: this.fbuyPrice.value,
        },
      })
    ).caseOf({
      Left: (failure) => this.showSnackBar(failure.message),
      Right: () => {
        this.isEquipmentAdded = true;
      },
    });
  }

  async editEquipment(): Promise<void> {
    (
      await this.editEquipmentUseCase.execute({
        id: this.equipmentEditedId!,
        equipment: {
          image: this.file,
          name: this.fname.value,
          description: this.fdescription.value,
          attack: this.fattack.value,
          defense: this.fdefense.value,
          buyPrice: this.fbuyPrice.value,
        },
      })
    ).caseOf({
      Left: (failure) => this.showSnackBar(failure.message),
      Right: () => {
        this.isEquipmentAdded = true;
      },
    });
  }

  // * Utils
  showSnackBar(message: string) {
    this.snackBar.open(message, '', { duration: 2000 });
  }

  // * Form Helpers
  initializeForm() {
    const { state } = this.routerQuery.getValue();
    const url = state?.url;

    if (url?.endsWith('add')) {
      this.mode = 'ADD';
      this.initializeAddForm();
      return;
    }

    if (url?.endsWith('edit')) {
      this.mode = 'EDIT';
      const equipmentId: string = state?.params['id'];
      const equipment = this.equipmentsQuery.getEntity(equipmentId);
      if (!equipment) {
        this.router.navigateByUrl('/equipments');
      }

      this.selectedType = this.equipmentsQuery.getSelectedFilter();
      this.equipmentEditedId = equipmentId;
      this.initializeEditForm(equipment!);
      return;
    }
  }

  // TODO: Define boundaries

  initializeAddForm(): void {
    this.formGroup = this.formBuilder.group({
      name: [
        null,
        [
          Validators.required,
          Validators.minLength(MIN_EQUIPMENT_NAME_LENGTH),
          Validators.maxLength(MAX_EQUIPMENT_NAME_LENGTH),
        ],
      ],
      description: [
        null,
        [
          Validators.required,
          Validators.minLength(MIN_EQUIPMENT_DESCRIPTION_LENGTH),
          Validators.maxLength(MAX_EQUIPMENT_DESCRIPTION_LENGTH),
        ],
      ],
      attack: [
        null,
        [
          Validators.required,
          Validators.min(MIN_EQUIPMENT_ATTACK_VALUE),
          Validators.max(MAX_EQUIPMENT_ATTACK_VALUE),
        ],
      ],
      defense: [
        null,
        [
          Validators.required,
          Validators.min(MIN_EQUIPMENT_DEFENSE_VALUE),
          Validators.max(MAX_EQUIPMENT_DEFENSE_VALUE),
        ],
      ],
      buyPrice: [
        null,
        [
          Validators.required,
          Validators.min(MIN_EQUIPMENT_BUYPRICE_VALUE),
          Validators.max(MAX_EQUIPMENT_BUYPRICE_VALUE),
        ],
      ],
    });
  }

  // TODO: Define boundaries
  initializeEditForm({
    imageUrl,
    name,
    description,
    attack,
    defense,
    buyPrice,
  }: Equipment): void {
    this.imageSrc = imageUrl;

    this.formGroup = this.formBuilder.group({
      name: [
        name,
        [
          Validators.required,
          Validators.minLength(MIN_EQUIPMENT_NAME_LENGTH),
          Validators.maxLength(MAX_EQUIPMENT_NAME_LENGTH),
        ],
      ],
      description: [
        description,
        [
          Validators.required,
          Validators.minLength(MIN_EQUIPMENT_DESCRIPTION_LENGTH),
          Validators.maxLength(MAX_EQUIPMENT_DESCRIPTION_LENGTH),
        ],
      ],
      attack: [
        attack,
        [
          Validators.required,
          Validators.min(MIN_EQUIPMENT_ATTACK_VALUE),
          Validators.max(MAX_EQUIPMENT_ATTACK_VALUE),
        ],
      ],
      defense: [
        defense,
        [
          Validators.required,
          Validators.min(MIN_EQUIPMENT_DEFENSE_VALUE),
          Validators.max(MAX_EQUIPMENT_DEFENSE_VALUE),
        ],
      ],
      buyPrice: [
        buyPrice,
        [
          Validators.required,
          Validators.min(MIN_EQUIPMENT_BUYPRICE_VALUE),
          Validators.max(MAX_EQUIPMENT_BUYPRICE_VALUE),
        ],
      ],
    });
  }

  isFormValid(): boolean {
    if (this.imageSrc === undefined) {
      this.formGroup.markAllAsTouched();
      this.showSnackBar('La imagen es requerida');
      return false;
    }

    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      this.showSnackBar('Debe completar todos los campos');
      return false;
    }

    return true;
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];

    if (!file) {
      return;
    }

    this.file = file;

    // Image preview
    const reader = new FileReader();
    reader.onload = (_) => (this.imageSrc = reader.result as string);
    reader.readAsDataURL(file);
  }

  get fname(): FormControl {
    return this.formGroup.get('name') as FormControl;
  }
  get fdescription(): FormControl {
    return this.formGroup.get('description') as FormControl;
  }
  get fattack(): FormControl {
    return this.formGroup.get('attack') as FormControl;
  }
  get fdefense(): FormControl {
    return this.formGroup.get('defense') as FormControl;
  }
  get fbuyPrice(): FormControl {
    return this.formGroup.get('buyPrice') as FormControl;
  }
  get fsellPrice(): FormControl {
    return this.formGroup.get('sellPrice') as FormControl;
  }
}
