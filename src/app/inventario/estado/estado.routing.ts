import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { EstadoComponent } from './estado.component';

const routes: Routes = [
  {
    path: '',
    component: EstadoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EstadoRoutingModule { }
