import { Either } from 'purify-ts';

import { Failure } from '../../../../core/domain';

export abstract class AuthRepository {
  abstract login(
    username: string,
    password: string
  ): Promise<Either<Failure, string>>;
}
