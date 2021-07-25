import { Component, OnInit } from '@angular/core';
import { Anexo4Component } from '../anexo4.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { ReportesInversionesService } from 'app/servicios/inversiones/reportes-inversiones.service';
import { Variable } from 'app/modelos/inventario/reportes/variable';

@Component({
  selector: 'elastic-anexo4-dialog',
  templateUrl: './anexo4-dialog.component.html',
  styleUrls: ['./anexo4-dialog.component.scss']
})
export class Anexo4DialogComponent implements OnInit {

  form: FormGroup;


  constructor(private dialogRef: MatDialogRef<Anexo4Component>,
    private fb: FormBuilder,
    private reporteService: ReportesInversionesService) { }

  pidu;

  ngOnInit() {
    this.pidu = 10; 
    this.form = this.fb.group({
      prestamos_fox: 0,
      prestamos_inmediatos: 0,
      prestamos: 0,
      prima: 0,
      descuentos: 0,
      anexo: 0,
    });
    this.obtenerVariables();
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
    this.actualizarVariables();
    this.dialogRef.close(response);
  }

  actualizarVariables(){
    let variables = [];    
    variables.push({
      id_variable: 1,
      nombre: 'prestamos_fox',
      valor: this.form.value.prestamos_fox
    },{
      id_variable: 2,
      nombre: 'prestamos_inmediatos',
      valor: this.form.value.prestamos_inmediatos
    },{
      id_variable: 3,
      nombre: 'prestamos',
      valor: this.form.value.prestamos
    },{
      id_variable: 4,
      nombre: 'descuentos',
      valor: this.form.value.descuentos
    },{
      id_variable: 5,
      nombre: 'prima',
      valor: this.form.value.prima
    },{
      id_variable: 6,
      nombre: 'anexo',
      valor: this.form.value.anexo
    })
    this.reporteService.modificarVariables(this.pidu, variables).subscribe();
  }

  obtenerVariables() {
    this.reporteService.obtenerVariables(this.pidu).subscribe(data => {
      console.log(data)
      this.validarVariables(data);
    })
  }

  validarVariables(data: Variable[]) {
    data.forEach(element => {
      switch (element.nombre) {
        case 'prestamos_fox':
          this.form.controls['prestamos_fox'].setValue(element.valor);
          break;
        case 'prestamos_inmediatos':
          this.form.controls['prestamos_inmediatos'].setValue(element.valor);
          break;
        case 'prestamos':
          this.form.controls['prestamos'].setValue(element.valor);
          break;
        case 'prima':
          this.form.controls['prima'].setValue(element.valor);
          break;
        case 'descuentos':
          this.form.controls['descuentos'].setValue(element.valor);
          break;
        case 'anexo':
          this.form.controls['anexo'].setValue(element.valor);
          break;
      }

    })
  }

}
