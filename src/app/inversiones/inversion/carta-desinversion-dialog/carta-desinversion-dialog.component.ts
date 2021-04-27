import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { CommonFunction } from 'app/inventario/shared/common';
import { Inversion } from 'app/modelos/inversiones/inversion';
import { Calculos } from '../calculos/calculos';
import { DesinversionCreator } from './carta-desinversion';

@Component({
  selector: 'elastic-carta-desinversion-dialog',
  templateUrl: './carta-desinversion-dialog.component.html',
  styleUrls: ['./carta-desinversion-dialog.component.scss']
})
export class CartaDesinversionDialogComponent implements OnInit {

  form: FormGroup;  
  pidu = '10';
  

  constructor(private dialogRef: MatDialogRef<CartaDesinversionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private defaults: Inversion,        
    private fb: FormBuilder,
    private desinvCreator: DesinversionCreator,
    private common: CommonFunction,
    private snackBar: MatSnackBar,
    private calculos: Calculos) { }


  ngOnInit() {
    console.log(this.defaults)  
    

    this.form = this.fb.group({
      fecha_acta: this.defaults.fecha_acta.split('T')[0],
      acta_japp: this.defaults.acta_japp,
      referencia: this.defaults.referencia,
      cuenta: this.defaults.cuenta,
      monto: this.defaults.monto,   
      dias_interes: '',  
      interes: '',  
      vencimiento: this.defaults.vencimiento.split('T')[0],
      entrega: this.defaults.vencimiento.split('T')[0],
      grado: this.defaults.banco.titulo_gerente,
      puesto: 'Gerente General',
      apellido: this.defaults.banco.nombre_gerente.split(' ')[1],
      nombre: this.defaults.banco.nombre_gerente.split(' ')[0],
      fecha: new Date().toISOString().split('T')[0],
      banco: this.defaults.banco.nombre,
      fecha_acta_txt: '',
      vencimiento_txt: '',
      entrega_txt: '',
      fecha_txt: ''
    });
    this.calcularInteres();
  }


  savePDF() {    
    this.generarFechas();
    this.desinvCreator.createPDF(this.form, this.common);        
  }

  saveWord() {    
    this.generarFechas();
    this.desinvCreator.createWord(this.form, this.common);        
  }

  generarFechas(){
    console.log(this.form.value.fecha_acta)
    this.form.controls['fecha_acta_txt'].setValue(new Date(this.form.value.fecha_acta).toLocaleDateString('es', { year: 'numeric', month: 'long', day: 'numeric' }));
    this.form.controls['vencimiento_txt'].setValue(new Date(this.form.value.vencimiento).toLocaleDateString('es', { year: 'numeric', month: 'long', day: 'numeric' }));
    this.form.controls['entrega_txt'].setValue(new Date(this.form.value.entrega).toLocaleDateString('es', { year: 'numeric', month: 'long', day: 'numeric' }));
    this.form.controls['fecha_txt'].setValue(new Date(this.form.value.fecha).toLocaleDateString('es', { year: 'numeric', month: 'long', day: 'numeric' }));    
  }

  calcularInteres() {
    this.form.controls['dias_interes'].setValue(this.calculos.calcularDiasInteres(this.defaults, new Date(this.form.value.vencimiento)));
    this.form.controls['interes'].setValue(this.calculos.calcularInteres(this.defaults, new Date(this.form.value.vencimiento)));
  }

  close() {        
    this.dialogRef.close();
  }

}
