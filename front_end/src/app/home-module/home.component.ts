/**
 * Created by dispensable on 2016/10/9.
 */
import {Component, OnInit, AfterContentInit} from '@angular/core';
import { JwtHelper } from 'angular2-jwt';
import {NotificationService} from "../shared/notification-component/notification.service";
import {Notification} from "../shared/notification-component/notification";
import {isUndefined} from "util";

@Component({
  selector: '<homepage>',
  templateUrl: './home.component.html',
  styleUrls: ['../shared/bootstrap.css']
})
export class HomeComponent implements OnInit{

  constructor(
    private jwtHelper: JwtHelper,
    private notify: NotificationService
  ){}

  title = 'Whatever Note';
  username = 'stranger';
  notification = new Notification(2, '', -1);

  ngOnInit() {
    if (!localStorage.getItem('token')) {
      console.log('can not find the token.');
      return;
    }

    let token = localStorage.getItem('token');
    let payload = this.jwtHelper.decodeToken(token);
    this.username = payload.username;

    if (!payload.confirmed && !isUndefined(payload.confirmed)) {
      this.notification.content = 'You have not confirm your account, please check your email box.'
      this.notification.type = 2;
      this.notification.timer = -1;
      this.notify.pushNotification(this.notification);
    }
  }
}
