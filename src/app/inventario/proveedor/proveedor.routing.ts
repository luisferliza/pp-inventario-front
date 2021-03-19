import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { ProveedorComponent } from './proveedor.component';


const routes: Routes = [
  {
    path: '',
    component: ProveedorComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProveedorRoutingModule { }
