import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Either, Right } from 'purify-ts';

import { Failure, NoParams, SessionStorage, UseCase } from '..';

@Injectable()
export class LogOutUseCase implements UseCase<boolean, NoParams> {
  constructor(
    private readonly sessionStorage: SessionStorage,
    private readonly router: Router
  ) {}

  async execute(_: NoParams): Promise<Either<Failure, boolean>> {
    this.sessionStorage.removeToken();

    this.router.navigateByUrl('auth');

    return Right(true);
  }
}
