import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { BancoComponent } from './banco.component';


const routes: Routes = [
  {
    path: '',
    component: BancoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BancoRoutingModule { }
