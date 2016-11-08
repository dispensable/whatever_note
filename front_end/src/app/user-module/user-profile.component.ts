/**
 * Created by dispensable on 2016/10/17.
 */
import { Component, OnInit } from '@angular/core';
import { BaseDataService } from "../shared/base-data.service";
import { Api } from '../shared/api';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Post } from "../shared/post";

class Profile {
  confirmed: boolean;
  email: string;
  id: string;
  role: number;
  username: string;
}

interface Follow {
  id: string;
  name: string;
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
  follow: Follow = {id: '', name: ''};
  follows: Follow[] = [];
  fans: Follow[] = [];
  posts: Post[] = [];
  userid: string;
  loginid: string = localStorage.getItem('userid');
  hasFollowed: boolean = false;
  canCheckNotification: boolean = true;
  canCheckComments: boolean = true;

  ngOnInit() {
    // 从url获取用户id
    this.route.params.forEach((params: Params) => {
      let userid = params['userid'];
      this.userid = userid;
      this.userProfile.getData(Api.getUserProfile(userid)).subscribe(
        profile => {
          this.profile = profile;
        },
        error => {
          this.error = error;
          console.log(error);
        }
      );

      // 获取关注列表
      this.userProfile.getData(Api.getFollowlist(userid)).subscribe(
        follow => {
          for (let userid in follow) {
            this.follow.id = userid;
            this.follow.name = follow[userid];
            this.follows.push(this.follow);
          }
        },
        error => {
          console.log(error);
        }
      );

      // 获取粉丝列表
      this.userProfile.getData(Api.getFollowerList(userid)).subscribe(
        fans => {
          for (let userid in fans) {
            this.follow.id = userid;
            this.follow.name = fans[userid];
            this.follows.push(this.follow);
          }
        },
        error => {
          console.log(error);
        }
      );

      // 获取发布的post
      this.userProfile.getData(Api.getUserPostsList(userid)).subscribe(
        posts => {
          for (let index in posts) {
            this.posts.push(posts[index]);
          }
        },
        error => {
          console.log(error);
        }
      );

      // 获取我的评论
      if (this.loginid !== this.userid) { return; }

      // 获取我的通知
      if (this.loginid !== this.userid) { return; }

    });
  }

  addFollow() {
    this.userProfile.postData(Api.addOrRemoveFollow(this.loginid, this.userid), '').subscribe(
      () => { this.hasFollowed = true; },
      error => { console.log(error); this.hasFollowed = true; }  // TODO: 修改错误处理，副作用不应视为错误
    )
  }

  unfollow() {
    this.userProfile.delData(Api.addOrRemoveFollow(this.loginid, this.userid)).subscribe(
      success => { this.hasFollowed = false; },
      error => { console.log(error); this.hasFollowed = false; } // TODO: 修改错误处理函数，不然即使错误也会认为关注成功
    )
  }

  editProfile() {

  }
}
