import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { PlazoComponent } from './plazo.component';


const routes: Routes = [
  {
    path: '',
    component: PlazoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlazoRoutingModule { }
