import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { TipoArticuloComponent } from './tipo-articulo.component';

const routes: Routes = [
  {
    path: '',
    component: TipoArticuloComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TipoArticuloRoutingModule { }
