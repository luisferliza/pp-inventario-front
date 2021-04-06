import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { CompraExternaComponent } from '../compra-externa.component';



@Component({
  selector: 'elastic-compra-externa-dialog',
  templateUrl: './compra-externa-dialog.component.html',
  styleUrls: ['./compra-externa-dialog.component.scss']
})
export class CompraExternaDialogComponent implements OnInit {

  
  form: FormGroup;

  constructor(private dialogRef: MatDialogRef<CompraExternaComponent>,
    private fb: FormBuilder) { }


  ngOnInit() {

    this.form = this.fb.group({      
      inicio: '',      
    });
  }


  save() {
    this.dialogRef.close(this.form.value);
  }



}
