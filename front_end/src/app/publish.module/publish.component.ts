/**
 * Created by dispensable on 2016/10/17.
 */
import {Component} from '@angular/core';
import { Router} from '@angular/router';

@Component({
  selector: 'publish-root',
  templateUrl: './publish.component.html',
  styleUrls: ['./publish.component.css', '../shared/bootstrap.css'],
})
export class PublishComponent {
  constructor(
    private router: Router,
  ){}

  publishPost() {
    this.router.navigate(['/publish/post']);
  }

  publishImg() {
    this.router.navigate(['/publish/img']);
  }
}
