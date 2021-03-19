import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule, MatCheckboxModule, MatDialogModule, MatIconModule, MatInputModule, MatMenuModule, MatPaginatorModule, MatSnackBarModule, MatSortModule, MatTableModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { ListModule } from 'app/core/list/list.module';
import { PageHeaderModule } from 'app/core/page-header/page-header.module';
import { BreadcrumbsModule } from 'app/core/breadcrumbs/breadcrumbs.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CuentaComponent } from './cuenta.component';
import { CuentaRoutingModule } from './cuenta.routing';
import { CuentaEdicionModule } from './cuenta-edicion/cuenta-edicion.module';

@NgModule({
  declarations: [CuentaComponent],
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
    CuentaRoutingModule,

    // Core
    ListModule,
    CuentaEdicionModule,
    PageHeaderModule,
    BreadcrumbsModule
  ]
})
export class CuentaModule { }
