import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { VencimientoInversionesComponent } from './vencimiento-inversiones.component';

const routes: Routes = [
  {
    path: '',
    component: VencimientoInversionesComponent
  } 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VencimientoInversionesRoutingModule { }