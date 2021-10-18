import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';

import { SessionStorage } from '../../domain';

@Injectable({
  providedIn: 'root',
})
export class LoggedinGuard implements CanActivate {
  constructor(
    private readonly sessionStorage: SessionStorage,
    private readonly router: Router
  ) {}

  canActivate(_: ActivatedRouteSnapshot, __: RouterStateSnapshot): boolean {
    const token = this.sessionStorage.getToken();

    if (token !== null) {
      this.router.navigateByUrl('/learning');
    }

    return true;
  }
}
