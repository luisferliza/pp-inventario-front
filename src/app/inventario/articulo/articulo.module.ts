import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule, MatCheckboxModule, MatDialogModule, MatIconModule, MatInputModule, MatMenuModule, MatPaginatorIntl, MatPaginatorModule, MatRadioModule, MatSelectModule, MatSnackBarModule, MatSortModule, MatTableModule, MAT_DATE_LOCALE, MatNativeDateModule, MatDatepickerModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ListModule } from 'app/core/list/list.module';
import { PageHeaderModule } from 'app/core/page-header/page-header.module';
import { BreadcrumbsModule } from 'app/core/breadcrumbs/breadcrumbs.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ArticuloComponent } from './articulo.component';
import { ArticuloRoutingModule } from './articulo.routing';
import { ArticuloEdicionComponent } from './articulo-edicion/articulo-edicion.component';
import { CustomPaginator } from '../shared/CustomPaginatorConfiguration';
import { DeleteDialogComponent } from 'app/servicios/common/delete-dialog/delete-dialog.component';
import { DeleteDialogModule } from 'app/servicios/common/delete-dialog/delete-dialog.module';


@NgModule({
  declarations: [ArticuloComponent, ArticuloEdicionComponent],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'es-GT'},
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
    MatDatepickerModule,
    MatNativeDateModule,    
    DeleteDialogModule,

    // Core
    ListModule,
    ArticuloRoutingModule,
    //ArticuloEdicionModule,
    PageHeaderModule,
    BreadcrumbsModule
  ], entryComponents:[
    ArticuloEdicionComponent, DeleteDialogComponent
  ],exports:[
    ArticuloEdicionComponent
  ]
})
export class ArticuloModule { }
