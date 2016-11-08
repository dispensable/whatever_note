/**
 * Created by dispensable on 2016/11/6.
 */
import {Component, OnInit, ElementRef, Renderer} from '@angular/core';

import { BaseDataService } from '../shared/base-data.service';
import {NotificationService} from "../shared/notification-component/notification.service";
import {Notification} from "../shared/notification-component/notification";
import {isUndefined} from "util";

import { Post } from '../shared/post';
import { Api } from '../shared/api';
import { Comment } from '../shared/comment';

@Component({
  selector: 'img-with-comments',
  templateUrl: './img.annotation.component.html',
  styleUrls: ['../shared/bootstrap.css', './img.annotation.component.css'],
})
export class ImgAnnotationComponent implements OnInit{
  constructor(
    private imgCommentService: BaseDataService,
    private _el: ElementRef,
    private renderer: Renderer
  ) {}

  comments: Comment[] = [];
  commentX: number = 0;
  commentY: number = 0;
  showSideComment: boolean = false;
  imgHeight: number;
  imgWidth: number;

  // 获取评论添加到评论列表
  ngOnInit() {

  }

  addComment(event: any) {
    this.showSideComment = true;
    let imgElement = this.renderer.selectRootElement('img');
    this.commentX = event.clientX - imgElement.offsetLeft;
    this.commentY = event.clientY - imgElement.offsetTop;
    this.imgHeight = imgElement.clientHeight;
    this.imgWidth = imgElement.clientWidth;
  }

  showSideNote(x: number, y: number) {

  }

  setStyles(x: number, y: number) {

  }

  sendComment(comment: string) {

  }

  cancle() {
    this.showSideComment = false;
  }
}
