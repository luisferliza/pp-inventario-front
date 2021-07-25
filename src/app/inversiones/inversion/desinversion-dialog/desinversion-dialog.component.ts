import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonFunction } from 'app/inventario/shared/common';

@Component({
  selector: 'elastic-desinversion-dialog',
  templateUrl: './desinversion-dialog.component.html',
  styleUrls: ['./desinversion-dialog.component.scss']
})
export class DesinversionDialogComponent implements OnInit {
  
  form: FormGroup;     
  

  constructor(private dialogRef: MatDialogRef<DesinversionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public title: string,    
    private fb: FormBuilder,    
    private common: CommonFunction) { }


  ngOnInit() {            
    this.form = this.fb.group({
      observacion: ''
    });
  }

  save(){
    this.dialogRef.close({observacion: this.form.value.observacion});
  }

}


