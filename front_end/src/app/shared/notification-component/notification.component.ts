/**
 * Created by dispensable on 2016/10/11.
 */
import {
  Component,
  trigger,
  state,
  style,
  transition,
  animate} from '@angular/core';
import { NotificationService } from './notification.service';
import { Notification } from './notification';

@Component({
  selector: '<notification>',
  templateUrl: './notification.component.html',
  styleUrls: ['../bootstrap.css', './notification.component.css'],
  animations: [
  trigger('flyInOut', [
    state('in', style({opacity: 1, transform: 'translateX(0)'})),
    transition('void => *', [
      style({
        opacity: 0,
        transform: 'translateY(-100%)'
      }),
      animate('0.2s ease-in')
    ]),
    transition('* => void', [
      animate('0.2s 10 ease-in', style({
        opacity: 0,
        transform: 'translateY(-100%)'
      }))
    ])
  ])],
})

export class NotificationComponent {
  // 控制通知可见性
  isNewExist = false;

  // 控制关闭按钮是否存在
  closeExist = true;

  // 控制通知的css类
  successClass = false;
  infoClass = false;
  warningClass = false;
  dangerClass = false;

  notifications: Array<any> = [];

  constructor(private notificationData: NotificationService, private notification: Notification) {
    this.notificationData.notification$.subscribe(
      notification => {
        this.notifications.push(notification);
        this.notifications = this.notifications.sort(this.notifySort);
        if (this.isNewExist === false) {
         this.showNotify();
        }
      },
      error => {
        this.isNewExist = false;
      }
    )
  }

  close() {
    this.isNewExist = false;
    this.isNewExist = false;
    this.showNotify();
  }

  getState() {
    if (this.isNewExist) { return 'in';}
    else { return 'out'; }
  }

  cssHandler() {
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
  }

  timerHandler(): void {
    //显示时间 -1不会自动消失
    if (this.notification.timer > 0) {
      this.closeExist = false;
      setTimeout(() => {this.isNewExist = false; this.showNotify();}, this.notification.timer);
    } else {
      this.closeExist = true;
    }
  }

  showNotify() {
    if (this.notifications.length > 0) {
      this.notification = this.notifications.shift();
      this.cssHandler();
      this.isNewExist = true;
      this.timerHandler();
    }
  }

  notifySort(a: Notification, b: Notification) {
    return a.type - b.type;
  }
}
