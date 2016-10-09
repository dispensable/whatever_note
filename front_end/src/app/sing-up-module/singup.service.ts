/**
 * Created by dispensable on 2016/10/8.
 */
import { Injectable }     from '@angular/core';
import { Http, Response } from '@angular/http';
import { User }           from '../shared/user';
import { Observable }     from 'rxjs/Observable';
import { Headers, RequestOptions } from '@angular/http';

import '../shared/rxjs-operators';

@Injectable()
export class SingUpService {
  private userUrl = 'http://localhost:4200/api/user_qualification';  // URL to web API
  constructor (private http: Http) {}

  getUsers (): Observable<User> {
    return this.http.get(this.userUrl)
                    .map(this.extractData)
                    .catch(this.handleError);
  }

  addUser (username: string, email: string, password: string): Observable<User> {
  let body = JSON.stringify({ username, email, password });
  let headers = new Headers({ 'Content-Type': 'application/json' });
  let options = new RequestOptions({ headers: headers });

  return this.http.post(this.userUrl, body, options)
                  .map(this.extractData)
                  .catch(this.handleError);
}

  private extractData(res: Response) {
    let body = res.json();
    return body || { };
  }

  private handleError (error: any) {
    // In a real world app, we might use a remote logging infrastructure
    // We'd also dig deeper into the error to get a better message
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg); // log to console instead
    return Observable.throw(errMsg);
  }
}
