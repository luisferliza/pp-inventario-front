import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { CommonFunction } from 'app/inventario/shared/common';
import { Inversion } from 'app/modelos/inversiones/inversion';
import { ReportesInversionesService } from 'app/servicios/inversiones/reportes-inversiones.service';
import { DesinversionCreator } from './carta-desinversion';
import { FirmanteService } from 'app/servicios/inversiones/firmante.service';
import { Firmante } from 'app/modelos/inversiones/firmante';

@Component({
  selector: 'elastic-carta-desinversion-dialog',
  templateUrl: './carta-desinversion-dialog.component.html',
  styleUrls: ['./carta-desinversion-dialog.component.scss']
})
export class CartaDesinversionDialogComponent implements OnInit {

  form: FormGroup;  
  pidu = '10';
  administrador: Firmante;
  

  constructor(private dialogRef: MatDialogRef<CartaDesinversionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private defaults: Inversion,        
    private fb: FormBuilder,
    private desinvCreator: DesinversionCreator,
    private common: CommonFunction,
    private firmanteService: FirmanteService,
    private reporteService: ReportesInversionesService,
    private snackBar: MatSnackBar) { }


  ngOnInit() {    
    this.form = this.fb.group({
      fecha_acta: null,
      acta_japp: '',
      certificado: this.defaults.certificado,
      cuenta: this.defaults.cuenta,
      monto: this.defaults.monto,   
      dias_interes: 0,  
      interes: 0,  
      vencimiento: this.common.parseDate(this.defaults.vencimiento),
      entrega: this.common.parseDate(this.defaults.vencimiento),
      grado: this.defaults.banco.titulo_gerente,
      puesto: 'Gerente General',
      apellido: this.defaults.banco.nombre_gerente.split(' ')[1],
      nombre: this.defaults.banco.nombre_gerente.split(' ')[0],
      fecha: new Date(),
      banco: this.defaults.banco.nombre      
    });
    
    this.calcularInteres();
    this.getFirmante();
  }

  getFirmante() {
    this.firmanteService.obtenerFirmante(this.pidu, this.common.administrador).subscribe(data => {
      if (data.length > 0) {
        this.administrador = data[0];
      } else {
        this.snackBar.open(`${this.common.administrador} No encontrado`, 'AVISO', {
          duration: 2000
        });
        this.administrador = new Firmante();
      }
    });
  }


  savePDF() {        
    this.desinvCreator.createPDF(
      this.form.value.fecha,
      this.form.value.grado,
      this.form.value.nombre,
      this.form.value.apellido,
      this.form.value.puesto,
      this.form.value.banco,
      this.form.value.fecha_acta,
      this.form.value.acta_japp,
      this.form.value.certificado,
      this.form.value.cuenta,
      this.form.value.monto,   
      this.form.value.dias_interes,  
      this.form.value.interes,  
      this.form.value.vencimiento,
      this.form.value.entrega,
      this.administrador
      );        
  }

  saveWord() {       
    this.desinvCreator.createWord(
      this.form.value.fecha,
      this.form.value.grado,
      this.form.value.nombre,
      this.form.value.apellido,
      this.form.value.puesto,
      this.form.value.banco,
      this.form.value.fecha_acta,
      this.form.value.acta_japp,
      this.form.value.certificado,
      this.form.value.cuenta,
      this.form.value.monto,   
      this.form.value.dias_interes,  
      this.form.value.interes,  
      this.form.value.vencimiento,
      this.form.value.entrega,
      this.administrador
    );        
  }  

  calcularInteres() {    
    this.reporteService.calculoInteres(this.pidu, this.common.parseDate(this.defaults.vencimiento), this.defaults ).subscribe(data =>{
      this.form.controls['dias_interes'].setValue(data.diasInteres);
      this.form.controls['interes'].setValue(data.interes);
    })    
  }

  close() {        
    this.dialogRef.close();
  }

}
