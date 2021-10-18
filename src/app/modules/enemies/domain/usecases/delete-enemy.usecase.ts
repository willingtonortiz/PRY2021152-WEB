import { Injectable } from '@angular/core';
import { Either } from 'purify-ts';

import { EnemiesRepository } from '..';
import { Failure, NoParams, UseCase } from '../../../../core/domain';

interface DeleteEnemyParams {
  enemyId: string;
}

@Injectable()
export class DeleteEnemyUseCase implements UseCase<boolean, NoParams> {
  constructor(private readonly enemyRepository: EnemiesRepository) {}

  async execute({
    enemyId,
  }: DeleteEnemyParams): Promise<Either<Failure, boolean>> {
    return this.enemyRepository.deleteOne(enemyId);
  }
}
