import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule, MatCheckboxModule, MatDialogModule, MatIconModule, MatInputModule, MatMenuModule, MatPaginatorModule, MatSnackBarModule, MatSortModule, MatTableModule, MatPaginatorIntl, MatSelectModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ListModule } from 'app/core/list/list.module';
import { PageHeaderModule } from 'app/core/page-header/page-header.module';
import { BreadcrumbsModule } from 'app/core/breadcrumbs/breadcrumbs.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TipoInversionComponent } from './tipo-inversion.component';
import { TipoInversionRoutingModule } from './tipo-inversion.routing';
import { CustomPaginator } from 'app/inventario/shared/CustomPaginatorConfiguration';
import { DeleteDialogComponent } from 'app/servicios/common/delete-dialog/delete-dialog.component';
import { TipoInversionEdicionComponent } from './tipo-inversion-edicion/tipo-inversion-edicion.component';
import { DeleteDialogModule } from 'app/servicios/common/delete-dialog/delete-dialog.module';

@NgModule({
  declarations: [TipoInversionComponent, TipoInversionEdicionComponent],
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
    TipoInversionRoutingModule,
    ReactiveFormsModule,        
    MatSelectModule,
    DeleteDialogModule,

    // Core
    ListModule,    
    PageHeaderModule,
    BreadcrumbsModule
  ],entryComponents:[
    TipoInversionEdicionComponent, DeleteDialogComponent
  ]
})
export class TipoInversionModule { } 
