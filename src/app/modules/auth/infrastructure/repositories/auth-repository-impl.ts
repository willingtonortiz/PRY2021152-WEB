import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Either, Left, Right } from 'purify-ts';
import { environment } from '../../../../../environments/environment';

import { Failure } from '../../../../core/domain';
import { AuthRepository } from '../../domain';

interface LoginErrors {
  errors: string[];
  username: string[];
  password: string[];
}

export class AuthRepositoryImpl implements AuthRepository {
  constructor(private readonly httpClient: HttpClient) {}

  async login(
    username: string,
    password: string
  ): Promise<Either<Failure, string>> {
    try {
      const url = `${environment.baseUrl}/auth/login`;

      const response = await this.httpClient
        .post<{ jsonWebToken: string }>(url, { username, password })
        .toPromise();

      return Right(response.jsonWebToken);
    } catch (exp) {
      if (exp instanceof HttpErrorResponse) {
        const errors: LoginErrors = exp.error.errors;

        return this.mapLoginErrorsToFailure(errors);
      }
      return Left(Failure.from('No se puedo iniciar sesión'));
    }
  }

  mapLoginErrorsToFailure(errors: LoginErrors) {
    if (errors.errors.length > 0) {
      return Left(Failure.from(errors.errors[0]));
    }
    if (errors.username.length > 0) {
      return Left(Failure.from(errors.username[0]));
    }
    if (errors.password.length > 0) {
      return Left(Failure.from(errors.password[0]));
    }

    return Left(Failure.from('No se pudo iniciar sesión'));
  }
}
