import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule, MatCardModule, MatCheckboxModule, MatDialogModule, MatIconModule, MatInputModule, MatMenuModule, MatPaginatorModule, MatSelectModule, MatSnackBarModule, MatSortModule, MatTableModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { ListModule } from 'app/core/list/list.module';
import { PageHeaderModule } from 'app/core/page-header/page-header.module';
import { BreadcrumbsModule } from 'app/core/breadcrumbs/breadcrumbs.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SubastaBienesComponent } from './subasta-bienes.component';
import { SubastaBienesRoutingModule } from './subasta-bienes.routing';
import { SubastaBienesDialogModule } from './subasta-bienes-dialog/subasta-bienes-dialog.module';

@NgModule({
  declarations: [SubastaBienesComponent],
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
    SubastaBienesRoutingModule,
    SubastaBienesDialogModule,

    // Core
    ListModule,    
    PageHeaderModule,
    BreadcrumbsModule
  ]
})
export class SubastaBienesModule { }
