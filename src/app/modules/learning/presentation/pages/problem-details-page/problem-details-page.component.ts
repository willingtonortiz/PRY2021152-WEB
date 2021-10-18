import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RouterQuery } from '@datorama/akita-ng-router-store';

import { AreasQuery, TopicsQuery } from '../..';
import { Area, GetOneProblemUseCase, Problem } from '../../../domain';

@Component({
  selector: 'app-problem-details-page',
  templateUrl: './problem-details-page.component.html',
  styleUrls: ['./problem-details-page.component.scss'],
})
export class ProblemDetailsPageComponent implements OnInit {
  selectedAreaName?: string;
  selectedTopicName?: string;
  problemId: string = '';
  problem: Problem = {
    id: '',
    difficulty: '',
    description: '',
    imageUrl: '',
  };
  answers: string[] = [];
  selectedAnswer: number = 1;

  constructor(
    private readonly routerQuery: RouterQuery,
    private readonly router: Router,
    private readonly areasQuery: AreasQuery,
    private readonly topicsQuery: TopicsQuery,
    private readonly getOneProblemUsecase: GetOneProblemUseCase
  ) {}

  async ngOnInit(): Promise<void> {
    const area = this.areasQuery.getActive() as Area;
    this.selectedAreaName = area.name;

    const topic = this.topicsQuery.getActive();
    this.selectedTopicName = topic?.name;

    const problemId: string | null = this.routerQuery.getParams('id');
    if (!problemId) {
      this.router.navigateByUrl('learning');
      return;
    }
    this.problemId = problemId;

    (await this.getOneProblemUsecase.execute({ problemId })).caseOf({
      Left: (_) => {
        this.router.navigateByUrl('learning');
      },
      Right: ({ id, difficultyName, description, imageUrl, answers }) => {
        this.problem = {
          id,
          difficulty: difficultyName,
          description,
          ...(imageUrl && { imageUrl: `${imageUrl}?${Date.now()}` }),
        };

        this.selectedAnswer = answers.findIndex((x) => x.isCorrect);

        this.answers = answers.map((x) => x.description);
      },
    });
  }
}
