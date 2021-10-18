import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Either } from 'purify-ts';

import { Failure, SessionStorage, UseCase } from '../../../../core/domain';
import { SessionStore } from '../../presentation/states';
import { User } from '../models';
import { AuthRepository } from '../repositories';

@Injectable()
export class LoginUseCase implements UseCase<string, User> {
  constructor(
    private readonly sessionStorage: SessionStorage,
    private readonly authRepository: AuthRepository,
    private readonly sessionStore: SessionStore,
    private readonly router: Router
  ) {}

  async execute({
    username,
    password,
  }: User): Promise<Either<Failure, string>> {
    this.sessionStore.setLoading(true);

    const either = await this.authRepository.login(username, password);

    this.sessionStore.setLoading(false);

    return either.ifRight((token) => {
      this.sessionStorage.saveToken(token);

      this.router.navigateByUrl('/learning');
    });
  }
}
