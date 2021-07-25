import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { CommonFunction } from 'app/inventario/shared/common';
import { Inversion } from 'app/modelos/inversiones/inversion';
import { ReportesInversionesService } from 'app/servicios/inversiones/reportes-inversiones.service';
import { ReInversionCreator } from './carta-reinversion';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Firmante } from 'app/modelos/inversiones/firmante';
import { FirmanteService } from 'app/servicios/inversiones/firmante.service';

@Component({
  selector: 'elastic-carta-reinversion-dialog',
  templateUrl: './carta-reinversion-dialog.component.html',
  styleUrls: ['./carta-reinversion-dialog.component.scss']
})
export class CartaReinversionDialogComponent implements OnInit {

  form: FormGroup;  
  pidu = '10';
  administrador: Firmante;
  

  constructor(private dialogRef: MatDialogRef<CartaReinversionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private defaults: Inversion,        
    private fb: FormBuilder,
    private reInvCreator: ReInversionCreator,
    private common: CommonFunction,
    private snackBar: MatSnackBar,
    private reporteService: ReportesInversionesService,
    private firmanteService: FirmanteService) { }


  ngOnInit() {    
    let fechaReinversion = this.common.parseDate(this.defaults.vencimiento)
    fechaReinversion.setDate(fechaReinversion.getDate() + 1); // La reinversion se realiza un dia despues del vencimiento
    let vencimientoReinversion = this.common.parseDate(this.defaults.vencimiento)
    vencimientoReinversion.setDate(vencimientoReinversion.getDate() + this.defaults.plazo)

    this.form = this.fb.group({
      periodo_pago: this.defaults.periodo_pago,
      certificado: this.defaults.certificado,      
      cuenta: this.defaults.cuenta,            
      plazo: this.defaults.plazo,      
      tasa_interes: this.defaults.tasa_interes,
      monto: this.defaults.monto,
      fecha_acta: '',
      acta_japp: '',
      cheque: '',
      grado: this.defaults.banco.titulo_gerente,
      puesto: 'Gerente General',
      apellido: this.defaults.banco.nombre_gerente.split(' ')[1],
      nombre: this.defaults.banco.nombre_gerente.split(' ')[0],
      fecha: new Date(),      
      banco: this.defaults.banco.nombre,      
      dias_interes: 0,  
      interes: 0,        
      fecha_reinversion: fechaReinversion,  
      vencimiento: this.common.parseDate(this.defaults.vencimiento),    
      vencimiento_reinversion: vencimientoReinversion,          
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
    this.reInvCreator.createPDF(
      this.form.value.periodo_pago,
      this.form.value.certificado,
      this.form.value.cuenta,
      this.form.value.plazo,
      this.form.value.tasa_interes,
      this.form.value.monto,
      this.form.value.fecha_acta,
      this.form.value.acta_japp,      
      this.form.value.grado,
      this.form.value.puesto,
      this.form.value.apellido,
      this.form.value.nombre,
      this.form.value.fecha,
      this.form.value.banco,
      this.form.value.dias_interes,
      this.form.value.interes,
      this.form.value.fecha_reinversion,
      this.form.value.vencimiento,
      this.form.value.vencimiento_reinversion,
      this.administrador);
  }

  saveWord() {        
    this.reInvCreator.createWord(
      this.form.value.periodo_pago,
      this.form.value.certificado,
      this.form.value.cuenta,
      this.form.value.plazo,
      this.form.value.tasa_interes,
      this.form.value.monto,
      this.form.value.fecha_acta,
      this.form.value.acta_japp,      
      this.form.value.grado,
      this.form.value.puesto,
      this.form.value.apellido,
      this.form.value.nombre,
      this.form.value.fecha,
      this.form.value.banco,
      this.form.value.dias_interes,
      this.form.value.interes,
      this.form.value.fecha_reinversion,
      this.form.value.vencimiento,
      this.form.value.vencimiento_reinversion,
      this.administrador);
  }

  close() {        
    this.dialogRef.close();
  }

  calcularInteres() {
    this.reporteService.calculoInteres(this.pidu, this.common.parseDate(this.defaults.vencimiento), this.defaults ).subscribe(data =>{
      this.form.controls['dias_interes'].setValue(data.diasInteres);
      this.form.controls['interes'].setValue(data.interes);
    })        
  }

  changeDate() {    
    let futureDate = this.common.parseDate(this.form.value.fecha_reinversion);
    futureDate.setDate(futureDate.getDate() + this.form.value.plazo - 1)        
    this.form.controls['vencimiento_reinversion'].setValue(futureDate);
  }  

}
