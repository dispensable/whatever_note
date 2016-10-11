/**
 * Created by dispensable on 2016/10/11.
 */
import { Injectable }     from '@angular/core';
import { JwtHelper } from 'angular2-jwt';
import {
  CanActivate, Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
}                           from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    let url: string = state.url;

    return this.checkLogin(url);
  }

  checkLogin(url: string): boolean {
    let jwt = new JwtHelper();
    let token = localStorage.getItem('token');

    if (token && !jwt.isTokenExpired(token)) {
      return true;
    }

    // Store the attempted URL for redirecting
    localStorage.setItem('preUrl', url);

    // Navigate to the login page with extras
    this.router.navigate(['/singin']);
    return false;
  }
}
