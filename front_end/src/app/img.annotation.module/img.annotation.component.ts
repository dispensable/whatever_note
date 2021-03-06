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
import {ActivatedRoute, Params, Router} from '@angular/router';
import { Location } from '@angular/common';

class Image {
  constructor(
    private path: string,
    private creater_id: string,
    private creater_name: string,
    private note: string,
    private create_time: number,
    private count_comments: number,
    private img_id: string,
    private header: string
  ) {}
}

@Component({
  selector: 'img-with-comments',
  templateUrl: './img.annotation.component.html',
  styleUrls: ['../shared/bootstrap.css', './img.annotation.component.css'],
})
export class ImgAnnotationComponent implements OnInit{
  constructor(
    private imgCommentService: BaseDataService,
    private _el: ElementRef,
    private renderer: Renderer,
    private activeRouter: ActivatedRoute,
    private router: Router,
    private location: Location,
  ) {}

  comments: Comment[] = [];
  commentX: number = 0;
  commentY: number = 0;
  showSideComment: boolean = false;
  imgHeight: number;
  imgWidth: number;
  imgId: string;
  mentionItems: string[] = [];
  imgElement;
  sidePnum: number = 0;
  sideSnum: number = 0;
  showAllNotes: boolean = false;

  img: Image = new Image('', '', '', '', 0, 0, '', '');

  // 获取图片
  ngOnInit() {
    this.activeRouter.params.forEach((params: Params) => {
      let imgId = params['img_id'];
      this.imgElement = this.renderer.selectRootElement('img');
      this.imgId = imgId;
      this.imgCommentService.getData(Api.getImg(imgId)).subscribe(
        img => {
          this.img = img;
        },
        error => console.log(error)
      );
    })
  }

  addComment(event: any) {
    this.showSideComment = true;
    this.commentX = event.clientX - this.imgElement.offsetLeft;
    this.commentY = event.clientY - this.imgElement.offsetTop;
    this.imgHeight = this.imgElement.clientHeight;
    this.imgWidth = this.imgElement.clientWidth;

    this.hideSideComment();
    this.showAllNotes = !this.showAllNotes;
    this.sideSnum = -1;
  }

  showSideNote(thisComment: Comment, comments: Comment[]) {
    this.comments = [];
    this.showSideComment = false;
    for (let comment of comments) {
      if (comment['p_num'] === thisComment[0] && comment['s_num'] === thisComment[1]) {
        this.comments.push(comment);
      }
    }
    this.sidePnum = this.comments[0]['p_num'];
    this.sideSnum = this.comments[0]['s_num'];
    this.showAllNotes = false;
  }

  setStyles(x: number, y: number) {
    let styles = {
      'position': 'absolute',
      'left': this.getX(x) + 'px',
      'top': this.getY(y) + 'px',
    };
    return styles
  }

  hideSideComment() {
    this.comments = [];
  }

  cancle() {
    this.showSideComment = false;
  }

  private getX(x: number) {
    return this.imgElement.clientWidth * x + this.imgElement.offsetLeft;
  }

  private getY(y: number) {
    return this.imgElement.clientHeight * y + this.imgElement.offsetTop;
  }

  getMentionlist(img_id: string) {
  this.imgCommentService.getData(Api.getMentionlistByPostid(img_id)).subscribe(
      mentionlist => {
        this.mentionItems = mentionlist['who_comments'];
      },
      error => {
        console.log(error);
      }
    );
  }

  getCurrentUrl() {
    return this.location.path();
  }

  isPixelCommentsExist() {
    return !(this.comments.length === 0);
  }

  enableAllNotes() {
    this.showAllNotes = true;
  }

  disableAllNotes() {
    this.showAllNotes = false;
  }
}
