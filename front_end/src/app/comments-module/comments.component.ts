/**
 * Created by dispensable on 2016/10/21.
 */
import {Component, OnInit} from '@angular/core';

import {NotificationService} from "../shared/notification-component/notification.service";
import {Notification} from "../shared/notification-component/notification";

import { Api } from '../shared/api';

import { BaseDataService } from '../shared/base-data.service';
import { Comment } from '../shared/comment';
import { ActivatedRoute, Params, RouterLink } from '@angular/router'

@Component({
  selector: 'comments',
  templateUrl: './comments.component.html',
  styleUrls: ['../shared/bootstrap.css'],
})
export class CommentsComponent implements OnInit{
  constructor(
    private dataService: BaseDataService,
    private route: ActivatedRoute,
  ){}
  comments: Comment[] = [];
  isVotied: { [id: string]: boolean} = {};
  isRplied: { [id: string]: boolean} = {};
  replyContent: string;

  ngOnInit() {
    this.reloadComments();
  }

  sendComment(comment: string) {
    this.route.params.forEach((params: Params) => {
      let post_id = params['post_id'];
      let content = comment;
      let post_by = localStorage.getItem('userid');
      let body = JSON.stringify({content, post_by, post_id});
      this.dataService.postData(Api.getPostComments(post_id), body).subscribe(
        () => {
          this.reloadComments();
        },
        error => {
          this.reloadComments();
          console.log(error);
        });
      }
    );
  }

  deleteComment(comment_id: string) {
    // 远程服务器删除
    this.route.params.forEach((params: Params) => {
      let post_id = params['post_id'];
      this.dataService.delData(Api.getComment(post_id, comment_id)).subscribe(
        () => {
          this.comments.splice(+this.getCommentNumById(comment_id));
          this.reloadComments();
         },
        error => {
          this.comments.splice(+this.getCommentNumById(comment_id));
          // this.reloadComments();
          console.log(error);
        });
      }
    );
  }

  private voteComment(comment_id: string, point: number) {
    this.route.params.forEach((params: Params) => {
      let post_id = params['post_id'];
      let body = JSON.stringify({point});
      this.dataService.putData(Api.getComment(post_id, comment_id), body).subscribe(
        () => {
          let commentToVote = this.comments[this.getCommentNumById(comment_id)];
          if (point === 1) {
            commentToVote.up += 1;
          } else if (point === -1) {
            commentToVote.down += 1;
          } else if (point === 0) {
            commentToVote.hold += 1;
          }

        },
        error => {
          console.log(error);
          let commentToVote = this.comments[this.getCommentNumById(comment_id)];
          if (point === 1) {
            commentToVote.up += 1;
          } else if (point === -1) {
            commentToVote.down += 1;
          } else if (point === 0) {
            commentToVote.hold += 1;
          }
        });
      }
    );
  }

  private getCommentNumById(commentId: string) {
    for (let commentNum in this.comments) {
      if (this.comments[commentNum]["comment_id"] === commentId) {
        console.log(commentNum);
        return commentNum;
      }
    }
  }

  reloadComments() {
    this.route.params.forEach((params: Params) => {
      let post_id = params['post_id'];
      this.dataService.getData(Api.getPostComments(post_id)).subscribe(
        comments => {
          // // 获取上下一页的链接
          // if (this.next_page === "") {}
          // this.next_page = posts['next_page'];
          // this.pre_page = posts['pre_page'];
          //
          // // 删除相关的数据
          // delete posts['next_page'];
          // delete posts['pre_page'];
          this.comments = [];
          // 遍历comments列表取得comment数组
          for (let commentNum in comments) {
            let comment = comments[commentNum.toString()];

            if (!this.isVotied[comment.comment_id]) {
              this.isVotied[comment.comment_id] = false;
            }
            this.isRplied[comment.comment_id] = false;
            this.comments.push(comment);
          }
        },
        error => {
          console.log(error);
        });
      }
    );
  }

  vote(commentId: string, point: number) {
    if (this.isVotied[commentId]) { return; }
    this.voteComment(commentId, point);
    this.isVotied[commentId] = true;
  }

  reply(commentId: string) {
    console.log(commentId);
    this.isRplied[commentId] = !this.isRplied[commentId];
  }
}
