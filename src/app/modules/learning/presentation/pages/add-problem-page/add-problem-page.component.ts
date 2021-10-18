import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { RouterQuery } from '@datorama/akita-ng-router-store';

import { AreasQuery, ProblemsQuery, TopicsQuery } from '../..';
import {
  DifficultyLevel,
  GetDifficultyLevelsUseCase,
  NoParams,
} from '../../../../../core/domain';
import {
  AddProblemUseCase,
  Area,
  AreaTopic,
  GetOneProblemResult,
  GetOneProblemUseCase,
  GetOneTopicUseCase,
  ProblemAnswer,
  UpdateProblemUseCase,
} from '../../../domain';

type ComponentMode = 'ADD' | 'EDIT';

const hasRepeatedAnswers = (answers: string[]): boolean => {
  for (let i = 0; i < answers.length; i++) {
    for (let j = i + 1; j < answers.length; j++) {
      if (answers[i] === answers[j]) {
        return true;
      }
    }
  }

  return false;
};

// ? TODO: Agregar opción para quitar imagen
const MIN_PROBLEM_DESCRIPTION_LENGTH = 5;
const MAX_PROBLEM_DESCRIPTION_LENGTH = 200;
const MIN_PROBLEM_ALTERNATIVE_LENGTH = 1;
const MAX_PROBLEM_ALTERNATIVE_LENGTH = 20;

@Component({
  selector: 'app-add-problem-page',
  templateUrl: './add-problem-page.component.html',
  styleUrls: ['./add-problem-page.component.scss'],
})
export class AddProblemPageComponent implements OnInit {
  MIN_PROBLEM_DESCRIPTION_LENGTH = MIN_PROBLEM_DESCRIPTION_LENGTH;
  MAX_PROBLEM_DESCRIPTION_LENGTH = MAX_PROBLEM_DESCRIPTION_LENGTH;
  MIN_PROBLEM_ALTERNATIVE_LENGTH = MIN_PROBLEM_ALTERNATIVE_LENGTH;
  MAX_PROBLEM_ALTERNATIVE_LENGTH = MAX_PROBLEM_ALTERNATIVE_LENGTH;

  mode: ComponentMode = 'ADD';
  problemAdded = false;
  formGroup: FormGroup;
  file?: File;
  imageSrc?: string;
  selectedAnswerIndex?: number;

  // * Areas
  selectedArea = this.areasQuery.getActive() as Area;

  // * Topics
  selectedTopic?: AreaTopic = this.topicsQuery.getActive() as AreaTopic;
  problemsLoading$ = this.problemsQuery.selectLoading();

  // * Problems
  currentProblemId?: string;
  currentProblemAnswers: ProblemAnswer[] = [];

  // * Difficulty Levels
  difficultyLevels: DifficultyLevel[] = [];

  constructor(
    private readonly snackBar: MatSnackBar,
    private readonly router: Router,
    private readonly formBuilder: FormBuilder,
    private readonly routerQuery: RouterQuery,

    // States
    private readonly areasQuery: AreasQuery,
    private readonly topicsQuery: TopicsQuery,
    private readonly problemsQuery: ProblemsQuery,

    // Usecases
    private readonly getOneTopicUseCase: GetOneTopicUseCase,
    private readonly getOneProblemUseCase: GetOneProblemUseCase,
    private readonly addProblemUseCase: AddProblemUseCase,
    private readonly updateProblemUseCase: UpdateProblemUseCase,
    private readonly getDifficultyLevelsUseCase: GetDifficultyLevelsUseCase
  ) {
    this.formGroup = this.formBuilder.group({
      description: [],
      difficulty: [],
      answers: this.formBuilder.array([]),
    });
  }

  ngOnInit(): void {
    this.fetchDifficultyLevels();
    this.initializeForm();
  }

  async fetchSelectedTopic(): Promise<void> {
    const topicId = this.routerQuery.getParams<string>('id');
    if (!topicId) {
      // TODO: Return to previous page
      return;
    }

    (await this.getOneTopicUseCase.execute({ topicId })).caseOf({
      Left: (failure) => this.showSnackBar(failure.message),
      Right: (topic) => {
        this.selectedTopic = topic;
      },
    });
  }

  async fetchDifficultyLevels(): Promise<void> {
    (await this.getDifficultyLevelsUseCase.execute(new NoParams())).caseOf({
      Left: (failure) => this.showSnackBar(failure.message),
      Right: (difficultyLevels) => {
        this.difficultyLevels = difficultyLevels;
      },
    });
  }

  async initializeForm(): Promise<void> {
    const { state } = this.routerQuery.getValue();
    const url = state?.url;

    // Add case
    if (url?.endsWith('add')) {
      this.mode = 'ADD';
      this.fetchSelectedTopic();
      this.initializeAddForm();
      return;
    }

    // Edit case
    const problemId = this.routerQuery.getParams<string>('id');
    if (!problemId) {
      this.router.navigateByUrl('/learning');
      return;
    }
    this.currentProblemId = problemId;

    if (url?.endsWith('edit')) {
      this.mode = 'EDIT';

      (await this.getOneProblemUseCase.execute({ problemId })).caseOf({
        Left: (failure) => this.showSnackBar(failure.message),
        Right: (problem) => {
          this.initializeEditForm(problem);
        },
      });
      return;
    }
  }

  initializeAddForm(): void {
    this.formGroup = this.formBuilder.group({
      description: [
        '',
        [
          Validators.minLength(MIN_PROBLEM_DESCRIPTION_LENGTH),
          Validators.maxLength(MAX_PROBLEM_DESCRIPTION_LENGTH),
        ],
      ],
      difficulty: [null, [Validators.required]],
      answers: this.formBuilder.array([
        this.createAnswerControl(),
        this.createAnswerControl(),
        this.createAnswerControl(),
        this.createAnswerControl(),
        this.createAnswerControl(),
      ]),
    });
  }

  initializeEditForm({
    imageUrl,
    description,
    difficultyId,
    answers,
  }: GetOneProblemResult): void {
    // Answers
    const answersCopy = [...answers];
    this.currentProblemAnswers = answersCopy;
    const answersControls = answersCopy.map((answer, index) => {
      if (answer.isCorrect) {
        this.selectedAnswerIndex = index;
      }

      return this.createAnswerControl(answer.description);
    });

    if (imageUrl) {
      this.imageSrc = `${imageUrl}?${Date.now()}`;
    }
    this.formGroup = this.formBuilder.group({
      description: [
        description,
        [
          Validators.minLength(MIN_PROBLEM_DESCRIPTION_LENGTH),
          Validators.maxLength(MAX_PROBLEM_DESCRIPTION_LENGTH),
        ],
      ],
      difficulty: [difficultyId, [Validators.required]],
      answers: this.formBuilder.array(answersControls),
    });
  }

  createAnswerControl(value: string = ''): FormControl {
    return this.formBuilder.control(value, [
      Validators.required,
      Validators.minLength(MIN_PROBLEM_ALTERNATIVE_LENGTH),
      Validators.maxLength(MAX_PROBLEM_ALTERNATIVE_LENGTH),
    ]);
  }

  onAnswerSelected(index?: number): void {
    this.selectedAnswerIndex = index;
  }

  addOrEditProblem(): void {
    if (!this.isFormValid()) {
      return;
    }

    const answers = this.answersForm.value as string[];

    // Answers must be different
    const foundEqual = hasRepeatedAnswers(answers);
    if (foundEqual) {
      this.showSnackBar('Las alternativas deben ser diferentes');
      return;
    }

    // Selected answer must be selected
    if (this.selectedAnswerIndex === undefined) {
      this.showSnackBar('Debe seleccionar la alternativa correcta');
      return;
    }

    if (this.mode === 'ADD') {
      this.addProblem();
    }

    if (this.mode === 'EDIT') {
      this.editProblem();
    }
  }

  async addProblem(): Promise<void> {
    const answers = this.answersForm.value as string[];
    const parsedAnswers = answers.map((value, index) => {
      return {
        description: value,
        isCorrect: this.selectedAnswerIndex === index,
      };
    });
    const selectedTopic = this.selectedTopic!;
    const difficultyLevel = this.findDifficultyLevelById(
      this.fdifficulty.value
    );

    (
      await this.addProblemUseCase.execute({
        topicId: selectedTopic.id,
        problem: {
          difficultyId: this.fdifficulty.value,
          difficultyName: difficultyLevel?.name,
          answers: parsedAnswers,
          description: this.fdescription.value,
          image: this.file,
        },
      })
    ).caseOf({
      Right: (_) => {
        this.problemAdded = true;
      },
      Left: (failure) => this.showSnackBar(failure.message),
    });
  }

  async editProblem(): Promise<void> {
    const formAnswers = this.answersForm.value as string[];
    const problemId = this.currentProblemId!;

    const difficultyLevel = this.findDifficultyLevelById(
      this.fdifficulty.value
    );

    const parsedAnswers = this.currentProblemAnswers.map(({ id }, index) => {
      return {
        id,
        description: formAnswers[index],
        isCorrect: index === this.selectedAnswerIndex!,
      };
    });

    (
      await this.updateProblemUseCase.execute({
        problemId,
        image: this.file,
        description: this.fdescription.value,
        difficultyId: this.fdifficulty.value,
        difficultyName: difficultyLevel.name,
        answers: parsedAnswers,
      })
    ).caseOf({
      Left: (failure) => this.showSnackBar(failure.message),
      Right: (_) => {
        this.problemAdded = true;
      },
    });
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];

    if (!file) {
      return;
    }

    this.file = file;
    // Image preview
    const reader = new FileReader();
    reader.onload = (e) => (this.imageSrc = reader.result as string);
    reader.readAsDataURL(file);
  }

  findDifficultyLevelById(difficultyId: string): DifficultyLevel {
    return this.difficultyLevels.find((x) => x.id === difficultyId)!;
  }

  // Utils
  showSnackBar(message: string) {
    this.snackBar.open(message, '', { duration: 4000 });
  }

  // Form Helpers
  isFormValid(): boolean {
    const description = this.fdescription.value;

    if (description === '' && !this.imageSrc) {
      this.formGroup.markAllAsTouched();
      this.showSnackBar('Se debe proveer una imagen o una descripción');
      return false;
    }

    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      this.showSnackBar('Debe completar todos los campos');
      return false;
    }

    return true;
  }

  get fdescription(): AbstractControl {
    return this.formGroup.get('description')!;
  }
  get fdifficulty(): AbstractControl {
    return this.formGroup.get('difficulty')!;
  }
  get answersForm(): FormArray {
    return this.formGroup.get('answers') as FormArray;
  }
  get answersValues(): string[] {
    return this.answersForm.controls.map((x) => x.value);
  }
  answerForm(i: number): FormControl {
    return this.answersForm.controls[i] as FormControl;
  }
}
