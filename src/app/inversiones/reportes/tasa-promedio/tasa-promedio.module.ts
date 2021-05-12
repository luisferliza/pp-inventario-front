import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule, MatCardModule, MatCheckboxModule, MatDatepickerModule, MatDialogModule, MatIconModule, MatInputModule, MatMenuModule, MatNativeDateModule, MatPaginatorModule, MatSelectModule, MatSnackBarModule, MatSortModule, MatTableModule, MAT_DATE_LOCALE } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { ListModule } from 'app/core/list/list.module';
import { PageHeaderModule } from 'app/core/page-header/page-header.module';
import { BreadcrumbsModule } from 'app/core/breadcrumbs/breadcrumbs.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TasaPromedioComponent } from './tasa-promedio.component';
import { TasaPromedioRoutingModule } from './tasa-promedio.routing';

@NgModule({
  declarations: [TasaPromedioComponent],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'es'},
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
