import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule, MatCardModule, MatCheckboxModule, MatDialogModule, MatIconModule, MatInputModule, MatMenuModule, MatPaginatorModule, MatSelectModule, MatSnackBarModule, MatSortModule, MatTableModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { ListModule } from 'app/core/list/list.module';
import { PageHeaderModule } from 'app/core/page-header/page-header.module';
import { BreadcrumbsModule } from 'app/core/breadcrumbs/breadcrumbs.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DonacionesComponent } from './donaciones.component';
import { DonacionesRoutingModule } from './donaciones.routing';
import { DonacionesDialogModule } from './donaciones-dialog/donaciones-dialog.module';

@NgModule({
  declarations: [DonacionesComponent],
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
    MatCardModule,
    MatSelectModule,
    DonacionesRoutingModule,
    DonacionesDialogModule,

    // Core
    ListModule,    
    PageHeaderModule,
    BreadcrumbsModule
  ]
})
export class DonacionesModule { }
