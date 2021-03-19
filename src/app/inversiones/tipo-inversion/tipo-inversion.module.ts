import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule, MatCheckboxModule, MatDialogModule, MatIconModule, MatInputModule, MatMenuModule, MatPaginatorModule, MatSnackBarModule, MatSortModule, MatTableModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { ListModule } from 'app/core/list/list.module';
import { PageHeaderModule } from 'app/core/page-header/page-header.module';
import { BreadcrumbsModule } from 'app/core/breadcrumbs/breadcrumbs.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TipoInversionComponent } from './tipo-inversion.component';
import { TipoInversionRoutingModule } from './tipo-inversion.routing';
import { TipoInversionEdicionModule } from './tipo-inversion-edicion/tipo-inversion-edicion.module';

@NgModule({
  declarations: [TipoInversionComponent],
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

    // Core
    ListModule,
    TipoInversionEdicionModule,
    PageHeaderModule,
    BreadcrumbsModule
  ]
})
export class TipoInversionModule { }
