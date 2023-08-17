import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CartfeatureComponent } from './cartfeature.component';

const routes: Routes = [
  {
    path: '',
    component: CartfeatureComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CartfeatureRoutingModule {}
