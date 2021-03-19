import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { TipoInversionComponent } from './tipo-inversion.component';

const routes: Routes = [
  {
    path: '',
    component: TipoInversionComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TipoInversionRoutingModule { }
