import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule, MatCheckboxModule, MatDialogModule, MatIconModule, MatInputModule, MatMenuModule, MatPaginatorModule, MatRadioModule, MatSelectModule, MatSnackBarModule, MatSortModule, MatTableModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ListModule } from 'app/core/list/list.module';
import { PageHeaderModule } from 'app/core/page-header/page-header.module';
import { BreadcrumbsModule } from 'app/core/breadcrumbs/breadcrumbs.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FirmanteComponent } from './firmante.component';
import { FirmanteEdicionComponent } from './firmante-edicion/firmante-edicion.component';
import { FirmanteRoutingModule } from './firmante.routing';

@NgModule({
  declarations: [FirmanteComponent, FirmanteEdicionComponent],
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
    FirmanteRoutingModule,    
    ReactiveFormsModule,    
    MatRadioModule,
    MatSelectModule,

    // Core
    ListModule,    
    PageHeaderModule,
    BreadcrumbsModule
  ], entryComponents:[
    FirmanteEdicionComponent
  ]
})
export class FirmanteModule { }
