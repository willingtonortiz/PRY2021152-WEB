import { Injectable } from '@angular/core';
import { Either } from 'purify-ts';

import { Failure, NoParams, UseCase } from '../../../../core/domain';
import { Enemy } from '../models';
import { EnemiesRepository } from '../repositories';

@Injectable()
export class GetAllEnemiesUseCase implements UseCase<Enemy[], NoParams> {
  constructor(private readonly enemiesRepository: EnemiesRepository) {}

  async execute(_: NoParams): Promise<Either<Failure, Enemy[]>> {
    return await this.enemiesRepository.getAllUnasigned();
  }
}
