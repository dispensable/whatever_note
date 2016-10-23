/**
 * Created by dispensable on 2016/10/17.
 */
import {Component, OnInit, Input} from '@angular/core';
import { BaseDataService} from "../shared/base-data.service";
import { Api } from '../shared/api';
import { Router, ActivatedRoute, Params} from '@angular/router';

import { Post } from '../shared/post';
import { TextHandler } from '../shared/text.handler';
import {MarkdownToHtmlPipe} from "../shared/markdown.module/index";

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
  pCommentBoxVisible: boolean[] = [];
  inlinePosition: number[] = [0, 0];
  inlineCommentVisible: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private postService: BaseDataService
  ){}

  ngOnInit() {
      this.route.params.forEach((params: Params) => {
      let post_id = params['post_id'];
      this.postService.getData(Api.getPost(post_id)).subscribe(
        post => {
          this.post = post;
          this.content = TextHandler.genShowText(this.markdown.transform(post.content));
          for (let par in this.content) {
            this.pCommentBoxVisible[par] = false;
          }
          this.content = TextHandler.addComments(this.content, [[0, 0, "this is the 0,0 comment."],
            [3, 2, "this is the 3,2 comment"]]);
        },
        error => {
          this.error = error;
          console.log(error);
        }
      );
    });
  }

  comment(paragraphId: number, sentenceId: number) {
    console.log("i am working...with: " + sentenceId.toString() + 'in' + paragraphId.toString() + 'paragraph.');
    this.inlinePosition = [paragraphId, sentenceId];
    this.pCommentBoxVisible[paragraphId] = !this.pCommentBoxVisible[paragraphId];
  }
}
