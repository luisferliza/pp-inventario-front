import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { CommonFunction } from 'app/inventario/shared/common';
import { Inversion } from 'app/modelos/inversiones/inversion';
import { Calculos } from '../calculos/calculos';
import { ReInversionCreator } from './carta-reinversion';

@Component({
  selector: 'elastic-carta-reinversion-dialog',
  templateUrl: './carta-reinversion-dialog.component.html',
  styleUrls: ['./carta-reinversion-dialog.component.scss']
})
export class CartaReinversionDialogComponent implements OnInit {

  form: FormGroup;  
  pidu = '10';
  

  constructor(private dialogRef: MatDialogRef<CartaReinversionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private defaults: Inversion,        
    private fb: FormBuilder,
    private reInvCreator: ReInversionCreator,
    private common: CommonFunction,
    private snackBar: MatSnackBar,
    private calculos: Calculos) { }


  ngOnInit() {    

    this.form = this.fb.group({
      periodo_pago: this.defaults.periodo_pago,
      referencia: this.defaults.referencia,      
      cuenta: this.defaults.cuenta,            
      plazo: this.defaults.plazo,      
      tasa_interes: this.defaults.tasa_interes,
      monto: this.defaults.monto,
      fecha_acta: this.defaults.fecha_acta.split('T')[0],
      acta_japp: this.defaults.acta_japp,
      cheque: '',
      grado: this.defaults.banco.titulo_gerente,
      puesto: 'Gerente General',
      apellido: this.defaults.banco.nombre_gerente.split(' ')[1],
      nombre: this.defaults.banco.nombre_gerente.split(' ')[0],
      fecha: new Date().toISOString().split('T')[0],      
      banco: this.defaults.banco.nombre,      
      dias_interes: '',  
      interes: '',        
      fecha_reinversion: new Date().toISOString().split('T')[0],  
      vencimiento: this.defaults.vencimiento,    
      vencimiento_reinversion: this.defaults.vencimiento,    
      fecha_acta_txt: '',
      vencimiento_txt: this.defaults.vencimiento,      
      fecha_txt: '',
      fecha_reinversion_txt: '',
      vencimiento_reinversion_txt: ''
      });

      this.changeDate();
      this.calcularInteres();
  }

  savePDF() {    
    this.generarFechas()
    let inv :Inversion = this.form.value;
    console.log(inv)
    this.reInvCreator.createPDF(this.form, this.common);        
  }

  saveWord() {    
    this.generarFechas()
    this.reInvCreator.createWord(this.form, this.common);        
  }

  close() {        
    this.dialogRef.close();
  }

  calcularInteres() {
    this.form.controls['dias_interes'].setValue(this.calculos.calcularDiasInteres(this.defaults, new Date(this.form.value.vencimiento)));
    this.form.controls['interes'].setValue(this.calculos.calcularInteres(this.defaults, new Date(this.form.value.vencimiento)));
  }

  generarFechas(){
    console.log(this.form.value.fecha_acta)
    this.form.controls['fecha_acta_txt'].setValue(new Date(this.form.value.fecha_acta).toLocaleDateString('es', { year: 'numeric', month: 'long', day: 'numeric' }));
    this.form.controls['vencimiento_txt'].setValue(new Date(this.form.value.vencimiento).toLocaleDateString('es', { year: 'numeric', month: 'long', day: 'numeric' }));
    this.form.controls['fecha_reinversion_txt'].setValue(new Date(this.form.value.fecha_reinversion).toLocaleDateString('es', { year: 'numeric', month: 'long', day: 'numeric' }));
    this.form.controls['fecha_txt'].setValue(new Date(this.form.value.fecha).toLocaleDateString('es', { year: 'numeric', month: 'long', day: 'numeric' }));    
    this.form.controls['vencimiento_reinversion_txt'].setValue(new Date(this.form.value.vencimiento_reinversion).toLocaleDateString('es', { year: 'numeric', month: 'long', day: 'numeric' }));    
  }

  changeDate() {
    let yourDate = this.form.value.fecha_reinversion
    let period = this.form.value.plazo
    let futureDate = new Date(yourDate);
    futureDate.setDate(futureDate.getDate() + period)        
    this.form.controls['vencimiento_reinversion'].setValue(futureDate.toISOString().split('T')[0]);
  }

  

}
