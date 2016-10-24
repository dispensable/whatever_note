/**
 * Created by dispensable on 2016/10/24.
 */
import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from "@angular/platform-browser";
import { BaseDataService } from '../base-data.service';
import { Api } from '../api';
import {sanitizeHtml} from "@angular/platform-browser/src/security/html_sanitizer";

/*
 * Trans @name to <a routerLink="/profile/id">@name</a>
*/
@Pipe({name: 'AtNameTolink'})
export class AtNameToLinkPipe implements PipeTransform {

  constructor(
    private sanitizer: DomSanitizer,
    private dataService: BaseDataService
  ) {}

  resultUrl: string = '';

  transform(value: string) {
    let usernames: string[] = value.match(/@([A-Za-z0-9_]+)\s/g);
    if (!usernames || usernames.length > 12) {return value;}

    // 若存在@name 则替换成相关链接函数
    for (let username of usernames) {
      let purename = username.slice(1, -1);
      if (purename.length > 15) { continue; }

      try {
        this.genUrl(purename);
      } catch (e) {
        continue;
      }

      let link: string = '<a href="' + this.resultUrl + '>' + username + '</a>';
      console.log(link);
      value = value.replace(username, link);
    }
    return this.sanitizer.bypassSecurityTrustHtml(value);
  }


  genUrl(username: string) {
    this.dataService.getData(Api.getUserIdByName(username)).subscribe(
      data => {
        this.resultUrl = `/profile/${data['userid']}`;
      },
      error => { console.log(error); }
    );
  }
}
