/**
 * Created by dispensable on 2016/10/17.
 */
import {Component, OnInit} from '@angular/core';
import { BaseDataService} from "../shared/base-data.service";
import { Api } from '../shared/api';
import { Router, ActivatedRoute, Params} from '@angular/router';

import { Post } from '../shared/post';

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
        },
        error => {
          this.error = error;
          console.log(error);
        }
      );
    });
  }
}
