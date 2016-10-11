/**
 * Created by dispensable on 2016/10/10.
 */
import { Component } from '@angular/core';
import { SingInService } from './singin.service';
import { Router } from '@angular/router';
import {NotificationService} from "../shared/notification-component/notification.service";
import { Notification } from '../shared/notification-component/notification';

@Component({
  selector: '<singin>',
  templateUrl: './singin.component.html',
  styleUrls: ['../shared/bootstrap.css']
})

export class SingInComponent {
  constructor(
    private singinService: SingInService,
    private router: Router,
    private notify: NotificationService,
  ){ }

  errorMessage: string;
  notification = new Notification(1, '', 0);

  login(email: string, password: string) {
    this.singinService.getToken(email, password).subscribe(
      // successed
      results => {
        this.notification.type = 0;
        this.notification.content = "Login Successed, turning to homepage...";
        this.notification.timer = 1000;
        this.notify.pushNotification(this.notification);
        setTimeout(() => {this.router.navigate(['/']);}, 500);
      },
      // error
      error => {
        this.errorMessage = <any>error;
        // notify user
        this.notification.content = this.errorMessage;
        this.notification.type = 3;
        this.notification.timer = -1;
        this.notify.pushNotification(this.notification);
      }
    )
  }
}
