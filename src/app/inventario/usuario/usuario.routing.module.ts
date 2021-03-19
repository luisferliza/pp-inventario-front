import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { UsuarioComponent } from './usuario.component';


const routes: Routes = [
  {
    path: '',
    component: UsuarioComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsuarioRoutingModule { }
