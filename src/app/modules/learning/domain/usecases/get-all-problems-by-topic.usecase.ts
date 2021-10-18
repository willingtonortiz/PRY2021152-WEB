import { Injectable } from '@angular/core';
import { Either } from 'purify-ts';

import { Failure, NoParams, UseCase } from '../../../../core/domain';
import { ProblemsStore } from '../../presentation';
import { Problem } from '../models';
import { ProblemsRepository } from '../repositories';

interface GetAllProblemsByTopicParams {
  topicId: string;
}

@Injectable()
export class GetAllProblemsByTopicUseCase
  implements UseCase<Problem[], NoParams>
{
  constructor(
    private readonly problemsRepository: ProblemsRepository,
    private readonly problemsStore: ProblemsStore
  ) {}

  async execute({
    topicId,
  }: GetAllProblemsByTopicParams): Promise<Either<Failure, Problem[]>> {
    this.problemsStore.setLoading(true);

    const problemsEither = await this.problemsRepository.getAllByTopic(topicId);

    this.problemsStore.setLoading(false);

    return problemsEither.ifRight((problems) => {
      this.problemsStore.set(problems);
    });
  }
}
