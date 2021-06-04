import { Component, OnInit } from '@angular/core';
import { Anexo4Component } from '../anexo4.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'elastic-anexo4-dialog',
  templateUrl: './anexo4-dialog.component.html',
  styleUrls: ['./anexo4-dialog.component.scss']
})
export class Anexo4DialogComponent implements OnInit {

  form: FormGroup;

  constructor(private dialogRef: MatDialogRef<Anexo4Component>,
    private fb: FormBuilder) { }


  ngOnInit() {

    this.form = this.fb.group({
      prestamos_fox: 0,
      prestamos_inmediatos: 0,
      prestamos: 0,
      prima: 0,
      descuentos: 0,
      anexo: 0,
    });
  }


  save() {
    let response = {
      prima: this.form.value.prima,
      descuentos: this.form.value.descuentos,
      anexo: this.form.value.anexo,
      prestamos: {}
    }
    response.prestamos = {
      nombreCategoria: "PRESTAMOS",
      bancos: [
        {
          nombre: "PRESTAMOS (fox)",
          monto: this.form.value.prestamos_fox
        },
        {
          nombre: "PRESTAMOS INMEDIATOS",
          monto: this.form.value.prestamos_inmediatos
        },
        {
          nombre: "PRESTAMOS",
          monto: this.form.value.prestamos
        }
      ],
      totalCategoria: this.form.value.prestamos_fox + this.form.value.prestamos_inmediatos + this.form.value.prestamos
    }
    this.dialogRef.close(response);
  }

}
