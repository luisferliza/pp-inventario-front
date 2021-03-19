import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule, MatCheckboxModule, MatDialogModule, MatIconModule, MatInputModule, MatRadioModule, MatSelectModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SubastaBienesDialogComponent } from './subasta-bienes-dialog.component';

@NgModule({
  declarations: [
    SubastaBienesDialogComponent
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
    MatCheckboxModule,
    MatIconModule,
    MatRadioModule,
    MatSelectModule
  ], entryComponents:[
    SubastaBienesDialogComponent
  ],exports:[
    SubastaBienesDialogComponent
  ]
})
export class SubastaBienesDialogModule { }
