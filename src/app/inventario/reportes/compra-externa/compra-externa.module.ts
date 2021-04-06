import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule, MatCardModule, MatCheckboxModule, MatDialogModule, MatIconModule, MatInputModule, MatMenuModule, MatPaginatorModule, MatSelectModule, MatSnackBarModule, MatSortModule, MatTableModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ListModule } from 'app/core/list/list.module';
import { PageHeaderModule } from 'app/core/page-header/page-header.module';
import { BreadcrumbsModule } from 'app/core/breadcrumbs/breadcrumbs.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CompraExternaComponent } from './compra-externa.component';
import { CompraExternaRoutingModule } from './compra-externa.routing.module';
import { CompraExternaDialogComponent } from './compra-externa-dialog/compra-externa-dialog.component';


@NgModule({
  declarations: [CompraExternaComponent,  CompraExternaDialogComponent],
  imports: [
    CommonModule,
    FormsModule,    
    ReactiveFormsModule,
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
    MatCardModule,
    MatSelectModule,
    CompraExternaRoutingModule,    

    // Core
    ListModule,    
    PageHeaderModule,
    BreadcrumbsModule
  ], entryComponents:[
    CompraExternaDialogComponent
  ]
})
export class CompraExternaModule { }
