import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Enemy } from '../../../domain';

type ComponentMode = 'PREVIEW' | 'SHOW' | 'ADD' | 'EDIT' | 'DELETE';

const MIN_ENEMY_NAME_LENGTH = 3;
const MAX_ENEMY_NAME_LENGTH = 25;

@Component({
  selector: 'app-enemy-card',
  templateUrl: './enemy-card.component.html',
  styleUrls: ['./enemy-card.component.scss'],
})
export class EnemyCardComponent implements OnInit {
  MIN_ENEMY_NAME_LENGTH = MIN_ENEMY_NAME_LENGTH;
  MAX_ENEMY_NAME_LENGTH = MAX_ENEMY_NAME_LENGTH;

  @Input() mode: ComponentMode = 'PREVIEW';
  @Input() enemy?: Enemy;

  @Output() onAddNewEnemy = new EventEmitter<void>();
  @Output() onConfirmAdd = new EventEmitter<{ name: string; image: File }>();
  @Output() onCancelAdd = new EventEmitter<void>();
  @Output() onConfirmEdit = new EventEmitter<{
    enemyId: string;
    name?: string;
    image?: File;
  }>();
  @Output() onDeleteEnemy = new EventEmitter<Enemy>();

  formGroup: FormGroup = this.formBuilder.group({});
  imageSrc?: string;
  imageFile?: File;

  constructor(
    private readonly snackBar: MatSnackBar,
    private readonly formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    if (this.mode === 'ADD') {
      this.buildAddEnemyForm();
    }
  }

  emitAddNewEnemy(): void {
    this.onAddNewEnemy.emit();
  }

  emitOnConfirmAdd(): void {
    if (this.formGroup.invalid) {
      this.showSnackBar('El nombre es inválido');
      this.formGroup.markAllAsTouched();
      return;
    }

    if (!this.imageFile) {
      this.showSnackBar('La imagen es requerida');
      return;
    }

    this.onConfirmAdd.emit({ name: this.fname.value, image: this.imageFile! });
  }

  emitOnConfirmEdit(): void {
    if (this.formGroup.invalid) {
      this.showSnackBar('El nombre es inválido');
      this.formGroup.markAllAsTouched();
      return;
    }

    this.onConfirmEdit.emit({
      enemyId: this.enemy?.id!,
      name: this.fname.value,
      image: this.imageFile,
    });
  }

  setEditMode(): void {
    this.mode = 'EDIT';
    const enemy = this.enemy;

    this.buildUpdateEnemyForm({
      name: enemy?.name!,
      imageUrl: enemy?.imageUrl!,
    });
  }

  setShowMode(): void {
    this.mode = 'SHOW';
  }

  emitOnDeleteEnemy(): void {
    this.onDeleteEnemy.emit(this.enemy);
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];

    if (!file) {
      return;
    }
    this.imageFile = file;

    // Image preview
    const reader = new FileReader();
    reader.onload = (e) => (this.imageSrc = reader.result as string);
    reader.readAsDataURL(file);
  }

  get fname(): AbstractControl {
    return this.formGroup.get('name')!;
  }

  buildAddEnemyForm(): void {
    this.formGroup = this.formBuilder.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(MIN_ENEMY_NAME_LENGTH),
          Validators.maxLength(MAX_ENEMY_NAME_LENGTH),
        ],
      ],
    });
  }

  buildUpdateEnemyForm({
    name,
    imageUrl,
  }: {
    name: string;
    imageUrl: string;
  }): void {
    this.imageSrc = imageUrl;
    this.formGroup = this.formBuilder.group({
      name: [
        name,
        [
          Validators.required,
          Validators.minLength(MIN_ENEMY_NAME_LENGTH),
          Validators.maxLength(MAX_ENEMY_NAME_LENGTH),
        ],
      ],
    });
  }

  showSnackBar(message: string) {
    this.snackBar.open(message, '', { duration: 4000 });
  }
}
