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
  styleUrls: ['../shared/bootstrap.css'],
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
          console.log('fuck');
          console.log(notifications);
          for (let i in notifications) {
            console.log(i);
            console.log('workding');
            this.notifications.push(notifications[i.toString()]);
            console.log(notifications);
            this.numOfNotifications += 1;
          }
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

}
