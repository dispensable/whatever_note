/**
 * Created by dispensable on 2016/10/8.
 */
import {Component, OnInit} from '@angular/core';
import { User }    from '../shared/user';
import { RegisterError } from '../shared/register_error'
import { SingUpService } from './singup.service';
import { Router } from '@angular/router';
import { NameEmailUniqueService } from "../shared/name_email_isunique.service";
import { IsUnique } from '../shared/name_email_isunique.service';
import { Observable }        from 'rxjs/Observable';
import '../shared/rxjs-operators'

import {NotificationService} from "../shared/notification-component/notification.service";
import { Notification } from '../shared/notification-component/notification';

@Component({
  selector: 'singup',
  templateUrl: './singup.component.html',
  styleUrls: ['../shared/bootstrap.css', '../shared/form.css'],
})
export class SingUpComponent {
  errorMessage: string;

  // notification obj
  // notification = new Notification('', 1, '', 0);

  user: User = new User('', '', '', '');
  name: Observable<IsUnique[]>;
  registerError: RegisterError = new RegisterError('Username required', 'Email required',
    'Password required!', 'Repeat the password!');
  submitted: boolean = true;
  successed: boolean = false;
  hasresend = false;

  // form verification css control
  username_valid: boolean = false;
  email_valid: boolean = false;
  password_valid: boolean = false;
  password2_valid: boolean = false;

  constructor(private usersevice: SingUpService,
              private isNameEmailUnique: NameEmailUniqueService,
              private notify: NotificationService,
              private router: Router,
              private notification: Notification,
  ) { }

  // form verification logic
  verification_name_unique() {
    this.isNameEmailUnique.search(this.user.username, 'name').subscribe(name => {
      if (!name.nameUnique) {
        this.username_valid = false;
        this.registerError.username_error = 'The name has been used try another one. '
      }
    }, error => {}); //TODO: replace real error handler.
  }

  verification_username() {
    let username = this.user.username;
    if (username.length > 20) {
      this.username_valid = false;
      this.registerError.username_error = 'Name is too long, please keep the username less than 10 characters.';
    } else if (username.search('^[A-Za-z][A-Za-z0-9_.]*$')) {
      this.username_valid = false;
      this.registerError.username_error = 'The username character must in A-z or 0 -9 or _ .';
    } else {
      this.username_valid = true;
      this.registerError.username_error = 'Nice name!'
    }
  }

  verification_email() {
    let email = this.user.email;
    if (email.search('^([\\w-_]+(?:\\.[\\w-_]+)*)@((?:[a-z0-9]+(?:-[a-zA-Z0-9]+)*)+\\.[a-z]{2,6})$')) {
      this.email_valid = false;
      this.registerError.email_error = 'Email address wrong, please recheck and modify.';
    } else {
      this.email_valid = true;
      this.registerError.email_error = 'Email address input right.';
    }
  }

  verification_email_unique() {
    this.isNameEmailUnique.search(this.user.email, 'email').subscribe(email => {
      if (!email.emailUnique) {
        this.email_valid = false;
        this.registerError.email_error = 'This email has been registed, choose another one. '
      }
    }, error => {}); //TODO: replace real error handler.
  }

  verification_password() {
    let password = this.user.password;

    // check password length
    if (password.length < 8) {
      this.password_valid = false;
      this.registerError.password_error = 'password too short, at least 8 characters.';
    } else if (password.length > 16) {
      this.password_valid = false;
      this.registerError.password_error = 'password too long, less than 16 characters.';
    } else if (password.search('^(?![0-9]+$)(?![a-zA-Z]+$)')) {     // weak password not allowed
      this.password_valid = false;
      this.registerError.password_error = 'Pure number, alphebeta is not allowed.';
    } else if (password.search('^(?![a-zA-z]+$)(?![0-9]+$)(?![!@#$%^&*]+$)[a-zA-Z[0-9]!@#$%^&*]+$')) { // not bad
      this.password_valid = true;
      this.registerError.password_error = 'Not bad, but you can do more.';
    } else if (password.search('^(?![a-zA-z]+$)(?![0-9]+$)(?![!@#$%^&*]+$)(?![a-zA-z[0-9]]+$)(?![a-zA-z!@#$%^&*]+$)(?![[0-9]!@#$%^&*]+$)[a-zA-Z[0-9]!@#$%^&*]+$')) {
      this.password_valid = true; // best
      this.registerError.password_error = 'Very good password!'
    }
  }

  verification_password2() {
    // check repeat password
    if (this.user.password === this.user.password2) {
      this.password2_valid = true;
      this.registerError.repeat_error = 'Same as password! Good job!'
    } else {
      this.password2_valid = false;
      this.registerError.repeat_error = 'Not the same as you input first time.'
    }
  }

  addUser(user) {
    this.usersevice.addUser(user.username, user.email, user.password).subscribe(
      newuser => { this.user = newuser;
        console.log("response from remote server: ");
        console.log(newuser);
        this.submitted = false;
        this.successed = true;
        // setTimeout(() => this.router.navigate(['/singin']), 5000);
      },
      error => { this.errorMessage = <any>error;
      });
  }

  resend() {
    this.usersevice.resendConfirm(this.user.username, this.user.email).subscribe(
      () => {
        this.hasresend = true;
        setTimeout(this.hasresend = false, 60000);
        this.notification.from = "System";
        this.notification.content = 'The confirmation has been resent, please check your email inbox or trashbox.';
        this.notification.type = 1;
        this.notification.timer = -1;
        this.notify.pushNotification(this.notification);
      },
      error => { this.errorMessage = <any>error;
        // notify user
        this.notification.from = "System";
        this.notification.content = this.errorMessage;
        this.notification.type = 3;
        this.notification.timer = -1;
        this.notify.pushNotification(this.notification);}
    )
  }

  noteme() {
    // this.notification.from = "System";
    // this.notification.content = 'this is the notify! **bload**';
    // this.notification.type = 3;
    // this.notification.timer = 3000;
    // this.notify.pushNotification(this.notification);
    let notify = new Notification('System', 1, 'green 5s', 5000, new Date().getTime());
    this.notify.pushNotification(notify);
    let fuck = new Notification('me', 2, 'pink 4s', 4000, new Date().getTime());
    this.notify.pushNotification(fuck);
    this.notify.pushNotification(new Notification('test:::', 3, 'red 5s to close', -1, new Date().getTime()));
    this.notify.pushNotification(new Notification('test', 3, 'red 5s', 5000, new Date().getTime()));
  }

  singin() {
    this.router.navigate(['/singin']);
  }
}
