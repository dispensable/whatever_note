/**
 * Created by dispensable on 2016/10/17.
 */
import {Component, OnInit} from '@angular/core';
import { BaseDataService} from "../shared/base-data.service";
import { Api } from '../shared/api';
import { Router, ActivatedRoute, Params} from '@angular/router';

class Profile {
  confirmed: boolean;
  email: string;
  id: string;
  role: number;
  username: string;
}

@Component({
  selector: 'user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css', '../shared/bootstrap.css']
})
export class UserProfileComponent implements OnInit{
  constructor(
    // private jwt: JwtHelper,
    private userProfile: BaseDataService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  profile = new Profile;
  error: string;

  ngOnInit() {
    // 从url获取用户id
    this.route.params.forEach((params: Params) => {
      let userid = params['userid'];
      this.userProfile.getData(Api.getUserProfile(userid)).subscribe(
        profile => {
          this.profile = profile;
        },
        error => {
          this.error = error;
          console.log(error);
        }
      );
    });
  }
}
