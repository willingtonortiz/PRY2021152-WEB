import { Injectable } from '@angular/core';
import { Either } from 'purify-ts';

import { Failure, UseCase } from '../../../../core/domain';
import { ProblemsStore } from '../../presentation';
import { AddProblemResult, AddProblemType } from '../models';
import { ProblemsRepository } from '../repositories';

interface AddTopicProblemParams {
  topicId: string;
  problem: AddProblemType;
}

@Injectable()
export class AddProblemUseCase
  implements UseCase<AddProblemResult, AddTopicProblemParams>
{
  constructor(
    private readonly problemsRepository: ProblemsRepository,
    private readonly problemsStore: ProblemsStore
  ) {}

  async execute({
    topicId,
    problem,
  }: AddTopicProblemParams): Promise<Either<Failure, AddProblemResult>> {
    this.problemsStore.setLoading(true);

    const either = await this.problemsRepository.addOne(topicId, problem);

    this.problemsStore.setLoading(false);

    const { description, difficultyName } = problem;

    return either.ifRight(({ id, imageUrl }) => {
      this.problemsStore.add({
        id,
        difficulty: difficultyName,
        description,
        imageUrl,
      });
    });
  }
}
