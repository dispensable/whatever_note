/**
 * Created by dispensable on 2016/10/21.
 */
import {Component, OnInit, Output, EventEmitter, Input} from '@angular/core';
import { Location } from '@angular/common';

import {NotificationService} from "../shared/notification-component/notification.service";
import {Notification} from "../shared/notification-component/notification";

import { Api } from '../shared/api';

import { BaseDataService } from '../shared/base-data.service';
import { Comment } from '../shared/comment';
import {ActivatedRoute, Params, Router} from '@angular/router';

@Component({
  selector: 'comments',
  templateUrl: './comments.component.html',
  styleUrls: ['../shared/bootstrap.css'],
})
export class CommentsComponent implements OnInit{
  constructor(
    private dataService: BaseDataService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
  ){}
  comments: Comment[] = [];
  isVotied: { [id: string]: boolean} = {};
  isRplied: { [id: string]: boolean} = {};
  replyContent: string;
  @Output() onClickId = new EventEmitter<number[]>();
  @Input() mentionList: String[];

  ngOnInit() {
    this.reloadComments();
  }

  clickId(parNum: number, senNum: number) {
    this.onClickId.emit([parNum, senNum]);
  }

  sendComment(comment: string, paragraphNum: number, sentenceNum: number) {
    if (comment === '') {return;}
    this.route.params.forEach((params: Params) => {
      // 构造json
      let post_id = params['post_id'];
      let content = comment;
      let post_by = localStorage.getItem('userid');
      let p_num = paragraphNum; // if p_num < 0; 针对全文发表评论
      let s_num = sentenceNum; // if s_num < 0; 针对全文发表评论 默认评论框后两位参数-1， -1
      // 序列化
      let body = JSON.stringify({content, post_by, post_id, p_num, s_num});
      // 发送评论
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
          // TODO: 添加上一页，下一页链接的评论分页功能
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

  getCurrentUrl(): string {
    return this.location.path()
  }

  goProfile(username: string) {
    this.dataService.getData(Api.getUserIdByName(username)).subscribe(
      data => {
        this.router.navigate([`/profile/${data['userid']}`]);
      },
      error => { console.log(error); }
    );
  }
}
