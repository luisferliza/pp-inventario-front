import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule, MatCardModule, MatCheckboxModule, MatDatepickerModule, MatDialogModule, MatIconModule, MatInputModule, MatMenuModule, MatNativeDateModule, MatPaginatorModule, MatSelectModule, MatSnackBarModule, MatSortModule, MatTableModule, MAT_DATE_LOCALE, MatPaginatorIntl, DateAdapter } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { ListModule } from 'app/core/list/list.module';
import { PageHeaderModule } from 'app/core/page-header/page-header.module';
import { BreadcrumbsModule } from 'app/core/breadcrumbs/breadcrumbs.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TasaMaximaComponent } from './tasa-maxima.component';
import { TasaMaximaRoutingModule } from './tasa-maxima.routing';
import { CustomPaginator } from 'app/inventario/shared/CustomPaginatorConfiguration';
import { CustomDateAdapter } from 'app/inventario/shared/CustomDateAdapter';

@NgModule({
  declarations: [TasaMaximaComponent],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'es-GT'},
    {provide: MatPaginatorIntl, useValue: CustomPaginator()} ,
    {provide: DateAdapter, useClass: CustomDateAdapter }
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
    MatCardModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    TasaMaximaRoutingModule,

    // Core
    ListModule,    
    PageHeaderModule,
    BreadcrumbsModule
  ]
})
export class TasaMaximaModule { }
