/**
 * Created by dispensable on 2016/10/17.
 */
import {Component, OnInit} from '@angular/core';
import { BaseDataService} from "../shared/base-data.service";
import { Api } from '../shared/api';
import { Router, ActivatedRoute, Params} from '@angular/router';

@Component({
  selector: 'publish',
  templateUrl: './publish.component.html',
  styleUrls: ['./publish.component.css', '../shared/bootstrap.css']
})
export class PublishComponent {
  content: string;
  head: string;
  post_by = localStorage.getItem('userid');

  constructor(
    private publishService: BaseDataService,
  ){ }

  clear() {
    this.content = '';
  }

  publish() {
    let post_by = this.post_by;
    let content = this.content;
    let post_head = this.head;

    if (content === "") {
      return;
    }

    let post: string = JSON.stringify({post_by, post_head, content});
    this.publishService.postData(Api.getPosts(), post).subscribe(
      results => {
        console.log("create successed!");
        // content, create_date, last_modify, post_id
        // TODO: 发送给post模块并导航到文件单页
        console.log(results);
        this.content = "";
      },
      error => {
        console.log(error);
      }
    );
  }
}
