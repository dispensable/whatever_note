/**
 * Created by dispensable on 2016/10/11.
 */
import { Injectable }     from '@angular/core';
import {CanActivate}      from '@angular/router';
import { AuthService }    from '../auth.service';

@Injectable()
export class SingInUpGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  canActivate(): boolean {
    return !this.authService.isLoggedIn();
  }
}
