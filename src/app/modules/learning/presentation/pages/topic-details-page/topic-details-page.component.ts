import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RouterQuery } from '@datorama/akita-ng-router-store';

import { AreasQuery } from '../..';
import { Area, GetOneTopicUseCase, Topic, TopicLevel } from '../../../domain';

@Component({
  selector: 'app-topic-details-page',
  templateUrl: './topic-details-page.component.html',
  styleUrls: ['./topic-details-page.component.scss'],
})
export class TopicDetailsPageComponent implements OnInit {
  selectedArea?: Area;
  topicId: string = '';
  topic: Topic = {
    id: '',
    name: '',
    description: '',
    imageUrl: '',
    levels: [],
  };
  enemies: TopicLevel[] = [];

  constructor(
    private readonly router: Router,
    private readonly routerQuery: RouterQuery,
    private readonly areasQuery: AreasQuery,
    private readonly getOneTopicUseCase: GetOneTopicUseCase
  ) {}

  ngOnInit(): void {
    this.selectedArea = this.areasQuery.getActive() as Area;

    const topicId: string | null = this.routerQuery.getParams('id');

    if (topicId === null) {
      this.goToTopicsPage();
      return;
    }

    this.topicId = topicId;
    this.fetchTopicById(topicId);
  }

  async fetchTopicById(topicId: string): Promise<void> {
    (await this.getOneTopicUseCase.execute({ topicId: topicId })).caseOf({
      Left: () => {
        this.goToTopicsPage();
      },
      Right: (topic) => {
        this.topic = topic;
        this.topic.imageUrl = `${topic.imageUrl}?${Date.now()}`;
        this.enemies = topic.levels.sort((a, b) => a.number - b.number);
      },
    });
  }

  goToTopicsPage(): void {
    this.router.navigateByUrl('/learning');
  }
}
