import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { AutorizacionInversionComponent } from './autorizacion-inversion.component';


const routes: Routes = [
  {
    path: '',
    component: AutorizacionInversionComponent
  } 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AutorizacionInversionRoutingModule { }