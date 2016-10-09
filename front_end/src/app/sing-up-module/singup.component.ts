/**
 * Created by dispensable on 2016/10/8.
 */
import {Component, OnInit} from '@angular/core';
import { User }    from '../shared/user';
import { SingUpService } from './singup.service';

@Component({
  selector: 'singup',
  templateUrl: './singup.component.html',
  styleUrls: ['../shared/bootstrap.css', '../shared/form.css']
})
export class SingUpComponent implements OnInit{

  user: User;
  errorMessage: string;

  constructor(private usersevice: SingUpService) { }

  ngOnInit() { this.getUser(); }

  getUser() {
    this.usersevice.getUsers().subscribe(
      user => { this.user = user; console.log("user is: "); console.log(user.name)},
      error => this.errorMessage = <any>error);
  }

  addUser(name: string, email: string, password: string) {
    if (!name || !email || !password ) { return; }
    this.usersevice.addUser(name, email, password).subscribe(
      newuser => this.user = newuser,
      error => this.errorMessage = <any>error);
  }
}
