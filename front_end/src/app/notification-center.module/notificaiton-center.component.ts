/**
 * Created by dispensable on 2016/10/27.
 */
import {Component, OnInit} from '@angular/core';
import {NotificationService} from "../shared/notification-component/notification.service";
import {Notification} from "../shared/notification-component/notification";

import { BaseDataService } from '../shared/base-data.service';
import { NotificationCenterService } from "./notification-center.service";
import {Api} from "../shared/api";

@Component({
  selector: 'notify-center',
  templateUrl: 'notification-center.component.html',
  styleUrls: ['../shared/bootstrap.css', './notification.css'],
})
export class NotificationCenterComponent implements OnInit{

  notifications: Notification[] = [];
  numOfNotifications: number = 0;
  showNotifyList: Boolean = false;

  constructor(
    private ncService: NotificationCenterService,
    private notify: NotificationService,
    private baseData: BaseDataService,
  ){
    this.ncService.notification.subscribe(
      notification => {
        this.notifications.push(notification);
        this.numOfNotifications += 1;
        this.notify.pushNotification(notification);
      },
      error => { console.log(error); }
    );
  }

  ngOnInit() {
    if (localStorage.getItem('userid')) {
      let userid = localStorage.getItem('userid');
      this.baseData.getData(Api.getPersonalNotifications(userid)).subscribe(
        notifications => {
          for (let i in notifications) {
            this.notifications.push(notifications[i.toString()]);
            this.numOfNotifications += 1;
          }

          let handshakeNotification = new Notification(userid, 0, '', 0, new Date().getTime(), [], false, localStorage.getItem('token'));
          this.ncService.notification.next(handshakeNotification);
        },
        error => {
          console.log(error);
        }
      );
    }
  }

  showNotifications() {
    this.showNotifyList = !this.showNotifyList;
    console.log("why click me so hard ?")
  }

  sendMessage() {
    let userid = localStorage.getItem('userid');
    let handshakeNotification = new Notification(userid, 1, 'test for websocket', 0, new Date().getTime(), [userid], false, localStorage.getItem('token'));
    this.ncService.notification.next(handshakeNotification);
  }

}
