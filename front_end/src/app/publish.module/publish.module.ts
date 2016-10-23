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
import { MarkdownModule } from '../shared/markdown.module/markdown.module';


@NgModule({
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    HttpModule,
    BrowserModule,
    MarkdownModule,
    publishRouting
  ],
  declarations: [
    PublishComponent,
  ],
  providers: [
    publishRoutingProviders,
    NotificationService,
    AuthGuard,
    BaseDataService],
})

export class PublishModule { }
