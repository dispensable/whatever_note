/**
 * Created by dispensable on 2016/10/11.
 */
import { Injectable }     from '@angular/core';
import { JwtHelper } from 'angular2-jwt';

@Injectable()
export class AuthService {

  constructor(private jwthelper: JwtHelper) {}

  isLoggedIn () {
    let token = localStorage.getItem('token');
    return token && !this.jwthelper.isTokenExpired(token);
  }

  logOut() {
    localStorage.removeItem('token');
  }
}
