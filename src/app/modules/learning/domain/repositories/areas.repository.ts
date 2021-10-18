import { List } from 'immutable';
import { Either } from 'purify-ts';

import { Failure } from '../../../../core/domain';
import { Area } from '../models';

export abstract class AreasRepository {
  abstract getAll(): Promise<Either<Failure, Area[]>>;
}
