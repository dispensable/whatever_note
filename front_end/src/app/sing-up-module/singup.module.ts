/**
 * Created by dispensable on 2016/10/9.
 */
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { SingUpComponent } from './singup.component'
import {SingUpService} from "./singup.service";
import { singupRouting } from "./singup.routing";

@NgModule({
  declarations: [
    SingUpComponent,
  ],
  imports: [
    FormsModule,
    HttpModule,
    singupRouting
  ],
  providers: [SingUpService],
})
export class SingUpModule { }
