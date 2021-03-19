import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { DepartamentoComponent } from './departamento.component';

const routes: Routes = [
  {
    path: '',
    component: DepartamentoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DepartamentoRoutingModule { }
