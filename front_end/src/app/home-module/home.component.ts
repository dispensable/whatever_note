/**
 * Created by dispensable on 2016/10/9.
 */
import {Component, OnInit} from '@angular/core';
import { JwtHelper } from 'angular2-jwt';
import {NotificationService} from "../shared/notification-component/notification.service";
import {Notification} from "../shared/notification-component/notification";
import {isUndefined} from "util";
import {HomeTimeLineService} from "./hometimeline.service";
import { Post } from '../shared/post';
import { Api } from '../shared/api';

@Component({
  selector: 'homepage',
  templateUrl: './home.component.html',
  styleUrls: ['../shared/bootstrap.css'],
})
export class HomeComponent implements OnInit{

  constructor(
    private jwtHelper: JwtHelper,
    private notify: NotificationService,
    private timeline: HomeTimeLineService
  ){}

  title = 'Whatever Note';
  username = 'stranger';
  notification = new Notification(2, '', -1);
  posts: Post[] = [];

  next_page : string;
  pre_page : string;

  ngOnInit() {
    if (!localStorage.getItem('token')) {
      console.log('can not find the token.');
      return;
    }

    let token = localStorage.getItem('token');
    let payload = this.jwtHelper.decodeToken(token);
    this.username = localStorage.getItem('username');

    if (!payload.confirmed && !isUndefined(payload.confirmed)) {
      this.notification.content = 'You have not confirm your account, please check your email box.'
      this.notification.type = 2;
      this.notification.timer = -1;
      this.notify.pushNotification(this.notification);
      return;
    }
    let pageUrl = Api.getPosts() + '?page=1&perpage=10';
    this.getPage(pageUrl)
  }

  private getPage(pageUrl: string) {
    this.timeline.getPosts(pageUrl).subscribe(
      posts => {
        // 获取上下一页的链接
        if (this.next_page === "") {}
        this.next_page = posts['next_page'];
        this.pre_page = posts['pre_page'];

        // 删除相关的数据
        delete posts['next_page'];
        delete posts['pre_page'];

        // 遍历posts列表取得post数组
        for (let postNum in posts) {
          this.posts.push(posts[postNum.toString()]);
        }
      },
      error => {
        console.log(error)
      }
    )
  }

  private clearOldPage() {
    if (this.next_page === "") {
      return;
    }
    this.posts = [];
  }
}
