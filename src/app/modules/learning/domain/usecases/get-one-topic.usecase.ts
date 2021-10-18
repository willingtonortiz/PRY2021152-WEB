import { Injectable } from '@angular/core';
import { Either } from 'purify-ts';
import { Topic, TopicsRepository } from '..';
import { Failure, UseCase } from '../../../../core/domain';

type GetOneTopicParams = {
  topicId: string;
};

@Injectable()
export class GetOneTopicUseCase implements UseCase<Topic, GetOneTopicParams> {
  constructor(private readonly topicsRepository: TopicsRepository) {}

  async execute({
    topicId,
  }: GetOneTopicParams): Promise<Either<Failure, Topic>> {
    return this.topicsRepository.getOneById(topicId);
  }
}
