import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { AutorizacionInversionComponent } from '../autorizacion-inversion.component';

@Component({
  selector: 'elastic-autorizacion-inversion-dialog',
  templateUrl: './autorizacion-inversion-dialog.component.html',
  styleUrls: ['./autorizacion-inversion-dialog.component.scss']
})
export class AutorizacionInversionDialogComponent implements OnInit {

  form: FormGroup;  

  constructor(private dialogRef: MatDialogRef<AutorizacionInversionComponent>,
    private fb: FormBuilder) { }

  
    ngOnInit() {        
  
      this.form = this.fb.group({   
        acta: '',
        sesion: new Date(),        
      });
    }  
  
  
    save() {    
      this.dialogRef.close(this.form.value);
    }

}
