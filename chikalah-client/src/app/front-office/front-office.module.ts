import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FrontOfficeRoutingModule } from './front-office-routing.module';
import { FrontOfficeComponent } from './front-office.component';


@NgModule({
  declarations: [
    FrontOfficeComponent
  ],
  imports: [
    CommonModule,
    FrontOfficeRoutingModule
  ]
})
export class FrontOfficeModule { }
