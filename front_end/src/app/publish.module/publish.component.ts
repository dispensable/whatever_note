/**
 * Created by dispensable on 2016/10/17.
 */
import {Component, OnInit} from '@angular/core';
import { BaseDataService} from "../shared/base-data.service";
import { Api } from '../shared/api';
import { Router} from '@angular/router';
import { TextHandler } from '../shared/text.handler';

@Component({
  selector: 'publish',
  templateUrl: './publish.component.html',
  styleUrls: ['./publish.component.css', '../shared/bootstrap.css'],
})
export class PublishComponent {

  content: string;
  head: string;
  post_by = localStorage.getItem('userid');

  // gen test
  textHandler = new TextHandler();

  test1() {
    this.textHandler.testGen();
    console.log('test complete.')
  }
  // getn test end

  constructor(
    private publishService: BaseDataService,
    private router: Router,
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
        // post_head, content, create_date, last_modify, post_id
        // TODO: 发送给post模块并导航到文件单页
        console.log(results);
        this.content = "";
        this.router.navigate(['/post/', results['post_id']]);
      },
      error => {
        console.log(error);
      }
    );
  }
}
