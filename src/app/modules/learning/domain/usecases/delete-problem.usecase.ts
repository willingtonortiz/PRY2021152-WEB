import { Injectable } from '@angular/core';
import { Either } from 'purify-ts';

import { ProblemsRepository } from '..';
import { Failure, UseCase } from '../../../../core/domain';
import { ProblemsStore } from '../../presentation';

interface DeleteProblemParams {
  problemId: string;
}

@Injectable()
export class DeleteProblemUseCase
  implements UseCase<boolean, DeleteProblemParams>
{
  constructor(
    private readonly problemsStore: ProblemsStore,
    private readonly problemsRepository: ProblemsRepository
  ) {}

  async execute({
    problemId,
  }: DeleteProblemParams): Promise<Either<Failure, boolean>> {
    const either = await this.problemsRepository.deleteOne(problemId);

    return either.ifRight((_) => {
      this.problemsStore.remove(problemId);
    });
  }
}
