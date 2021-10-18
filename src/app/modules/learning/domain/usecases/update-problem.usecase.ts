import { Injectable } from '@angular/core';
import { Either } from 'purify-ts';

import { Failure, UseCase } from '../../../../core/domain';
import { ProblemsRepository, UpdateProblemResult } from '..';
import { ProblemsStore } from '../../presentation';

interface UpdateProblemParams {
  problemId: string;
  difficultyId?: string;
  difficultyName?: string;
  description?: string;
  image?: File;
  answers?: { id: string; description: string; isCorrect: boolean }[];
}

@Injectable()
export class UpdateProblemUseCase
  implements UseCase<UpdateProblemResult, UpdateProblemParams>
{
  constructor(
    private readonly problemsRepository: ProblemsRepository,
    private readonly problemsStore: ProblemsStore
  ) {}

  async execute({
    problemId,
    difficultyId,
    difficultyName,
    description,
    image,
    answers,
  }: UpdateProblemParams): Promise<Either<Failure, UpdateProblemResult>> {
    this.problemsStore.setLoading(true);

    const either = await this.problemsRepository.updateOne(problemId, {
      difficultyId,
      description,
      image,
      answers,
    });

    this.problemsStore.setLoading(false);

    return either.ifRight(({ imageUrl }) => {
      this.problemsStore.update(problemId, {
        ...(description && { description }),
        ...(imageUrl && { imageUrl: `${imageUrl}?${Date.now()}` }),
        ...(difficultyId && { difficulty: difficultyName }),
      });
    });
  }
}
