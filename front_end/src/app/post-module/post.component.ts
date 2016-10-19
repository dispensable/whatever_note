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
export class PublishComponent {
  post : Post;
}
