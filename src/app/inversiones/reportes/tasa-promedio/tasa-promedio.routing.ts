import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { TasaPromedioComponent } from './tasa-promedio.component';

const routes: Routes = [
  {
    path: '',
    component: TasaPromedioComponent
  } 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TasaPromedioRoutingModule { }