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
  content: string = '';

  constructor(
    private publishService: BaseDataService,
  ){ }

  clear() {
    this.content = '';
  }

  publish(post_by: string, content: string) {
    let post: string = JSON.stringify({post_by, content});
    this.publishService.postData(Api.getPosts(), post).subscribe(
      results => {},
      error => {}
    );
  }
}
