import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { TasaMaximaComponent } from './tasa-maxima.component';

const routes: Routes = [
  {
    path: '',
    component: TasaMaximaComponent
  } 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TasaMaximaRoutingModule { }