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
      prestamos_trabajadores: 0,
      prestamos_hipotecarios: 0,
    });
  }


  save() {
    let response = []
    response.push(
      {
        nombreCategoria: "PRESTAMOS A TRABAJADORES",
        bancos: [
          {
            nombre: "PRESTAMOS A TRABAJADORES",
            monto: this.form.value.prestamos_trabajadores
          }
        ],
        totalCategoria: this.form.value.prestamos_trabajadores
      },
      {
        nombreCategoria: "PRESTAMOS HIPOTECARIOS",
        bancos: [
          {
            nombre: "PRESTAMOS HIPOTECARIOS",
            monto: this.form.value.prestamos_hipotecarios
          }
        ],
        totalCategoria: this.form.value.prestamos_hipotecarios
      },
    )
    
    this.dialogRef.close(response);
  }

}
