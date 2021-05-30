import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule, MatCheckboxModule, MatDialogModule, MatIconModule, MatInputModule, MatMenuModule, MatPaginatorIntl, MatPaginatorModule, MatRadioModule, MatSelectModule, MatSnackBarModule, MatSortModule, MatTableModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ListModule } from 'app/core/list/list.module';
import { PageHeaderModule } from 'app/core/page-header/page-header.module';
import { BreadcrumbsModule } from 'app/core/breadcrumbs/breadcrumbs.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DepartamentoComponent } from './departamento.component';
import { DepartamentoRoutingModule } from './departamento.routing';
import { DepartamentoEdicionComponent } from './departamento-edicion/departamento-edicion.component';
import { CustomPaginator } from '../shared/CustomPaginatorConfiguration';
import { DeleteDialogModule } from 'app/servicios/common/delete-dialog/delete-dialog.module';
import { DeleteDialogComponent } from 'app/servicios/common/delete-dialog/delete-dialog.component';


@NgModule({
  declarations: [DepartamentoComponent, DepartamentoEdicionComponent],
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
    ReactiveFormsModule,    
    MatRadioModule,
    MatSelectModule,
    DeleteDialogModule,
    

    // Core
    ListModule,    
    PageHeaderModule,
    BreadcrumbsModule,
    DepartamentoRoutingModule,
  ], entryComponents:[
    DepartamentoEdicionComponent, DeleteDialogComponent
  ],exports:[
    DepartamentoEdicionComponent
  ]
})
export class DepartamentoModule { }
