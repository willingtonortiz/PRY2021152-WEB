import { Injectable } from '@angular/core';
import { Either } from 'purify-ts';

import { Failure, UseCase } from '../../../../core/domain';
import { TopicsStore } from '../../presentation';
import { TopicsRepository } from '../repositories';

interface DeleteTopicParams {
  topicId: string;
}

@Injectable()
export class DeleteTopicUseCase implements UseCase<boolean, DeleteTopicParams> {
  constructor(
    private readonly topicsStore: TopicsStore,
    private readonly topicsRepository: TopicsRepository
  ) {}

  async execute({
    topicId,
  }: DeleteTopicParams): Promise<Either<Failure, boolean>> {
    const either = await this.topicsRepository.deleteOne(topicId);

    return either.ifRight((_) => {
      this.topicsStore.remove(topicId);
    });
  }
}
