/**
 * Created by dispensable on 2016/10/21.
 */
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { CommentsComponent } from './comments.component';

import { NotificationService } from "../shared/notification-component/notification.service";

import { CommonModule} from "@angular/common";
import { MarkdownModule } from "../shared/markdown.module/markdown.module";
import { BaseDataService } from '../shared/base-data.service';
import {RouterModule} from "@angular/router";
import {FormsModule} from "@angular/forms";


@NgModule({
  declarations: [
    CommentsComponent,
  ],
  imports: [
    HttpModule,
    CommonModule,
    MarkdownModule,
    RouterModule,
    FormsModule,
  ],
  providers: [ NotificationService, BaseDataService],
  exports: [CommentsComponent]
})
export class CommentsModule { }
