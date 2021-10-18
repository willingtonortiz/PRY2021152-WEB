import { Injectable } from '@angular/core';
import { Either } from 'purify-ts';

import { DifficultyLevel, Failure, NoParams, UseCase } from '../models';
import { DifficultyLevelsRepository } from '../repositories';

@Injectable()
export class GetDifficultyLevelsUseCase
  implements UseCase<DifficultyLevel[], NoParams>
{
  constructor(
    private readonly difficultyLevelsRepository: DifficultyLevelsRepository
  ) {}

  async execute(_: NoParams): Promise<Either<Failure, DifficultyLevel[]>> {
    return await this.difficultyLevelsRepository.getAll();
  }
}
