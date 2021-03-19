import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule, MatCheckboxModule, MatDialogModule, MatIconModule, MatInputModule, MatMenuModule, MatPaginatorModule, MatSnackBarModule, MatSortModule, MatTableModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { ListModule } from 'app/core/list/list.module';
import { PageHeaderModule } from 'app/core/page-header/page-header.module';
import { BreadcrumbsModule } from 'app/core/breadcrumbs/breadcrumbs.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ProyeccionComponent } from './proyeccion.component';
import { ProyeccionRoutingModule } from './proyeccion.routing';
import { ProyeccionEdicionModule } from './proyeccion-edicion/proyeccion-edicion.module';

@NgModule({
  declarations: [ProyeccionComponent],
  imports: [
    CommonModule,
    FormsModule,
    FlexLayoutModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatCheckboxModule,
    MatInputModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    MatDialogModule,
    MatSnackBarModule,
    ProyeccionRoutingModule,

    // Core
    ListModule,
    ProyeccionEdicionModule,
    PageHeaderModule,
    BreadcrumbsModule
  ]
})
export class ProyeccionModule { }
