/**
 * Created by dispensable on 2016/10/10.
 */
import { Injectable }     from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';

export class IsUnique {
  nameUnique: boolean;
  emailUnique: boolean;
}

@Injectable()
export class NameEmailUniqueService {
  constructor(private http: Http) {}

  search(term: string, item: string): Observable<IsUnique> {
    return this.http
               .get(`http://localhost:4200/api/${item}?${item}=${term}`)
               .map(this.extractData).catch(this.handleError);
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
