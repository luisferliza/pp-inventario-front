import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { Inversion } from 'app/modelos/inversiones/inversion';
import { InversionCreator } from './carta-inversion';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { CommonFunction } from 'app/inventario/shared/common';
import { FirmanteService } from 'app/servicios/inversiones/firmante.service';
import { Firmante } from 'app/modelos/inversiones/firmante';
pdfMake.vfs = pdfFonts.pdfMake.vfs;


@Component({
  selector: 'elastic-carta-inversion-dialog',
  templateUrl: './carta-inversion-dialog.component.html', 
  styleUrls: ['./carta-inversion-dialog.component.scss']
})
export class CartaInversionDialogComponent implements OnInit {

  form: FormGroup;  
  pidu = '10';
  administrador: Firmante; 
  

  constructor(private dialogRef: MatDialogRef<CartaInversionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private defaults: Inversion,        
    private fb: FormBuilder,
    private invCreator: InversionCreator,
    private common: CommonFunction,
    private snackBar: MatSnackBar,
    private firmanteService: FirmanteService) { }


  ngOnInit() {    
    this.form = this.fb.group({
      periodo_pago: this.defaults.periodo_pago,
      cuenta: '',      
      tipo_Inversion: this.defaults.tipo_Inversion.nombre,
      vencimiento: this.common.parseDate(this.defaults.vencimiento),
      plazo: this.defaults.plazo,
      fecha_colocacion: this.common.parseDate(this.defaults.fecha_colocacion),
      tasa_interes: this.defaults.tasa_interes,
      monto: this.defaults.monto,
      fecha_acta: this.common.parseDate(this.defaults.fecha_acta),
      acta_japp: this.defaults.acta_japp,
      cheque: '',
      grado: this.defaults.banco.titulo_gerente,
      puesto: 'Gerente General',
      apellido: this.defaults.banco.nombre_gerente.split(' ')[1],
      nombre: this.defaults.banco.nombre_gerente.split(' ')[0],
      fecha: new Date(),
      banco: this.defaults.banco.nombre
    });

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
    this.invCreator.createPDF(
      this.form.value.periodo_pago,
      this.form.value.cuenta,
      this.form.value.tipo_Inversion,
      this.form.value.vencimiento,
      this.form.value.plazo,
      this.form.value.fecha_colocacion,
      this.form.value.tasa_interes,
      this.form.value.monto,
      this.form.value.fecha_acta,
      this.form.value.acta_japp,
      this.form.value.cheque,
      this.form.value.grado,
      this.form.value.puesto,
      this.form.value.apellido,
      this.form.value.nombre,
      this.form.value.fecha,
      this.form.value.banco,
      this.administrador);        
  }

  saveWord() {    
    this.invCreator.createWord(this.form.value.periodo_pago,
      this.form.value.cuenta,
      this.form.value.tipo_Inversion,
      this.form.value.vencimiento,
      this.form.value.plazo,
      this.form.value.fecha_colocacion,
      this.form.value.tasa_interes,
      this.form.value.monto,
      this.form.value.fecha_acta,
      this.form.value.acta_japp,
      this.form.value.cheque,
      this.form.value.grado,
      this.form.value.puesto,
      this.form.value.apellido,
      this.form.value.nombre,
      this.form.value.fecha,
      this.form.value.banco,
      this.administrador);        
  }

  close() {        
    this.dialogRef.close();
  }
}
