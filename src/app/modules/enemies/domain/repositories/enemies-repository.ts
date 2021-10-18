import { Either } from 'purify-ts';

import { Failure } from '../../../../core/domain';
import {
  AddEnemyResult,
  AddEnemyType,
  Enemy,
  UpdateEnemyResult,
  UpdateEnemyType,
} from '..';

export abstract class EnemiesRepository {
  abstract getAll(): Promise<Either<Failure, Enemy[]>>;

  abstract addOne(
    enemy: AddEnemyType
  ): Promise<Either<Failure, AddEnemyResult>>;

  abstract updateOne(
    enemyId: string,
    enemy: UpdateEnemyType
  ): Promise<Either<Failure, UpdateEnemyResult>>;

  abstract deleteOne(enemyId: string): Promise<Either<Failure, boolean>>;
}
