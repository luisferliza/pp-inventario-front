import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { InversionesVencenComponent } from './inversiones-vencen.component';

const routes: Routes = [
  {
    path: '',
    component: InversionesVencenComponent
  } 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InversionesVencenRoutingModule { }