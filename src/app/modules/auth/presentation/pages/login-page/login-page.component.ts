import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

import { SessionQuery } from '../..';
import { LoginUseCase } from '../../../domain';

const MIN_USERNAME_LENGTH = 3;
const MAX_USERNAME_LENGTH = 20;
const USERNAME_PATTERN = /^[a-zA-Z0-9]+$/;

const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 32;

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
})
export class LoginPageComponent {
  MIN_USERNAME_LENGTH = MIN_USERNAME_LENGTH;
  MAX_USERNAME_LENGTH = MAX_USERNAME_LENGTH;
  MIN_PASSWORD_LENGTH = MIN_PASSWORD_LENGTH;
  MAX_PASSWORD_LENGTH = MAX_PASSWORD_LENGTH;

  formGroup: FormGroup = this.formBuilder.group({});
  showPassword = false;
  isLoading$ = this.sessionQuery.selectLoading();

  constructor(
    private readonly snackBar: MatSnackBar,
    private readonly formBuilder: FormBuilder,
    private readonly sessionQuery: SessionQuery,
    private readonly loginUseCase: LoginUseCase
  ) {
    this.initializeForm();
  }

  private initializeForm() {
    this.formGroup = this.formBuilder.group({
      username: [
        null,
        [
          Validators.required,
          Validators.minLength(MIN_USERNAME_LENGTH),
          Validators.maxLength(MAX_USERNAME_LENGTH),
          Validators.pattern(USERNAME_PATTERN),
        ],
      ],
      password: [
        null,
        [
          Validators.required,
          Validators.minLength(MIN_PASSWORD_LENGTH),
          Validators.maxLength(MAX_PASSWORD_LENGTH),
        ],
      ],
    });
  }

  async onSubmit(): Promise<void> {
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      return;
    }

    (
      await this.loginUseCase.execute({
        username: this.fusername.value,
        password: this.fpassword.value,
      })
    ).caseOf({
      Left: (failure) => this.showSnackBar(failure.message),
      Right: () => {},
    });
  }

  showSnackBar(message: string) {
    this.snackBar.open(message, '', { duration: 4000 });
  }

  get fusername(): AbstractControl {
    return this.formGroup.get('username') as AbstractControl;
  }

  get fpassword(): AbstractControl {
    return this.formGroup.get('password') as AbstractControl;
  }
}
