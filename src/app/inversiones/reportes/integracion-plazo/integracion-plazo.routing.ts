import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { IntegracionPlazoComponent } from './integracion-plazo.component';

const routes: Routes = [
  {
    path: '',
    component: IntegracionPlazoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IntegracionPlazoRoutingModule { }