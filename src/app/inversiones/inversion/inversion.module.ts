import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule, MatCheckboxModule, MatDialogModule, MatIconModule, MatInputModule, MatMenuModule, MatPaginatorModule, MatRadioModule, MatSelectModule, MatSnackBarModule, MatSortModule, MatTableModule, MatCardModule, MatDatepickerModule, MatNativeDateModule, MAT_DATE_LOCALE, MatPaginatorIntl, DateAdapter } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ListModule } from 'app/core/list/list.module';
import { PageHeaderModule } from 'app/core/page-header/page-header.module';
import { BreadcrumbsModule } from 'app/core/breadcrumbs/breadcrumbs.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { InversionComponent } from './inversion.component';
import { InversionRoutingModule } from './inversion.routing';
import { InversionEdicionComponent } from './inversion-edicion/inversion-edicion.component';
import { CartaInversionDialogComponent } from './carta-inversion-dialog/carta-inversion-dialog.component';
import { CartaReinversionDialogComponent } from './carta-reinversion-dialog/carta-reinversion-dialog.component';
import { CartaDesinversionDialogComponent } from './carta-desinversion-dialog/carta-desinversion-dialog.component';
import { CartaDesinversionAnticipadaDialogComponent } from './carta-desinversion-anticipada-dialog/carta-desinversion-anticipada-dialog.component';
import { CustomPaginator } from 'app/inventario/shared/CustomPaginatorConfiguration';
import { DeleteDialogComponent } from 'app/servicios/common/delete-dialog/delete-dialog.component';
import { DeleteDialogModule } from 'app/servicios/common/delete-dialog/delete-dialog.module';
import { DesinversionDialogComponent } from './desinversion-dialog/desinversion-dialog.component';
import { CustomDateAdapter } from 'app/inventario/shared/CustomDateAdapter';

@NgModule({
  declarations: [InversionComponent, InversionEdicionComponent, CartaInversionDialogComponent, CartaReinversionDialogComponent, CartaDesinversionDialogComponent, CartaDesinversionAnticipadaDialogComponent, DesinversionDialogComponent],
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
    ReactiveFormsModule,    
    MatRadioModule,
    MatSelectModule,
    InversionRoutingModule,        
    MatCardModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,    
    DeleteDialogModule,

    // Core
    ListModule,    
    PageHeaderModule,
    BreadcrumbsModule
  ], entryComponents:[
    InversionEdicionComponent,
    CartaInversionDialogComponent,
    CartaReinversionDialogComponent, 
    CartaDesinversionDialogComponent,     
    CartaDesinversionAnticipadaDialogComponent,
    DeleteDialogComponent,
    DesinversionDialogComponent
  ]
})
export class InversionModule { }
