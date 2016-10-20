import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';

import { CommonModule} from "@angular/common";

import { NotificationService } from '../shared/notification-component/notification.service';
import { AuthGuard } from '../shared/router-guards/auth-guard.service';

import { PublishComponent } from "./publish.component";
import { BaseDataService } from "../shared/base-data.service";

import { publishRouting, publishRoutingProviders } from "./publish.routing";
import { MarkdownToHtmlPipe } from '../shared/markdown-to-html-pipe-master';

@NgModule({
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    HttpModule,
    BrowserModule,
    publishRouting
  ],
  declarations: [
    PublishComponent,
    MarkdownToHtmlPipe,
  ],
  providers: [
    publishRoutingProviders,
    NotificationService,
    AuthGuard,
    BaseDataService],
})

export class PublishModule { }
