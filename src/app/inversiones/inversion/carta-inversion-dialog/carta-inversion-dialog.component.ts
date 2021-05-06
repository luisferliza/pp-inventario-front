import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { Inversion } from 'app/modelos/inversiones/inversion';
import { InversionCreator } from './carta-inversion';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { CommonFunction } from 'app/inventario/shared/common';
pdfMake.vfs = pdfFonts.pdfMake.vfs;


@Component({
  selector: 'elastic-carta-inversion-dialog',
  templateUrl: './carta-inversion-dialog.component.html', 
  styleUrls: ['./carta-inversion-dialog.component.scss']
})
export class CartaInversionDialogComponent implements OnInit {

  form: FormGroup;  
  pidu = '10';
  

  constructor(private dialogRef: MatDialogRef<CartaInversionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private defaults: Inversion,        
    private fb: FormBuilder,
    private invCreator: InversionCreator,
    private common: CommonFunction,
    private snackBar: MatSnackBar) { }


  ngOnInit() {
    console.log(this.defaults)    

    this.form = this.fb.group({
      periodo_pago: this.defaults.periodo_pago,
      cuenta: '',      
      tipo_Inversion: this.defaults.tipo_Inversion.nombre,
      vencimiento: new Date(this.defaults.vencimiento.split('T')[0]).toLocaleDateString('es', { year: 'numeric', month: 'long', day: 'numeric' }),
      plazo: this.defaults.plazo,
      fecha_colocacion: new Date(this.defaults.fecha_colocacion.split('T')[0]).toLocaleDateString('es', { year: 'numeric', month: 'long', day: 'numeric' }),
      tasa_interes: this.defaults.tasa_interes,
      monto: this.defaults.monto,
      fecha_acta: new Date(this.defaults.fecha_acta.split('T')[0]).toLocaleDateString('es', { year: 'numeric', month: 'long', day: 'numeric' }),
      acta_japp: this.defaults.acta_japp,
      cheque: '',
      grado: this.defaults.banco.titulo_gerente,
      puesto: 'Gerente General',
      apellido: this.defaults.banco.nombre_gerente.split(' ')[1],
      nombre: this.defaults.banco.nombre_gerente.split(' ')[0],
      fecha: new Date().toLocaleDateString('es', { year: 'numeric', month: 'long', day: 'numeric' }),
      banco: this.defaults.banco.nombre
    });
  }

  savePDF() {    
    this.invCreator.createPDF(this.form, this.common);        
  }

  saveWord() {    
    this.invCreator.createWord(this.form, this.common);        
  }

  close() {        
    this.dialogRef.close();
  }
}
