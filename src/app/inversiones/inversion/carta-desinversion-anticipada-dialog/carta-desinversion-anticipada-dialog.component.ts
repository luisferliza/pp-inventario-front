import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { CommonFunction } from 'app/inventario/shared/common';
import { Inversion } from 'app/modelos/inversiones/inversion';
import { FirmanteService } from 'app/servicios/inversiones/firmante.service';
import { ReportesInversionesService } from 'app/servicios/inversiones/reportes-inversiones';
import { DesinversionAnticipadaCreator } from './desinversion-anticipada';

@Component({
  selector: 'elastic-carta-desinversion-anticipada-dialog',
  templateUrl: './carta-desinversion-anticipada-dialog.component.html',
  styleUrls: ['./carta-desinversion-anticipada-dialog.component.scss']
})
export class CartaDesinversionAnticipadaDialogComponent implements OnInit {

  form: FormGroup;
  pidu = '10';


  constructor(private dialogRef: MatDialogRef<CartaDesinversionAnticipadaDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private defaults: Inversion,
    private fb: FormBuilder,
    private desinvCreator: DesinversionAnticipadaCreator,
    private common: CommonFunction,
    private snackBar: MatSnackBar,
    private reporteService: ReportesInversionesService,
    private firmanteService: FirmanteService) { }


  ngOnInit() {


    this.form = this.fb.group({
      fecha_acta: '',
      acta_japp: '',
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
      fecha_txt: '',
      firmante:'',
      puestoFirmante:''
    });

    this.calcularInteres();
  }


  calcularInteres() {
    console.log('Caluclando interes...')
    if (!isNaN(new Date(this.form.value.vencimiento).getTime())) {
      let vencimiento = this.defaults.vencimiento;
      this.defaults.vencimiento = this.form.value.vencimiento;
      this.reporteService.calculoInteres(this.pidu, this.defaults.vencimiento, this.defaults).subscribe(data => {
        this.form.controls['dias_interes'].setValue(data.diasInteres);
        this.form.controls['interes'].setValue(data.interes);
        this.defaults.vencimiento = vencimiento;
      })
    }

  }




  generarDocumento(tipoDoc) {
    this.firmanteService.obtenerFirmante(this.pidu, 'Administrador Ejecutivo').subscribe(data => {      
      if (data.length>0) {
        this.form.controls['fecha_acta_txt'].setValue(new Date(this.form.value.fecha_acta).toLocaleDateString('es', { year: 'numeric', month: 'long', day: 'numeric' }));
        this.form.controls['vencimiento_txt'].setValue(new Date(this.form.value.vencimiento).toLocaleDateString('es', { year: 'numeric', month: 'long', day: 'numeric' }));
        this.form.controls['entrega_txt'].setValue(new Date(this.form.value.entrega).toLocaleDateString('es', { year: 'numeric', month: 'long', day: 'numeric' }));
        this.form.controls['fecha_txt'].setValue(new Date(this.form.value.fecha).toLocaleDateString('es', { year: 'numeric', month: 'long', day: 'numeric' }));
        this.form.controls['firmante'].setValue(data[0].nombre);
        this.form.controls['puestoFirmante'].setValue(data[0].despliegue);
        if(tipoDoc === "pdf"){
          this.desinvCreator.createPDF(this.form, this.common);
        }else{
          this.desinvCreator.createWord(this.form, this.common);
        }
      } else {
        this.snackBar.open('Administrador Ejecutivo no encontrado', 'AVISO', {
          duration: 2000
        });
      }
    })

  }

  close() {
    this.dialogRef.close();
  }


}
