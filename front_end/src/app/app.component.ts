import { Component } from '@angular/core';
import { AuthService } from './shared/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./shared/bootstrap.css']
})
export class AppComponent {
  constructor(private authService: AuthService, private router: Router) {}
  title = 'Whatever Note';
  userid = localStorage.getItem("userid");

  isLogin () {
    return this.authService.isLoggedIn();
  }

  logOut() {
    this.authService.logOut();
    this.router.navigate(['/singin']);
  }
}
