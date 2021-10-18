import { Injectable } from '@angular/core';
import { Either } from 'purify-ts';

import { EnemiesRepository, Enemy } from '..';
import { Failure, NoParams, UseCase } from '../../../../core/domain';

@Injectable()
export class GetAllEnemiesUseCase implements UseCase<Enemy[], NoParams> {
  constructor(private readonly enemyRepository: EnemiesRepository) {}

  async execute(_: NoParams): Promise<Either<Failure, Enemy[]>> {
    const either = await this.enemyRepository.getAll();
    return either.map((items) =>
      items.map((enemy) => ({
        ...enemy,
        imageUrl: `${enemy.imageUrl}?${Date.now()}`,
      }))
    );
  }
}
