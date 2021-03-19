import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { InventarioActivosFijosComponent } from './inventario-activos-fijos.component';


const routes: Routes = [
  {
    path: '',
    component: InventarioActivosFijosComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InventarioActivosFjosRoutingModule { }
