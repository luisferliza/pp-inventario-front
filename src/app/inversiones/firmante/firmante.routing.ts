import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { FirmanteComponent } from './firmante.component';


const routes: Routes = [
  {
    path: '',
    component: FirmanteComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FirmanteRoutingModule { }
