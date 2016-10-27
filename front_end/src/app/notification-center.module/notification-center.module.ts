/**
 * Created by dispensable on 2016/10/27.
 */
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { NotificationService } from "../shared/notification-component/notification.service";
import { CommonModule} from "@angular/common";
import { MarkdownModule } from "../shared/markdown.module/markdown.module";
import { WebSocketService } from "../chat.module/websocket.service";
import { NotificationCenterComponent } from "./notificaiton-center.component";
import { NotificationCenterService } from "./notification-center.service";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [
    NotificationCenterComponent,
  ],
  imports: [
    HttpModule,
    CommonModule,
    MarkdownModule,
    NgbModule
  ],
  providers: [
    NotificationService,
    WebSocketService,
    NotificationCenterService
    ],
  exports: [NotificationCenterComponent]
})
export class NotificationCenterModule { }
