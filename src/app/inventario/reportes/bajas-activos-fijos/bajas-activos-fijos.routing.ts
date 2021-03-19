import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { BajasActivosFijosComponent } from './bajas-activos-fijos.component';

const routes: Routes = [
  {
    path: '',
    component: BajasActivosFijosComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BajasActivosFijosRoutingModule { }
