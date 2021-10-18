import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ConfirmationDialogComponent } from '../../../../../shared/presentation';
import {
  AreasQuery,
  AreasStore,
  ProblemsQuery,
  TopicsQuery,
  TopicsStore,
} from '../..';
import {
  Area,
  Topic,
  AreaTopic,
  DeleteTopicUseCase,
  GetAllProblemsByTopicUseCase,
  GetAllTopicsByAreaUseCase,
  DeleteProblemUseCase,
} from '../../../domain';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss'],
})
export class MainPageComponent implements OnInit, OnDestroy {
  destroyed = new Subject<void>();
  // * Areas
  selectedArea?: Area = undefined;
  areasLoading$ = this.areasQuery.selectLoading();
  areas$ = this.areasQuery.selectAll();

  // * Topics
  topicsLoading$ = this.topicsQuery.selectLoading();
  selectedTopic$ = this.topicsQuery.selectActive() as Observable<Topic>;
  topics$ = this.topicsQuery.selectAllSorted$;

  // * Problems
  displayedColumns = ['index', 'description', 'difficulty', 'actions'];
  problemsLoading$ = this.problemsQuery.selectLoading();
  problems$ = this.problemsQuery.selectAllByDifficulty$;

  constructor(
    private readonly dialog: MatDialog,
    private readonly snackBar: MatSnackBar,

    // States
    private readonly areasStore: AreasStore,
    private readonly areasQuery: AreasQuery,
    private readonly topicsStore: TopicsStore,
    private readonly topicsQuery: TopicsQuery,
    private readonly problemsQuery: ProblemsQuery,
    // Usecases
    private readonly getAllTopicsByAreaUseCase: GetAllTopicsByAreaUseCase,
    private readonly deleteTopicUseCase: DeleteTopicUseCase,
    private readonly getAllProblemsByTopicUseCase: GetAllProblemsByTopicUseCase,
    private readonly deleteProblemUseCase: DeleteProblemUseCase
  ) {}

  ngOnInit(): void {
    (this.areasQuery.selectActive() as Observable<Area>)
      .pipe(takeUntil(this.destroyed))
      .subscribe({
        next: (area) => {
          this.selectedArea = area;
        },
      });
  }

  onAreaChanged(change: MatSelectChange): void {
    const area: Area = change.value;
    this.areasStore.setActive(area.id);
    this.fetchTopicsByArea(area, false);
  }

  async fetchTopicsByArea(area: Area, useDefault: boolean): Promise<void> {
    (await this.getAllTopicsByAreaUseCase.execute({ area })).caseOf({
      Right: (topics) => {
        if (!useDefault) {
          return;
        }
        const firstTopic = topics[0];
        this.topicsStore.setActive(firstTopic.id);
      },
      Left: (failure) => this.showSnackBar(failure.message),
    });
  }

  onTopicSelected(topic: AreaTopic): void {
    const selectedTopic = this.topicsQuery.getActive();

    if (selectedTopic?.id === topic.id) {
      return;
    }

    this.topicsStore.setActive(topic.id);
    this.fetchProblemsByTopic(topic.id);
  }

  async fetchProblemsByTopic(topicId: string): Promise<void> {
    (await this.getAllProblemsByTopicUseCase.execute({ topicId })).caseOf({
      Right: (_) => {},
      Left: (failure) => this.showSnackBar(failure.message),
    });
  }

  topicTrackBy(_: number, topic: AreaTopic): string {
    return topic.id;
  }

  removeTopic(topicId: string): void {
    const topic = this.topicsQuery.getEntity(topicId);

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      autoFocus: false,
      disableClose: true,
      data: { name: `"${topic?.name}"` },
    });

    dialogRef.afterClosed().subscribe(async (x) => {
      if (x !== true) {
        return;
      }

      (await this.deleteTopicUseCase.execute({ topicId })).caseOf({
        Left: (failure) => this.showSnackBar(failure.message),
        Right: (_) => {
          this.showSnackBar('Tema eliminado correctamente');
        },
      });
    });
  }

  ngOnDestroy(): void {
    this.destroyed.next();
    this.destroyed.complete();
  }

  // Utils
  showSnackBar(message: string) {
    this.snackBar.open(message, '', { duration: 4000 });
  }

  removeProblem(problemId: string, index: number): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      autoFocus: false,
      disableClose: true,
      data: { name: `el problema ${index + 1}` },
    });

    dialogRef.afterClosed().subscribe(async (x) => {
      if (x !== true) {
        return;
      }

      (await this.deleteProblemUseCase.execute({ problemId })).caseOf({
        Left: (failure) => this.showSnackBar(failure.message),
        Right: (_) => {
          this.showSnackBar('Problema eliminado correctamente');
        },
      });
    });
  }
}
