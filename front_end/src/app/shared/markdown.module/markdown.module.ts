/**
 * Created by dispensable on 2016/10/21.
 */
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserModule} from '@angular/platform-browser';

import { CommonModule} from "@angular/common";
import { MarkdownToHtmlPipe } from './index';


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
  ],
  providers: [],
  exports: [
    MarkdownToHtmlPipe,
  ]
})

export class MarkdownModule { }
