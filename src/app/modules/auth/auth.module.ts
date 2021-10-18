import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { AuthRoutingModule } from './auth-routing.module';
import { SharedModule } from '../../shared/shared.module';

import { LoginPageComponent, SessionQuery, SessionStore } from './presentation';
import { AuthRepository, LoginUseCase } from './domain';
import { AuthRepositoryImpl } from './infrastructure';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AuthRoutingModule,
    SharedModule,
  ],
  declarations: [LoginPageComponent],
  providers: [
    // State
    SessionStore,
    SessionQuery,

    // UseCases
    LoginUseCase,

    // Repositories
    {
      provide: AuthRepository,
      useClass: AuthRepositoryImpl,
      deps: [HttpClient],
    },
  ],
})
export class AuthModule {}
