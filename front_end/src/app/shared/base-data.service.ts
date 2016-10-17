/**
 * Created by dispensable on 2016/10/17.
 */

import { Injectable }     from '@angular/core';
import {Http, Response, BaseResponseOptions} from '@angular/http';
import { Observable }     from 'rxjs/Observable';
import { Headers, RequestOptions, XHRBackend } from '@angular/http';
// import { NotificationService } from "../shared/notification-component/notification.service";
// import { Notification } from '../shared/notification-component/notification';

import '../shared/rxjs-operators';

@Injectable()
export class BaseDataService {

  // private userUrl = 'http://localhost:4200/api/posts?page=1&perpage=10';  // URL to web API

  constructor (private http: Http) {
  }

  getData(apiUrl: string) {
    let token = localStorage.getItem('token');

    if (!token) {
      return;
    }

    let headers = new Headers({'Access-token': token});
    let options = new RequestOptions({ headers: headers });

    return this.http.get(apiUrl, options)
                  .map(this.extractData)
                  .catch(this.handleError);
  }

  private extractData(res: Response) {
    let body = res.json();
    return body;
  }

  private handleError (error: any) {
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    return Observable.throw(errMsg);
  }
}
