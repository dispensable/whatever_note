/**
 * Created by dispensable on 2016/10/27.
 */
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { NotificationService } from "../shared/notification-component/notification.service";
import { CommonModule} from "@angular/common";
import { MarkdownModule } from "../shared/markdown.module/markdown.module";
import { WebSocketService } from "../shared/websocket.service";
import { NotificationCenterComponent } from "./notificaiton-center.component";
import { NotificationCenterService } from "./notification-center.service";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { Notification } from "../shared/notification-component/notification";


@NgModule({
  declarations: [
    NotificationCenterComponent
  ],
  imports: [
    HttpModule,
    CommonModule,
    MarkdownModule,
    NgbModule,
    FormsModule
  ],
  providers: [
    NotificationService,
    WebSocketService,
    NotificationCenterService,
    {provide: Notification, useValue: new Notification(localStorage.getItem('userid'), 4, '', 0, new Date().getTime(),
      ['all'], false, localStorage.getItem('token'), localStorage.getItem('username'))}
    ],
  exports: [NotificationCenterComponent]
})
export class NotificationCenterModule { }
