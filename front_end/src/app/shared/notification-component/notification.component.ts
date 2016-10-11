/**
 * Created by dispensable on 2016/10/11.
 */
import {Component} from '@angular/core';
import { NotificationService } from './notification.service';
import { Notification } from './notification';

@Component({
  selector: '<notification>',
  templateUrl: './notification.component.html',
  styleUrls: ['../bootstrap.css'],
})

export class NotificationComponent {

  // 控制通知可见性
  isNewExist = false;
  notification = new Notification(1, 'init', 10);

  // 控制关闭按钮是否存在
  closeExist = true;

  // 控制通知的css类
  successClass = false;
  infoClass = false;
  warningClass = false;
  dangerClass = false;

  constructor(private notificationData: NotificationService) {
    this.notificationData.notification$.subscribe(
      notification => {
        this.isNewExist = true;
        this.notification = notification;

        //显示类型 TODO:重写精简逻辑
        if (this.notification.type == 0) {
          this.successClass = true;
          this.infoClass = false;
          this.warningClass = false;
          this.dangerClass = false;
        } else if (this.notification.type == 1) {
          this.infoClass = true;
          this.successClass = false;
          this.warningClass = false;
          this.dangerClass = false;
        } else if (this.notification.type == 2) {
          this.warningClass = true;
          this.successClass = false;
          this.infoClass = false;
          this.dangerClass = false;
        } else if (this.notification.type == 3) {
          this.dangerClass = true;
          this.successClass = false;
          this.infoClass = false;
          this.warningClass = false;
        } else {
          this.infoClass = true;
          this.successClass = false;
          this.warningClass = false;
          this.dangerClass = false;
        }
        //显示时间 -1不会自动消失
        if (this.notification.timer > 0) {
          this.closeExist = false;
          setTimeout(() => this.isNewExist = false, this.notification.timer);
        } else {
          this.closeExist = true;
        }

      },
      error => {
        this.isNewExist = false;
      }
    )
  }

  close() {
    this.isNewExist = false;
  }
}
