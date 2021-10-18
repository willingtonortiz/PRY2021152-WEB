import { Injectable } from '@angular/core';
import { Either } from 'purify-ts';

import { Failure, UseCase } from '../../../../core/domain';
import { GetOneProblemResult, ProblemsRepository } from '..';

type GetOneProblemParams = {
  problemId: string;
};

@Injectable()
export class GetOneProblemUseCase
  implements UseCase<GetOneProblemResult, GetOneProblemParams>
{
  constructor(private readonly problemsRepository: ProblemsRepository) {}

  async execute({
    problemId,
  }: GetOneProblemParams): Promise<Either<Failure, GetOneProblemResult>> {
    return this.problemsRepository.getOneById(problemId);
  }
}
