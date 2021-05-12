import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { Anexo4Component } from './anexo4.component';

const routes: Routes = [
  {
    path: '',
    component: Anexo4Component
  } 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Anexo4RoutingModule { }