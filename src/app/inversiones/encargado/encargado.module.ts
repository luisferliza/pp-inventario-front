import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule, MatCheckboxModule, MatDialogModule, MatIconModule, MatInputModule, MatMenuModule, MatPaginatorModule, MatSnackBarModule, MatSortModule, MatTableModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { ListModule } from 'app/core/list/list.module';
import { PageHeaderModule } from 'app/core/page-header/page-header.module';
import { BreadcrumbsModule } from 'app/core/breadcrumbs/breadcrumbs.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { EncargadoComponent } from './encargado.component';
import { EncargadoRoutingModule } from './encargado.routing';
import { EncargadoEdicionModule } from './encargado-edicion/encargado-edicion.module';

@NgModule({
  declarations: [EncargadoComponent],
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
    EncargadoRoutingModule,

    // Core
    ListModule,
    EncargadoEdicionModule,
    PageHeaderModule,
    BreadcrumbsModule
  ]
})
export class EncargadoModule { }
