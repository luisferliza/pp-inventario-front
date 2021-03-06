import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule, MatCardModule, MatCheckboxModule, MatDialogModule, MatIconModule, MatInputModule, MatMenuModule, MatPaginatorIntl, MatPaginatorModule, MatRadioModule, MatSelectModule, MatSnackBarModule, MatSortModule, MatTableModule, MatTabsModule, MAT_DATE_LOCALE, MatDatepickerModule, MatNativeDateModule, MatAutocompleteModule, DateAdapter } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ListModule } from 'app/core/list/list.module';
import { PageHeaderModule } from 'app/core/page-header/page-header.module';
import { BreadcrumbsModule } from 'app/core/breadcrumbs/breadcrumbs.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TarjetaResponsabilidadComponent } from './tarjeta-responsabilidad.component';
import { TarjetaResponsabilidadRoutingModule } from './tarjeta-responsabilidad.routing';
import { TarjetaResponsabilidadEdicionComponent } from './tarjeta-responsabilidad-edicion/tarjeta-responsabilidad-edicion.component';
import { TrasladoComponent } from './traslado/traslado.component';
import { TrasladoEdicionComponent } from './traslado/traslado-edicion/traslado-edicion.component';
import { CustomPaginator } from '../shared/CustomPaginatorConfiguration';
import { DeleteDialogModule } from 'app/servicios/common/delete-dialog/delete-dialog.module';
import { DeleteDialogComponent } from 'app/servicios/common/delete-dialog/delete-dialog.component';
import { CustomDateAdapter } from '../shared/CustomDateAdapter';


@NgModule({
  declarations: [TarjetaResponsabilidadComponent, TarjetaResponsabilidadEdicionComponent, TrasladoComponent, TrasladoEdicionComponent],
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
    MatTabsModule,    
    ReactiveFormsModule,    
    MatRadioModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,  
    DeleteDialogModule,
    MatAutocompleteModule,

    // Core
    ListModule,    
    PageHeaderModule,
    BreadcrumbsModule,
    TarjetaResponsabilidadRoutingModule
  ], entryComponents:[
    TarjetaResponsabilidadEdicionComponent,
    TrasladoEdicionComponent,
    DeleteDialogComponent
  ],exports:[
    TarjetaResponsabilidadEdicionComponent,
    TrasladoEdicionComponent
  ]
})
export class TarjetaResponsabilidadModule { }
