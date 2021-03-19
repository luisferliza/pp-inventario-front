import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { SubastaBienesComponent } from './subasta-bienes.component';

const routes: Routes = [
  {
    path: '',
    component: SubastaBienesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubastaBienesRoutingModule { }
