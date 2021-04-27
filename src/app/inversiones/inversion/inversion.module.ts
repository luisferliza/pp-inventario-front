import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule, MatCheckboxModule, MatDialogModule, MatIconModule, MatInputModule, MatMenuModule, MatPaginatorModule, MatRadioModule, MatSelectModule, MatSnackBarModule, MatSortModule, MatTableModule } from '@angular/material';
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

@NgModule({
  declarations: [InversionComponent, InversionEdicionComponent, CartaInversionDialogComponent, CartaReinversionDialogComponent, CartaDesinversionDialogComponent, CartaDesinversionAnticipadaDialogComponent],
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

    // Core
    ListModule,    
    PageHeaderModule,
    BreadcrumbsModule
  ], entryComponents:[
    InversionEdicionComponent,
    CartaInversionDialogComponent,
    CartaReinversionDialogComponent, 
    CartaDesinversionDialogComponent,     
    CartaDesinversionAnticipadaDialogComponent
  ]
})
export class InversionModule { }
