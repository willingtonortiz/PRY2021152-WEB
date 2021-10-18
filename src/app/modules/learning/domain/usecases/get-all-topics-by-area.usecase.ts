import { Injectable } from '@angular/core';
import { Either, Right } from 'purify-ts';

import { Failure, UseCase } from '../../../../core/domain';
import { AreasQuery, TopicsStore } from '../../presentation';
import { Area, AreaTopic, Topic } from '../models';
import { TopicsRepository } from '../repositories';

interface GetAllTopicsByAreaParams {
  area: Area;
}

@Injectable()
export class GetAllTopicsByAreaUseCase
  implements UseCase<AreaTopic[], GetAllTopicsByAreaParams>
{
  constructor(
    private readonly topicsRepository: TopicsRepository,
    private readonly areasQuery: AreasQuery,
    private readonly topicsStore: TopicsStore
  ) {}

  async execute({
    area,
  }: GetAllTopicsByAreaParams): Promise<Either<Failure, AreaTopic[]>> {
    // this.topicsStore.setLoading(true);
    // this.topicsStore.setLoading(false);

    // const topicsEither = await this.topicsRepository.getAllByArea(area);


    const foundArea = this.areasQuery.getEntity(area.id);
    const topics = foundArea?.mathTopics ?? [];

    this.topicsStore.set(topics);

    return Right(topics);

    // return topicsEither.ifRight((topics) => {

    //   this.topicsStore.set(topics);
    // });
  }
}
