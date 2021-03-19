import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { ActivosPorUsuarioComponent } from './activos-por-usuario.component';


const routes: Routes = [
  {
    path: '',
    component: ActivosPorUsuarioComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ActivosPorUsuarioRoutingModule { }
