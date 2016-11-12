/**
 * Created by dispensable on 2016/10/17.
 */
import { Component, OnInit } from '@angular/core';
import { BaseDataService } from "../shared/base-data.service";
import { Api } from '../shared/api';
import {ActivatedRoute, Params, Router} from '@angular/router';

import { Post } from '../shared/post';
import { TextHandler } from '../shared/text.handler';
import { MarkdownToHtmlPipe } from "../shared/markdown.module/index";
import { Location } from '@angular/common';
import {isUndefined} from "util";
import {isNullOrUndefined} from "util";

@Component({
  selector: 'post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css', '../shared/bootstrap.css']
})
export class PostComponent implements OnInit{
  post : Post = new Post(
    0, '', 0, 0, '', '', '', 0, ''
  );
  error: Error;
  content: any[][];
  markdown = new MarkdownToHtmlPipe();
  inlinePosition: number[] = [-1, -1];
  comments: Comment[];
  inlineComments: Comment[];
  mentionItems: string[] = [];

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private router: Router,
    private postService: BaseDataService
  ){}

  ngOnInit() {
    this.route.params.forEach((params: Params) => {
      let post_id = params['post_id'];
      this.getComments(post_id);
      this.getPost(post_id);
      this.getMentionlist(post_id);
    });
  }

  comment(paragraphId: number, sentenceId: number) {
    this.inlinePosition = [paragraphId, sentenceId];
  }

  getComments(post_id) {
    this.postService.getData(Api.getPostComments(post_id)).subscribe(
      comments => {
        // TODO: 添加上一页，下一页链接的评论分页功能
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
          this.comments.push(comment);
        }
        this.getSentenceComments(this.inlinePosition[0], this.inlinePosition[1]);
      },
      error => {
        console.log(error);
      });
  }

  cancle() {
    this.inlinePosition = [-1, -1]; // 取消高亮
  }

  onClickId(anhor: number[]) {
    this.inlinePosition = anhor;
  }

  getSentenceComments(pNum: number, sNum: number) {
    let result = [];
    if (isNullOrUndefined(this.comments)) { this.inlineComments = []; return;}
    for (let comment of this.comments) {
      if (comment['p_num'] === pNum && comment['s_num'] === sNum) {
        result.push(comment);
      }
    }
    // TODO: order comments by up/down/hold
    this.inlineComments = result;
  }

  getCurrentUrl() {
    return this.location.path();
  }

  getMentionlist(post_id: string) {
    this.postService.getData(Api.getMentionlistByPostid(post_id)).subscribe(
        mentionlist => {
          this.mentionItems = mentionlist['who_comments'];
        },
        error => {
          this.error = error;
          console.log(error);
        }
      );
  }

  getPost(post_id) {
      this.postService.getData(Api.getPost(post_id)).subscribe(
        post => {
          this.post = post;
          this.content = TextHandler.genShowText(this.markdown.transform(post.content));

          if (!isUndefined(this.comments)) {
            this.content = TextHandler.addComments(this.content, TextHandler.handleComments(this.comments));
          }
        },
        error => {
          this.error = error;
          console.log(error);
        }
      );
  }

  isInlineCommentExist() {
    return !isNullOrUndefined(this.inlineComments) && !(this.inlineComments.length === 0);
  }
}
