import { Injectable } from '@angular/core';
import { Either } from 'purify-ts';

import { Failure, UseCase } from '../../../../core/domain';
import { AddEnemyResult, EnemiesRepository } from '..';

interface AddEnemyParams {
  name: string;
  image: File;
}

@Injectable()
export class AddEnemyUseCase
  implements UseCase<AddEnemyResult, AddEnemyParams>
{
  constructor(private readonly enemyRepository: EnemiesRepository) {}

  execute({
    name,
    image,
  }: AddEnemyParams): Promise<Either<Failure, AddEnemyResult>> {
    return this.enemyRepository.addOne({ name, image });
  }
}
