import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule, MatCardModule, MatCheckboxModule, MatDatepickerModule, MatDialogModule, MatIconModule, MatInputModule, MatMenuModule, MatNativeDateModule, MatPaginatorModule, MatSelectModule, MatSnackBarModule, MatSortModule, MatTableModule, MAT_DATE_LOCALE, MatPaginatorIntl, DateAdapter } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { ListModule } from 'app/core/list/list.module';
import { PageHeaderModule } from 'app/core/page-header/page-header.module';
import { BreadcrumbsModule } from 'app/core/breadcrumbs/breadcrumbs.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TasaPromedioComponent } from './tasa-promedio.component';
import { TasaPromedioRoutingModule } from './tasa-promedio.routing';
import { CustomPaginator } from 'app/inventario/shared/CustomPaginatorConfiguration';
import { CustomDateAdapter } from 'app/inventario/shared/CustomDateAdapter';

@NgModule({
  declarations: [TasaPromedioComponent],
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
    TasaPromedioRoutingModule,

    // Core
    ListModule,    
    PageHeaderModule,
    BreadcrumbsModule
  ]
})
export class TasaPromedioModule { }
