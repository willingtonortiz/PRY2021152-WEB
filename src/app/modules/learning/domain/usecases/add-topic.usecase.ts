import { Injectable } from '@angular/core';
import { Either } from 'purify-ts';

import { Failure, UseCase } from '../../../../core/domain';
import { TopicsStore } from '../../presentation';
import { AddTopicResult, AddTopicType, Area } from '../models';
import { TopicsRepository } from '../repositories';

interface AddTopicParams {
  area: Area;
  topic: AddTopicType;
}

@Injectable()
export class AddTopicUseCase
  implements UseCase<AddTopicResult, AddTopicParams>
{
  constructor(
    private readonly topicsRepository: TopicsRepository,
    private readonly topicsStore: TopicsStore
  ) {}

  async execute({
    area,
    topic,
  }: AddTopicParams): Promise<Either<Failure, AddTopicResult>> {
    this.topicsStore.setLoading(true);

    const either = await this.topicsRepository.addOne(area.id, topic);

    this.topicsStore.setLoading(false);

    const { name } = topic;
    return either.ifRight(({ id, imageUrl }) => {
      this.topicsStore.add({ id, imageUrl, name }, { prepend: true });
    });
  }
}
