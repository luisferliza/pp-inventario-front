import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { DonacionesComponent } from '../donaciones.component';

@Component({
  selector: 'elastic-donaciones-dialog',
  templateUrl: './donaciones-dialog.component.html',
  styleUrls: ['./donaciones-dialog.component.scss']
})
export class DonacionesDialogComponent implements OnInit {

  form: FormGroup;  

  constructor(private dialogRef: MatDialogRef<DonacionesComponent>,
    private fb: FormBuilder) { }

  
    ngOnInit() {        
  
      this.form = this.fb.group({   
        acta: '',
        inicio: '',
        fin: ''
      });
    }  
  
  
    save() {    
      this.dialogRef.close(this.form.value);
    }
  
  

}
