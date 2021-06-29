import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CondicionComponent } from './condicion.component';

const routes: Routes = [
  {
    path: '',
    component: CondicionComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CondicionRoutingModule { }