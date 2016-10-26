/**
 * Created by dispensable on 2016/10/10.
 */
import { Injectable }     from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable }     from 'rxjs/Observable';
import { Headers, RequestOptions } from '@angular/http';
import { NotificationService } from "../shared/notification-component/notification.service";
import { Notification } from '../shared/notification-component/notification';

import '../shared/rxjs-operators';

export class Token {
  constructor(
    private expiration: number,
    private token: string
  ) { }
}

@Injectable()
export class SingInService {
  private userUrl = 'http://localhost:4200/api/token';  // URL to web API
  //notification = new Notification(1, 'some text to show to user for some target', 3000);

  constructor (private http: Http, private notificationData: NotificationService, notification: Notification) {}

  getToken(email: string, password: string): Observable<Token> {
    let body = JSON.stringify({ email, password });
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.post(this.userUrl, body, options)
                  .map(this.extractData)
                  .catch(this.handleError);
  }

  private extractData(res: Response) {
    let body = res.json();
    localStorage.setItem("expiration", body.expiration);
    localStorage.setItem("token", body.token);
    localStorage.setItem("userid", body.userid);
    localStorage.setItem("username", body.username);
    return body;
  }

  private handleError (error: any) {
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    return Observable.throw(errMsg);
  }
}
