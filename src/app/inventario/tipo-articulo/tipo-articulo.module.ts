import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule, MatCheckboxModule, MatDialogModule, MatIconModule, MatInputModule, MatMenuModule, MatPaginatorIntl, MatPaginatorModule, MatRadioModule, MatSelectModule, MatSnackBarModule, MatSortModule, MatTableModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ListModule } from 'app/core/list/list.module';
import { PageHeaderModule } from 'app/core/page-header/page-header.module';
import { BreadcrumbsModule } from 'app/core/breadcrumbs/breadcrumbs.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TipoArticuloComponent } from './tipo-articulo.component';
import { TipoArticuloRoutingModule } from './tipo-articulo.routing';
import { TipoArticuloEdicionComponent } from './tipo-articulo-edicion/tipo-articulo-edicion.component';
import { CustomPaginator } from '../shared/CustomPaginatorConfiguration';

@NgModule({
  declarations: [TipoArticuloComponent, TipoArticuloEdicionComponent],
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

    // Core
    ListModule,    
    PageHeaderModule,    
    BreadcrumbsModule,
    TipoArticuloRoutingModule
        
  ], entryComponents:[
    TipoArticuloEdicionComponent
  ],exports:[
    TipoArticuloEdicionComponent
  ]
})
export class TipoArticuloModule { }
