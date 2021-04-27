import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { ControlVencimientoComponent } from './control-vencimiento.component';



const routes: Routes = [
  {
    path: '',
    component: ControlVencimientoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ControlVencimientoRoutingModule { }