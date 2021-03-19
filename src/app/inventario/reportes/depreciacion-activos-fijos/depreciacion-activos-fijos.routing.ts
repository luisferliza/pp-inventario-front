import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { DepreciacionActivosFijosComponent } from './depreciacion-activos-fijos.component';


const routes: Routes = [
  {
    path: '',
    component: DepreciacionActivosFijosComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DepreciacionActivosFjosRoutingModule { }