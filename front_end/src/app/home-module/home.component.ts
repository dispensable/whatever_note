/**
 * Created by dispensable on 2016/10/9.
 */
import {Component, OnInit} from '@angular/core';
import { JwtHelper } from 'angular2-jwt';

@Component({
  selector: '<homepage>',
  templateUrl: './home.component.html',
  styleUrls: ['../shared/bootstrap.css']
})
export class HomeComponent implements OnInit{

  constructor(
    private jwtHelper: JwtHelper
  ){}

  title = 'Whatever Note';
  username = 'stranger';

  ngOnInit() {
    if (!localStorage.getItem('token')) {
      console.log('can find token.');
      return;
    }

    let token = localStorage.getItem('token');
    this.username = this.jwtHelper.decodeToken(token).username
  }

}
