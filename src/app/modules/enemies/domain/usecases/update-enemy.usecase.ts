import { Injectable } from '@angular/core';
import { Either } from 'purify-ts';

import { Failure, UseCase } from '../../../../core/domain';
import { EnemiesRepository, UpdateEnemyResult } from '..';

interface UpdateEnemyParams {
  enemyId: string;
  name?: string;
  image?: File;
}

@Injectable()
export class UpdateEnemyUseCase
  implements UseCase<UpdateEnemyResult, UpdateEnemyParams>
{
  constructor(private readonly enemyRepository: EnemiesRepository) {}

  execute({
    enemyId,
    name,
    image,
  }: UpdateEnemyParams): Promise<Either<Failure, UpdateEnemyResult>> {
    return this.enemyRepository.updateOne(enemyId, { name, image });
  }
}
