import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule, MatCheckboxModule, MatDialogModule, MatIconModule, MatInputModule, MatMenuModule, MatPaginatorIntl, MatPaginatorModule, MatRadioModule, MatSelectModule, MatSnackBarModule, MatSortModule, MatTableModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ListModule } from 'app/core/list/list.module';
import { PageHeaderModule } from 'app/core/page-header/page-header.module';
import { BreadcrumbsModule } from 'app/core/breadcrumbs/breadcrumbs.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { EstadoComponent } from './estado.component';
import { EstadoRoutingModule } from './estado.routing';
import { EstadoEdicionComponent } from './estado-edicion/estado-edicion.component';
import { CustomPaginator } from '../shared/CustomPaginatorConfiguration';


@NgModule({
  declarations: [EstadoComponent, EstadoEdicionComponent],
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
    ReactiveFormsModule,    
    MatRadioModule,
    MatSelectModule,

    // Core
    ListModule,    
    PageHeaderModule,
    BreadcrumbsModule,
    EstadoRoutingModule,
  ], entryComponents:[
    EstadoEdicionComponent
  ],exports:[
    EstadoEdicionComponent
  ]
})
export class EstadoModule { }
