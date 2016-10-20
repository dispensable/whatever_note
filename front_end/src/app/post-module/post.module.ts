/**
 * Created by dispensable on 2016/10/17.
 */
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';

import { CommonModule} from "@angular/common";

import { NotificationService } from '../shared/notification-component/notification.service';
import { AuthGuard } from '../shared/router-guards/auth-guard.service';

import { PostComponent } from "./post.component";
import { BaseDataService } from "../shared/base-data.service";

import { postRouting, postRoutingProviders } from "./post.routing";

@NgModule({
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    HttpModule,
    BrowserModule,
    postRouting
  ],
  declarations: [
    PostComponent,
  ],
  providers: [
    postRoutingProviders,
    NotificationService,
    AuthGuard,
    BaseDataService],
})

export class PostModule { }
