import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeleteDialogComponent } from './delete-dialog.component';
import { UtilsModule } from 'app/core/utils/utils.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCardModule, MatTabsModule, MatDialogModule, MatButtonModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    UtilsModule,
    FlexLayoutModule,
    MatCardModule,
    MatTabsModule,
    MatDialogModule,
    MatButtonModule
  ],
  entryComponents: [DeleteDialogComponent],
  declarations: [DeleteDialogComponent],
  exports: [DeleteDialogComponent]
})
export class DeleteDialogModule { }
