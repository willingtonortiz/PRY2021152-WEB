import { Either } from 'purify-ts';

import { Failure } from '../../../../core/domain';
import { Enemy } from '../models';

export abstract class EnemiesRepository {
  abstract getAll(): Promise<Either<Failure, Enemy[]>>;

  abstract getAllUnasigned(): Promise<Either<Failure, Enemy[]>>;
}
