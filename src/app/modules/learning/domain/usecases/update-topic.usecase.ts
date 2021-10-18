import { Injectable } from '@angular/core';
import { Either } from 'purify-ts';

import { TopicsRepository, UpdateTopicResult } from '..';
import { Failure, UseCase } from '../../../../core/domain';
import { TopicsStore } from '../../presentation';

interface UpdateTopicParams {
  topicId: string;
  name?: string;
  description?: string;
  enemyIds?: string[];
  image?: File;
}

@Injectable()
export class UpdateTopicUseCase
  implements UseCase<UpdateTopicResult, UpdateTopicParams>
{
  constructor(
    private readonly topicsRepository: TopicsRepository,
    private readonly topicsStore: TopicsStore
  ) {}

  async execute({
    topicId,
    name,
    description,
    enemyIds,
    image,
  }: UpdateTopicParams): Promise<Either<Failure, UpdateTopicResult>> {
    this.topicsStore.setLoading(true);

    const either = await this.topicsRepository.updateOne(topicId, {
      name,
      description,
      enemyIds,
      image,
    });

    this.topicsStore.setLoading(false);

    return either.ifRight(({ imageUrl }) => {
      this.topicsStore.update(topicId, {
        ...(name && { name }),
        ...(imageUrl && { imageUrl: `${imageUrl}?${Date.now()}` }),
      });
    });
  }
}
