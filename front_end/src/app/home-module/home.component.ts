/**
 * Created by dispensable on 2016/10/9.
 */
import { Component } from '@angular/core';

@Component({
  selector: '<homepage>',
  templateUrl: './home.component.html',
  styleUrls: ['../shared/bootstrap.css']
})
export class HomeComponent {
  title = 'Whatever Note';
  username = 'stranger';
}
