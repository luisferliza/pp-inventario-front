import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { CompraExternaComponent } from './compra-externa.component';


const routes: Routes = [
  {
    path: '',
    component: CompraExternaComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompraExternaRoutingModule { }
