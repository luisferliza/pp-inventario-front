import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { SubastaBienesComponent } from '../subasta-bienes.component';

@Component({
  selector: 'elastic-subasta-bienes-dialog',
  templateUrl: './subasta-bienes-dialog.component.html',
  styleUrls: ['./subasta-bienes-dialog.component.scss']
})
export class SubastaBienesDialogComponent implements OnInit {

  form: FormGroup;

  constructor(private dialogRef: MatDialogRef<SubastaBienesComponent>,
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
