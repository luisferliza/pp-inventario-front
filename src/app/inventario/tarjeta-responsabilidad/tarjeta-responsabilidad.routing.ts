import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { TarjetaResponsabilidadComponent } from './tarjeta-responsabilidad.component';


const routes: Routes = [
  {
    path: '',
    component: TarjetaResponsabilidadComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TarjetaResponsabilidadRoutingModule { }
