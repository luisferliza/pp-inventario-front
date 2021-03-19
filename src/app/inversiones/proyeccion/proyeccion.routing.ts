import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { ProyeccionComponent } from './proyeccion.component';

const routes: Routes = [
  {
    path: '',
    component: ProyeccionComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProyeccionRoutingModule { }
