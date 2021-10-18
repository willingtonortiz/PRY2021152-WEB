import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanLoad,
  Route,
  Router,
  RouterStateSnapshot,
  UrlSegment,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { SessionStorage } from '../../domain';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate, CanLoad {
  constructor(
    private readonly sessionStorage: SessionStorage,
    private readonly router: Router
  ) {}
  canActivate(_: ActivatedRouteSnapshot, __: RouterStateSnapshot): boolean {
    return this.isAuthenticated();
  }

  canLoad(_: Route, __: UrlSegment[]): boolean {
    const token = this.sessionStorage.getToken();
    return token !== null;
  }

  isAuthenticated(): boolean {
    const token = this.sessionStorage.getToken();

    if (token === null) {
      this.router.navigateByUrl('/auth/login');
      return false;
    }

    return true;
  }
}
