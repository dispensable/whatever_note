/**
 * Created by dispensable on 2016/10/9.
 */
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';

import { SingUpComponent } from './singup.component'
import {SingUpService} from "./singup.service";
import { singupRouting } from "./singup.routing";
import {CommonModule} from "@angular/common";
import { NameUniqueService } from '../shared/name_unique.service';
import { SingInUpGuard } from '../shared/router-guards/singinup-guard.service';

@NgModule({
  declarations: [
    SingUpComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    HttpModule,
    singupRouting
  ],
  providers: [SingUpService, NameUniqueService, SingInUpGuard],
})
export class SingUpModule { }
