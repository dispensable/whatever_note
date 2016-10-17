import { Component } from '@angular/core';
import { AuthService } from './shared/auth.service';
import { Router } from '@angular/router';
import { JwtHelper } from 'angular2-jwt';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./shared/bootstrap.css']
})
export class AppComponent {
  constructor(private authService: AuthService, private router: Router) {}
  title = 'Whatever Note';
  jwt = new JwtHelper();
  userid = this.jwt.decodeToken(localStorage.getItem('token'))['userid'];

  isLogin () {
    return this.authService.isLoggedIn();
  }

  logOut() {
    this.authService.logOut();
    this.router.navigate(['/singin']);
  }
}
