import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { InversionesEmitidasComponent } from './inversiones-emitidas.component';

const routes: Routes = [
  {
    path: '',
    component: InversionesEmitidasComponent
  } 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InversionesEmitidasRoutingModule { }