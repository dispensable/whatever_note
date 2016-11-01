/**
 * Created by dispensable on 2016/10/27.
 */
import { Component, OnInit, AfterViewChecked, ElementRef, ViewChild} from '@angular/core';
import { NotificationService} from "../shared/notification-component/notification.service";
import { Notification, NotificationType} from "../shared/notification-component/notification";

import { BaseDataService } from '../shared/base-data.service';
import { NotificationCenterService } from "./notification-center.service";
import { Api} from "../shared/api";
import { isArray} from "@angular/core/src/facade/lang";

import { Router} from "@angular/router";
import {isNullOrUndefined} from "util";

@Component({
  selector: 'notify-center',
  templateUrl: 'notification-center.component.html',
  styleUrls: ['../shared/bootstrap.css', './notification.css'],
})
export class NotificationCenterComponent implements OnInit, AfterViewChecked {

  notifications: Notification[] = [];
  numOfNotifications: number = 0;
  showNotifyList: Boolean = false;
  messages: Notification[] = [];

  canSendTo: string[] = ['all'];
  sendTo: string = 'all';

  // 控制聊天消息时间戳的显示
  showTime: boolean = false;
  // 控制聊天内容框的显示
  showChatContent: boolean = false;

  // 聊天用户名与id映射
  idNameMap: {[id: string] : string} = {};

  @ViewChild('scrollMe') private myScrollContainer: ElementRef;

  constructor(
    private ncService: NotificationCenterService,
    private notify: NotificationService,
    private baseData: BaseDataService,
    private notification: Notification,
    private router: Router
  ){
    this.ncService.notification.subscribe(
      notification => {
        if (notification.type <= 3) {
          this.notifications.push(notification);
          this.numOfNotifications += 1;
          this.notify.pushNotification(notification);
        } else {
          this.messages.push(notification);
          if (this.showChatContent === false) {
            this.showChatContent = true;
            setTimeout(() => {this.showChatContent = false}, 15000);
          }
          let userid = localStorage.getItem('userid');
          if (this.notification.info_to[0] === userid && isNullOrUndefined(this.idNameMap[this.notification.info_from])) {
            this.canSendTo.push(userid);
            this.idNameMap[this.notification.info_from] = this.notification.info_from_name;
          }
        }
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
          this.sendHandShakeMsg();
          this.scrollToBottom();
        },
        error => {
          console.log(error);
        }
      );
    }
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom() {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch(err) { }
  }

  showNotifications() {
    this.showNotifyList = !this.showNotifyList;
  }

  sendMessage() {
    this.notification.type = NotificationType.info;
    this.notification.content = 'test the content';
    this.notification.timer = 4000;
    this.ncService.notification.next(this.notification);
  }

  sendHandShakeMsg() {
    this.notification.timer = 0;
    this.notification.date = new Date().getTime();
    this.notification.info_to = [];
    this.notification.type = NotificationType.personalMessage;

    this.notification.info_from = localStorage.getItem('userid');
    this.notification.info_from_name = localStorage.getItem('username');
    this.notification.token = localStorage.getItem('token');

		this.ncService.notification.next(this.notification);
  }

	sendMsg(chatvalue: string) {
    this.notification.content = chatvalue;
    if (this.notification.content.replace('\s', '').length === 0 || this.notification.content.length > 140) { return; }

    this.notification.timer = 0;
    this.notification.date = new Date().getTime();
    this.notification.info_to = [];
    this.notification.info_to.push(this.sendTo);

    if (this.notification.info_to[0] === 'all') {
      this.notification.type = NotificationType.globleMessage;
    } else if (!isArray(this.notification.info_to[0])&& !(this.notification.info_to[0] === 'all')) {
      this.notification.type = NotificationType.personalMessage;
    } else if (isArray(this.notification.info_to[0])) {
      this.notification.type = NotificationType.groupMessage;
    } else {
      throw new Error;
    }

		this.ncService.notification.next(this.notification);
    // 清空消息
    this.notification.content = '';
	}

	// 切换频道
	changeSendTo() {
    this.canSendTo.push(this.canSendTo.shift());
    this.sendTo = this.canSendTo[0];
  }

  // showtime
  showtime() {
    this.showTime = !this.showTime;
  }

  setShowChatContentFalse() {
    setTimeout(()=>{this.showChatContent = false}, 15000);
  }

  goToProfile(userid: string) {
    this.router.navigate(['/profile/' + userid]);
  }

  sendMessageById(userid: string, username: string) {

    // 不存在时添加
    if (isNullOrUndefined(this.idNameMap[userid])) {
      this.idNameMap[userid] = username;
    }

    // 防止重复添加
    for (let i in this.canSendTo) {
      console.log(i);
      if (this.canSendTo[i] === userid) { this.canSendTo.splice(+i, 1); }
    }
    this.canSendTo.unshift(userid);
    this.sendTo = this.canSendTo[0];
  }

  placeholder() {
    if (this.canSendTo[0] === 'all') {
      return `send message to all online people.`
    } else {
      return 'send message to ' + this.idNameMap[this.canSendTo[0]]
    }
  }
}
