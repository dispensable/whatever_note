/**
 * Created by dispensable on 2016/10/11.
 */
import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs/Subject';
import { Notification } from './notification';

@Injectable()
export class NotificationService {

  // Observable string sources
  private notificationSource = new Subject<Notification>();

  // Observable string streams
  notification$ = this.notificationSource.asObservable();

  // Service message commands
  pushNotification(notification: Notification) {
    this.notificationSource.next(notification);
  }
}
