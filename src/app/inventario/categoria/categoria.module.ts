import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoriaComponent } from './categoria.component';
import { CategoriaRoutingModule } from './categoria.routing';
import { MatButtonModule, MatCheckboxModule, MatDialogModule, MatIconModule, MatInputModule, MatMenuModule, MatPaginatorIntl, MatPaginatorModule, MatRadioModule, MatSelectModule, MatSnackBarModule, MatSortModule, MatTableModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ListModule } from 'app/core/list/list.module';
import { PageHeaderModule } from 'app/core/page-header/page-header.module';
import { BreadcrumbsModule } from 'app/core/breadcrumbs/breadcrumbs.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CategoriaEdicionComponent } from './categoria-edicion/categoria-edicion.component';
import { CustomPaginator } from '../shared/CustomPaginatorConfiguration';

@NgModule({
  declarations: [CategoriaComponent, CategoriaEdicionComponent],
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
    CategoriaRoutingModule,
  ], entryComponents:[
    CategoriaEdicionComponent
  ],exports:[
    CategoriaEdicionComponent
  ]
})
export class CategoriaModule { }
