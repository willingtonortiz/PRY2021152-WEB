import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { RouterQuery } from '@datorama/akita-ng-router-store';
import { pairwise, startWith } from 'rxjs/operators';

import { AreasQuery } from '../..';
import { Failure, NoParams } from '../../../../../core/domain';
import { delayed } from '../../../../../shared/domain';
import {
  AddTopicUseCase,
  Area,
  Enemy,
  GetAllUnasignedEnemiesUseCase,
  GetOneTopicUseCase,
  TopicLevel,
  UpdateTopicUseCase,
} from '../../../domain';

const parseLevelsToEnemies = (levels: TopicLevel[]): Enemy[] => {
  return levels
    .sort((a, b) => a.number - b.number)
    .map((level) => ({
      id: level.enemyId,
      name: level.enemyName,
      imageUrl: level.enemyImageUrl,
    }));
};

const MIN_TOPIC_NAME_LENGTH = 5;
const MAX_TOPIC_NAME_LENGTH = 64;
const MIN_TOPIC_DESCRIPTION_LENGTH = 5;
const MAX_TOPIC_DESCRIPTION_LENGTH = 200;
const ENEMIES_LENGTH = 11;

enum FormMode {
  add,
  edit,
}

type FormValues = {
  name: string;
  description: string;
  imageUrl: string;
  enemies: Enemy[];
};

@Component({
  selector: 'app-add-topic-page',
  templateUrl: './add-topic-page.component.html',
  styleUrls: ['./add-topic-page.component.scss'],
})
export class AddTopicPageComponent implements OnInit {
  // * Constants
  MIN_TOPIC_NAME_LENGTH = MIN_TOPIC_NAME_LENGTH;
  MAX_TOPIC_NAME_LENGTH = MAX_TOPIC_NAME_LENGTH;
  MIN_TOPIC_DESCRIPTION_LENGTH = MIN_TOPIC_DESCRIPTION_LENGTH;
  MAX_TOPIC_DESCRIPTION_LENGTH = MAX_TOPIC_DESCRIPTION_LENGTH;

  formGroup: FormGroup;
  selectedArea?: Area;
  currentTopicId = '';

  // Image
  fileName = '';
  imageFile?: File;
  imageSrc?: string = undefined;

  // Enemies
  areEnemiesLoading = false;
  levels = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
  allEnemies: Enemy[] = [];
  leftEnemiesMatrix: Enemy[][] = [];

  // Utils
  idPageLoading = true;
  isTopicLoading: boolean = false;
  isTopicCreatedOrUpdated: boolean = false;
  formMode: FormMode = FormMode.add;

  // Original values
  originalName: string = '';
  originalDescription: string = '';
  originalImageSrc: string = '';

  constructor(
    private readonly snackBar: MatSnackBar,
    private readonly router: Router,
    private readonly formBuilder: FormBuilder,
    private readonly routerQuery: RouterQuery,
    private readonly areasQuery: AreasQuery,
    private readonly getOneTopicUseCase: GetOneTopicUseCase,
    private readonly getAllEnemiesUseCase: GetAllUnasignedEnemiesUseCase,
    private readonly addTopicUseCase: AddTopicUseCase,
    private readonly updateTopicUseCase: UpdateTopicUseCase
  ) {
    this.formGroup = this.formBuilder.group({
      name: [],
      description: [],
      enemies: [],
    });
  }

  ngOnInit(): void {
    this.selectedArea = this.areasQuery.getActive() as Area;
    const url = this.routerQuery.getValue().state?.url!;
    const topicId = this.routerQuery.getParams<string>('id');

    if (topicId === null) {
      this.goToLearningPage();
      return;
    }
    this.currentTopicId = topicId;

    // Add case
    if (url.includes('/add')) {
      this.formMode = FormMode.add;
      this.idPageLoading = false;
      this.fetchAllEnemies();
    }
    // Edit case
    else {
      this.formMode = FormMode.edit;
      this.loadTopicInformation(topicId);
    }
  }

  async loadTopicInformation(topicId: string): Promise<void> {
    const getOneTopicEither = await this.getOneTopicUseCase.execute({
      topicId,
    });
    const getAllEnemiesEither = await this.getAllEnemiesUseCase.execute(
      new NoParams()
    );

    getOneTopicEither.caseOf({
      Left: this.showSnackbarAndReturn,
      Right: async (topic) => {
        getAllEnemiesEither.caseOf({
          Left: this.showSnackbarAndReturn,
          Right: async (unselectedEnemies) => {
            const enemies: Enemy[] = parseLevelsToEnemies(topic.levels);
            this.allEnemies = [...enemies, ...unselectedEnemies];

            this.originalName = topic.name;
            this.originalDescription = topic.description;
            this.originalImageSrc = topic.imageUrl;

            this.initializeForm({
              form: {
                name: topic.name,
                description: topic.description,
                imageUrl: `${topic.imageUrl}?${Date.now()}`,
                enemies: enemies,
              },
              unselectedEnemies,
            });

            this.idPageLoading = false;
          },
        });
      },
    });
  }

  async showSnackbarAndReturn(failure: Failure): Promise<void> {
    this.showSnackBar(failure.message);

    await delayed(2000);

    this.goToLearningPage();
  }

  async fetchAllEnemies(): Promise<void> {
    this.areEnemiesLoading = true;
    const either = await this.getAllEnemiesUseCase.execute(new NoParams());
    either.caseOf({
      Left: (failure) => {
        this.showSnackBar(failure.message);
        this.areEnemiesLoading = false;
      },
      Right: (enemies) => {
        this.allEnemies = enemies;
        this.initializeForm();
        this.areEnemiesLoading = false;
      },
    });
  }

  addOrUpdateTopic(): void {
    if (this.formMode === FormMode.add) {
      this.addTopic();
    } else {
      this.updateTopic();
    }
  }

  async addTopic(): Promise<void> {
    if (this.imageSrc === undefined) {
      this.formGroup.markAllAsTouched();
      this.showSnackBar('Debe agregar una imagen');
      return;
    }

    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      this.showSnackBar('Debe completar todos los campos');

      return;
    }

    const area = this.areasQuery.getActive() as Area;
    const ids: string[] = this.enemiesFormArray.controls.map(
      (control) => control.value
    );

    this.isTopicLoading = true;
    (
      await this.addTopicUseCase.execute({
        area: area,
        topic: {
          name: this.fname.value,
          description: this.fdescription.value,
          image: this.imageFile!,
          enemyIds: ids,
        },
      })
    ).caseOf({
      Left: (failure) => {
        this.showSnackBar(failure.message);
        this.isTopicLoading = false;
      },
      Right: (_) => {
        this.isTopicLoading = false;
        this.isTopicCreatedOrUpdated = true;
      },
    });
  }

  async updateTopic(): Promise<void> {
    if (this.imageSrc === undefined) {
      this.formGroup.markAllAsTouched();
      this.showSnackBar('Debe agregar una imagen');
      return;
    }

    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      this.showSnackBar('Debe completar todos los campos');
      return;
    }

    const enemyIds: string[] = this.enemiesFormArray.controls.map(
      (control) => control.value
    );

    // Update name
    const currentName: string = this.fname.value;
    const hasNameChanged = this.originalName !== currentName;

    // Update description
    const currentDescription: string = this.fdescription.value;
    const hasDescriptionChanged =
      this.originalDescription !== currentDescription;

    // Update image
    const hasImageChanged = this.originalImageSrc !== this.imageSrc;

    this.isTopicLoading = true;
    (
      await this.updateTopicUseCase.execute({
        topicId: this.currentTopicId,
        ...(hasNameChanged && { name: currentName }),
        ...(hasDescriptionChanged && { description: currentDescription }),
        ...(hasImageChanged && { image: this.imageFile }),
        enemyIds: enemyIds,
      })
    ).caseOf({
      Left: (failure) => {
        this.showSnackBar(failure.message);
        this.isTopicLoading = false;
      },
      Right: () => {
        this.isTopicLoading = false;
        this.isTopicCreatedOrUpdated = true;
      },
    });
  }

  // Form helpers
  initializeForm(values?: {
    form: FormValues;
    unselectedEnemies: Enemy[];
  }): void {
    if (values === undefined) {
      this.leftEnemiesMatrix =
        this.createCompleteLeftEnemiesMatrix(ENEMIES_LENGTH);
      this.formGroup = this.buildEmptyForm();
      return;
    }

    this.imageSrc = values.form.imageUrl;

    this.leftEnemiesMatrix = this.createPartialLeftEnemiesMatrix(
      ENEMIES_LENGTH,
      values.form.enemies,
      values.unselectedEnemies
    );
    this.formGroup = this.buildFilledForm(values.form);
  }

  buildEmptyForm(): FormGroup {
    return this.formBuilder.group({
      name: [
        null,
        [
          Validators.required,
          Validators.minLength(MIN_TOPIC_NAME_LENGTH),
          Validators.maxLength(MAX_TOPIC_NAME_LENGTH),
        ],
      ],
      description: [
        null,
        [
          Validators.required,
          Validators.minLength(MIN_TOPIC_DESCRIPTION_LENGTH),
          Validators.maxLength(MAX_TOPIC_DESCRIPTION_LENGTH),
        ],
      ],
      enemies: this.formBuilder.array(this.buildEnemiesControls()),
    });
  }

  buildFilledForm(values: FormValues): FormGroup {
    return this.formBuilder.group({
      name: [
        values.name,
        [
          Validators.required,
          Validators.minLength(MIN_TOPIC_NAME_LENGTH),
          Validators.maxLength(MAX_TOPIC_NAME_LENGTH),
        ],
      ],
      description: [
        values.description,
        [
          Validators.required,
          Validators.minLength(MIN_TOPIC_DESCRIPTION_LENGTH),
          Validators.maxLength(MAX_TOPIC_DESCRIPTION_LENGTH),
        ],
      ],
      enemies: this.formBuilder.array(
        this.buildEnemiesControls(values.enemies)
      ),
    });
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];

    if (!file) {
      return;
    }
    this.fileName = file.name;
    this.imageFile = file;

    // Image preview
    const reader = new FileReader();
    reader.onload = (e) => (this.imageSrc = reader.result as string);
    reader.readAsDataURL(file);
  }

  buildEnemiesControls(selectedEnemies?: Enemy[]): FormControl[] {
    let param: (index: number) => FormControl;

    if (selectedEnemies === undefined) {
      param = (index) => {
        return this.createEnemyControl(index);
      };
    } else {
      param = (index) => {
        const enemy = selectedEnemies[index];
        return this.createEnemyControl(index, enemy.id);
      };
    }

    return Array.from({ length: ENEMIES_LENGTH }).map((_, index) =>
      param(index)
    );
  }

  createPartialLeftEnemiesMatrix(
    length: number,
    selectedEnemies: Enemy[],
    unselectedEnemies: Enemy[]
  ): Enemy[][] {
    return Array.from({ length }).map((_, index) => {
      const enemy = selectedEnemies[index];
      return [enemy, ...unselectedEnemies];
    });
  }

  createCompleteLeftEnemiesMatrix(length: number) {
    return Array.from({ length }).map(() => {
      return [...this.allEnemies];
    });
  }

  createEnemyControl(index: number, defaultEnemyId?: string): FormControl {
    const control = this.formBuilder.control(defaultEnemyId, [
      Validators.required,
    ]);

    control.valueChanges.pipe(startWith(control.value), pairwise()).subscribe({
      next: ([prev, curr]) => {
        // From value to value
        if (
          prev !== null &&
          prev !== undefined &&
          curr !== null &&
          curr !== undefined
        ) {
          this.addEnemyToMatrixExcept(index, prev);
          this.removeEnemyFromMatrixExcept(index, curr);
          return;
        }

        // value to null
        if (curr === null || curr === undefined) {
          this.addEnemyToMatrixExcept(index, prev);
          return;
        }

        // From null to value
        if (prev === null || prev === undefined) {
          this.removeEnemyFromMatrixExcept(index, curr);
          return;
        }
      },
    });

    return control;
  }

  addEnemyToMatrixExcept(exceptIndex: number, enemyId: string) {
    const foundEnemy = this.allEnemies.find((enemy) => enemy.id == enemyId);

    this.leftEnemiesMatrix = this.leftEnemiesMatrix.map((enemies, index) => {
      if (index === exceptIndex) {
        return enemies;
      }
      // ? TODO: Sort values
      return [...enemies, foundEnemy!];
    });
  }

  removeEnemyFromMatrixExcept(exceptIndex: number, enemyId: string) {
    this.leftEnemiesMatrix = this.leftEnemiesMatrix.map((enemies, index) => {
      if (index === exceptIndex) {
        return enemies;
      }

      return enemies.filter((enemy) => enemy.id !== enemyId);
    });
  }

  enemyForm(i: number): FormControl {
    return this.enemiesFormArray.controls[i] as FormControl;
  }

  goToLearningPage(): void {
    this.router.navigateByUrl('/learning');
  }

  get fname(): FormControl {
    return this.formGroup.get('name') as FormControl;
  }

  get fdescription(): FormControl {
    return this.formGroup.get('description') as FormControl;
  }

  get enemiesFormArray(): FormArray {
    return this.formGroup.get('enemies') as FormArray;
  }

  // Utils
  showSnackBar(message: string) {
    this.snackBar.open(message, '', {
      duration: 4000,
    });
  }
}
