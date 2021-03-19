import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { ResponsableActivosComponent } from './responsable-activos.component';

const routes: Routes = [
  {
    path: '',
    component: ResponsableActivosComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResponsableActivosRoutingModule { }