import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule, MatDialogModule, MatIconModule, MatInputModule, MatRadioModule, MatSelectModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TipoInversionEdicionComponent } from './tipo-inversion-edicion.component';

@NgModule({
  declarations: [
    TipoInversionEdicionComponent
  ],
  imports: [
    CommonModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MatDialogModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatRadioModule,
    MatSelectModule
  ], entryComponents:[
    TipoInversionEdicionComponent
  ],exports:[
    TipoInversionEdicionComponent
  ]
})
export class TipoInversionEdicionModule { }
