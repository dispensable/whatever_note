/**
 * Created by dispensable on 2016/10/21.
 */
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserModule} from '@angular/platform-browser';

import { CommonModule} from "@angular/common";
import { MarkdownToHtmlPipe } from './index';
import { AtNameToLinkPipe } from './at-name-to-link.pipes';


@NgModule({
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    HttpModule,
    BrowserModule,
  ],
  declarations: [
    MarkdownToHtmlPipe,
    AtNameToLinkPipe,
  ],
  providers: [],
  exports: [
    MarkdownToHtmlPipe,
    AtNameToLinkPipe
  ]
})

export class MarkdownModule { }
