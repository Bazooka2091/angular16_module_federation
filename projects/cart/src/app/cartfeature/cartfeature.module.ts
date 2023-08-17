import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CartfeatureRoutingModule } from './cartfeature-routing.module';
import { CartfeatureComponent } from './cartfeature.component';


@NgModule({
  declarations: [
    CartfeatureComponent
  ],
  imports: [
    CommonModule,
    CartfeatureRoutingModule
  ]
})
export class CartFeatureModule { }
