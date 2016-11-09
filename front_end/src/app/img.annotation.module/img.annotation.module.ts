/**
 * Created by dispensable on 2016/11/6.
 */
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { AuthGuard } from '../shared/router-guards/auth-guard.service';
import { NotificationService } from "../shared/notification-component/notification.service";
import { CommonModule} from "@angular/common";
import { MarkdownModule } from "../shared/markdown.module/markdown.module";
import { ImgAnnotationComponent } from "./img.annotation.component";
import { imgAnnotationRouting, imgAnnotationRoutingProviders} from './img.annotation.routing';
import { BaseDataService } from '../shared/base-data.service';
import { CommentsModule } from '../comments-module/comments.module';

@NgModule({
  declarations: [
    ImgAnnotationComponent
  ],
  imports: [
    HttpModule,
    CommonModule,
    MarkdownModule,
    CommentsModule,
    imgAnnotationRouting
  ],
  providers: [AuthGuard, NotificationService, imgAnnotationRoutingProviders, BaseDataService],
})
export class ImgAnnotationModule { }
