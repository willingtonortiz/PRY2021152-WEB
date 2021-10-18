import { Either } from 'purify-ts';
import { Failure } from './failure';

export interface UseCase<Result, Params> {
  execute(params: Params): Promise<Either<Failure, Result>>;
}

export class NoParams {}
