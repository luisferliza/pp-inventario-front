import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule, MatCheckboxModule, MatDialogModule, MatIconModule, MatInputModule, MatMenuModule, MatPaginatorModule, MatRadioModule, MatSelectModule, MatSnackBarModule, MatSortModule, MatTableModule, MatPaginatorIntl } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ListModule } from 'app/core/list/list.module';
import { PageHeaderModule } from 'app/core/page-header/page-header.module';
import { BreadcrumbsModule } from 'app/core/breadcrumbs/breadcrumbs.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CuentaComponent } from './cuenta.component';
import { CuentaRoutingModule } from './cuenta.routing';
import { CuentaEdicionComponent } from './cuenta-edicion/cuenta-edicion.component';
import { CustomPaginator } from 'app/inventario/shared/CustomPaginatorConfiguration';
import { DeleteDialogComponent } from 'app/servicios/common/delete-dialog/delete-dialog.component';
import { DeleteDialogModule } from 'app/servicios/common/delete-dialog/delete-dialog.module';

@NgModule({
  declarations: [CuentaComponent, CuentaEdicionComponent],
  providers: [    
    {provide: MatPaginatorIntl, useValue: CustomPaginator()} 
  ],
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
    ReactiveFormsModule,    
    MatRadioModule,
    MatSelectModule,
    DeleteDialogModule,

    // Core
    ListModule,    
    PageHeaderModule,
    BreadcrumbsModule
  ], entryComponents:[
    CuentaEdicionComponent, DeleteDialogComponent
  ]
})
export class CuentaModule { }
