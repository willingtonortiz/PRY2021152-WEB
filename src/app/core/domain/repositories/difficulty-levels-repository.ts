import { Either } from 'purify-ts';

import { DifficultyLevel, Failure } from '../models';

export abstract class DifficultyLevelsRepository {
  abstract getAll(): Promise<Either<Failure, DifficultyLevel[]>>;
}
