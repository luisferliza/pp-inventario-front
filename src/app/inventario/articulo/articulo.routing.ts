import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { ArticuloComponent } from './articulo.component';


const routes: Routes = [
  {
    path: '',
    component: ArticuloComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArticuloRoutingModule { }
