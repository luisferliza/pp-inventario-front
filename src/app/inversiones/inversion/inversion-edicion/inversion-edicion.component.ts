import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { Banco } from 'app/modelos/inversiones/banco';
import { Cuenta } from 'app/modelos/inversiones/cuenta';
import { EstadoInversion } from 'app/modelos/inversiones/estadoinversion';
import { Inversion } from 'app/modelos/inversiones/inversion';
import { TipoCuenta } from 'app/modelos/inversiones/tipo-cuenta';
import { TipoInversion } from 'app/modelos/inversiones/tipo-inversion';
import { BancoService } from 'app/servicios/inversiones/banco.service';
import { CuentaService } from 'app/servicios/inversiones/cuenta.service';
import { EstadoInversionService } from 'app/servicios/inversiones/estadoinversion.service';
import { InversionService } from 'app/servicios/inversiones/inversion.service';
import { TipoCuentaService } from 'app/servicios/inversiones/tipo-cuenta.service';
import { TipoInversionService } from 'app/servicios/inversiones/tipo-inversion.service';
import { CommonFunction } from 'app/inventario/shared/common';

@Component({
  selector: 'elastic-inversion-edicion',
  templateUrl: './inversion-edicion.component.html',
  styleUrls: ['./inversion-edicion.component.scss']
})
export class InversionEdicionComponent implements OnInit {


  form: FormGroup;
  mode: 'create' | 'update' | 'reinvertir' = 'create';
  pidu = '10';
  tipo_cuenta: string;
  htmlToAdd: string

  bancos: Banco[] = [];
  tiposInversion: TipoInversion[];
  tiposCuenta: TipoCuenta[];
  estados: EstadoInversion[];
  cuentas: Cuenta[];
  defaults: Inversion;
  variable = 'Hola';
  periodos = [
    'Mensual',
    'Anual',
    'Semestral',
    'Trimestral',
    'Cuatrimestral',
    'A término'
  ];

  constructor(private dialogRef: MatDialogRef<InversionEdicionComponent>,
    @Inject(MAT_DIALOG_DATA) private transfer: {data:Inversion, type:'create' | 'update' | 'reinvertir'},
    private bancoService: BancoService,
    private tipoInversionService: TipoInversionService,
    private tipoCuentaService: TipoCuentaService,
    private cuentaService: CuentaService,
    private inversionService: InversionService,
    private estadoService: EstadoInversionService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private common: CommonFunction) { }


  ngOnInit() {
    this.defaults=this.transfer? this.transfer.data : null;
    this.updateBancos();
    this.updateTiposInversion();
    this.updateTiposCuenta();
    this.updateCuentas();
    this.updateEstados();

    if (this.defaults) {
      this.mode = this.transfer.type;
    } else {
      this.defaults = {} as Inversion;
    }

    this.form = this.fb.group({
      referencia_pp: this.defaults.referencia_pp || '',
      monto: this.defaults.monto || 0.0,
      fecha_colocacion: this.defaults.fecha_colocacion ? this.common.parseDate(this.defaults.fecha_colocacion) : null,
      certificado: this.defaults.certificado || '',
      acta_japp: this.defaults.acta_japp || '',
      periodo_pago: this.defaults.periodo_pago || 'Mensual',
      observacion: this.defaults.observacion || '',
      tasa_interes: this.defaults.tasa_interes || 0,
      plazo: this.defaults.plazo || 365,
      cuenta: this.defaults.cuenta || '',
      calculo_especial: this.defaults.calculo_especial || false,
      reinversion: this.defaults.reinversion || false,
      fecha_acta: this.defaults.fecha_acta ? this.common.parseDate(this.defaults.fecha_acta) : null,
      dias_anuales: this.defaults.dias_anuales || 365,
      vencimiento: this.defaults.vencimiento ? this.common.parseDate(this.defaults.vencimiento) : null,
      fecha_pago: this.defaults.fecha_pago ? this.common.parseDate(this.defaults.fecha_pago) : null,

      tipo_Inversion_id: this.defaults.tipo_Inversion ? this.defaults.tipo_Inversion.id_tipo_inversion : null,
      estado_inversion: this.defaults.estado ? this.defaults.estado.id_estado : null,
      banco_id: this.defaults.banco ? this.defaults.banco.id_banco : null,
      cuenta_inversion_codigo: this.defaults.cuenta_inversion ? this.defaults.cuenta_inversion.numero : null,
      cuenta_provision_codigo: this.defaults.cuenta_provision ? this.defaults.cuenta_provision.numero : null,
      cuenta_interes_codigo: this.defaults.cuenta_interes ? this.defaults.cuenta_interes.numero : null,
      cuenta_inversion_nombre: this.defaults.cuenta_inversion ? this.defaults.cuenta_inversion.nombre : null,
      cuenta_provision_nombre: this.defaults.cuenta_provision ? this.defaults.cuenta_provision.nombre : null,
      cuenta_interes_nombre: this.defaults.cuenta_interes ? this.defaults.cuenta_interes.nombre : null,
      cuenta_inversion_id: this.defaults.cuenta_inversion ? this.defaults.cuenta_inversion.id_cuenta : -1,
      cuenta_provision_id: this.defaults.cuenta_provision ? this.defaults.cuenta_provision.id_cuenta : -1,
      cuenta_interes_id: this.defaults.cuenta_interes ? this.defaults.cuenta_interes.id_cuenta : -1,

    });
  }



  save() {
    if (this.mode === 'create' || this.mode === 'reinvertir') {
      this.create();
    } else if (this.mode === 'update') {
      this.update();
    }
  }

  create() {
    if (this.form.value.cuenta_provision_id == -1 ||
      this.form.value.cuenta_inversion_id == -1 ||
      this.form.value.cuenta_interes_id == -1) {
      alert('No se ha ingresado una cuenta válida')
      return;
    }
    const inversion: Inversion = this.form.value;

    inversion.tipo_Inversion = new TipoInversion();
    inversion.tipo_Inversion.id_tipo_inversion = this.form.value.tipo_Inversion_id;

    inversion.banco = new Banco();
    inversion.banco.id_banco = this.form.value.banco_id;

    inversion.cuenta_interes = new Cuenta();
    inversion.cuenta_interes.id_cuenta = this.form.value.cuenta_interes_id;

    inversion.cuenta_provision = new Cuenta();
    inversion.cuenta_provision.id_cuenta = this.form.value.cuenta_provision_id;

    inversion.cuenta_inversion = new Cuenta();
    inversion.cuenta_inversion.id_cuenta = this.form.value.cuenta_inversion_id;

    inversion.estado = new EstadoInversion();
    inversion.estado.id_estado = this.form.value.estado_inversion;

    //Conversion de fechas
    inversion.fecha_colocacion = this.form.value.fecha_colocacion.toISOString() // Convierte la fecha
    inversion.fecha_acta = this.form.value.fecha_acta.toISOString() // Convierte la fecha
    inversion.vencimiento = this.form.value.vencimiento.toISOString() // Convierte la fecha
    inversion.fecha_pago = this.form.value.fecha_pago.toISOString() // Convierte la fecha
    

    this.inversionService.registrar(inversion, this.pidu).subscribe(() => {
      this.dialogRef.close(inversion);
    })

  }

  update() {
    if (this.form.value.cuenta_provision_id == -1 ||
      this.form.value.cuenta_inversion_id == -1 ||
      this.form.value.cuenta_interes_id == -1) {
      alert('No se ha ingresado una cuenta válida')
      return;
    }
    const inversion: Inversion = this.form.value;
    inversion.id_inversion = this.defaults.id_inversion;

    inversion.tipo_Inversion = new TipoInversion();
    inversion.tipo_Inversion.id_tipo_inversion = this.form.value.tipo_Inversion_id;

    inversion.banco = new Banco();
    inversion.banco.id_banco = this.form.value.banco_id;

    inversion.cuenta_interes = new Cuenta();
    inversion.cuenta_interes.id_cuenta = this.form.value.cuenta_interes_id;

    inversion.cuenta_provision = new Cuenta();
    inversion.cuenta_provision.id_cuenta = this.form.value.cuenta_provision_id;

    inversion.cuenta_inversion = new Cuenta();
    inversion.cuenta_inversion.id_cuenta = this.form.value.cuenta_inversion_id;

    inversion.estado = new EstadoInversion();
    inversion.estado.id_estado = this.form.value.estado_inversion;

    //Conversion de fechas
    inversion.fecha_colocacion = this.form.value.fecha_colocacion.toISOString() // Convierte la fecha
    inversion.fecha_acta = this.form.value.fecha_acta.toISOString() // Convierte la fecha
    inversion.vencimiento = this.form.value.vencimiento.toISOString() // Convierte la fecha
    inversion.fecha_pago = this.form.value.fecha_pago.toISOString() // Convierte la fecha    

    this.inversionService.modificar(inversion, this.pidu).subscribe(() => {
      this.dialogRef.close(inversion);
    })
  }

  isCreateMode() {
    return this.mode === 'create' || this.mode === 'reinvertir';
  }

  isUpdateMode() {
    return this.mode === 'update';
  }

  updateBancos() {
    this.bancoService.listar(this.pidu).subscribe(data => {
      this.bancos = data;
    })
  }

  updateTiposInversion() {
    this.tipoInversionService.listar(this.pidu).subscribe(data => {
      this.tiposInversion = data;
    })
  }

  updateTiposCuenta() {
    this.tipoCuentaService.listar(this.pidu).subscribe(data => {      
      this.tiposCuenta = data;
    })
  }

  updateCuentas() {
    this.cuentaService.listarActivas(this.pidu).subscribe(data => {
      this.cuentas = data;
    })
  }

  updateEstados(){
    this.estadoService.listar(this.pidu).subscribe(data => {
      this.estados = data;
    })
  }

  provision() {
    this.tipo_cuenta = 'PROVISION';    
  }

  inversion() {
    this.tipo_cuenta = 'INVERSION';    
  }

  interes() {
    this.tipo_cuenta = 'INTERES';    
  }

  setCuenta(id) {
    let cuenta: Cuenta = this.buscarCuenta(id);
    console.log(cuenta)
    if (cuenta != null) {
      if (this.tipo_cuenta === 'PROVISION') {
        this.form.controls['cuenta_provision_codigo'].setValue(cuenta.numero);
        this.form.controls['cuenta_provision_nombre'].setValue(cuenta.nombre);
        this.form.controls['cuenta_provision_id'].setValue(cuenta.id_cuenta);
      } else if (this.tipo_cuenta === 'INVERSION') {
        this.form.controls['cuenta_inversion_codigo'].setValue(cuenta.numero);
        this.form.controls['cuenta_inversion_nombre'].setValue(cuenta.nombre);
        this.form.controls['cuenta_inversion_id'].setValue(cuenta.id_cuenta);
      } else if (this.tipo_cuenta === 'INTERES') {
        this.form.controls['cuenta_interes_codigo'].setValue(cuenta.numero);
        this.form.controls['cuenta_interes_nombre'].setValue(cuenta.nombre);
        this.form.controls['cuenta_interes_id'].setValue(cuenta.id_cuenta);
      }
    }
  }

  buscarCuenta(id): Cuenta {
    for (let index = 0; index < this.cuentas.length; index++) {
      if (this.cuentas[index].numero === id) {
        return this.cuentas[index];
      }
    }
    return null;
  }

  provisionChanged() {
    let value = this.form.value.cuenta_provision_codigo;
    let cuenta = this.buscarCuenta(value);
    if (cuenta != null) {
      this.form.controls['cuenta_provision_codigo'].setValue(cuenta.numero);
      this.form.controls['cuenta_provision_nombre'].setValue(cuenta.nombre);
      this.form.controls['cuenta_provision_id'].setValue(cuenta.id_cuenta);
    } else {
      this.form.controls['cuenta_provision_codigo'].setValue('');
      this.form.controls['cuenta_provision_nombre'].setValue('');
      this.form.controls['cuenta_provision_id'].setValue(-1);
      this.snackBar.open('Código de cuenta inválido', 'AVISO', {
        duration: 2000
      });
    }
  }

  interesChanged() {
    let value = this.form.value.cuenta_interes_codigo;
    let cuenta = this.buscarCuenta(value);
    if (cuenta != null) {
      this.form.controls['cuenta_interes_codigo'].setValue(cuenta.numero);
      this.form.controls['cuenta_interes_nombre'].setValue(cuenta.nombre);
      this.form.controls['cuenta_interes_id'].setValue(cuenta.id_cuenta);
    } else {
      this.form.controls['cuenta_interes_codigo'].setValue('');
      this.form.controls['cuenta_interes_nombre'].setValue('');
      this.form.controls['cuenta_interes_id'].setValue(-1);
      this.snackBar.open('Código de cuenta inválido', 'AVISO', {
        duration: 2000
      });
    }
  }
  inversionChanged() {
    let value = this.form.value.cuenta_inversion_codigo;
    let cuenta = this.buscarCuenta(value);
    if (cuenta != null) {
      this.form.controls['cuenta_inversion_codigo'].setValue(cuenta.numero);
      this.form.controls['cuenta_inversion_nombre'].setValue(cuenta.nombre);
      this.form.controls['cuenta_inversion_id'].setValue(cuenta.id_cuenta);
    } else {
      this.form.controls['cuenta_inversion_codigo'].setValue('');
      this.form.controls['cuenta_inversion_nombre'].setValue('');
      this.form.controls['cuenta_inversion_id'].setValue(-1);
      this.snackBar.open('Código de cuenta inválido', 'AVISO', {
        duration: 2000
      });
    }
  }


  changeDate() {
    this.changeEndDate();
    this.ChangePayDate();
  }

  changeEndDate() {    
    let futureDate: Date = new Date(this.form.value.fecha_colocacion.getTime());
    futureDate.setDate(futureDate.getDate() + this.form.value.plazo - 1)
    this.form.controls['vencimiento'].setValue(futureDate);
  }

  ChangePayDate() {
    let periodo = this.form.value.periodo_pago;
    let fecha_pago: Date = new Date(this.form.value.fecha_colocacion.getTime()); 
    console.log(fecha_pago)
    if (periodo === "Mensual") {      
      fecha_pago.setMonth(fecha_pago.getMonth() + 1);
      console.log(fecha_pago)
      fecha_pago.setDate(1);
      console.log(fecha_pago)
    } else if (periodo === "Anual") {      
      fecha_pago.setFullYear(fecha_pago.getFullYear() + 1, fecha_pago.getMonth(), fecha_pago.getDate());      
    } else if (periodo === "Semestral") {      
      fecha_pago.setMonth(fecha_pago.getMonth() + 6, fecha_pago.getDate());
    } else if (periodo === "Trimestral") {      
      fecha_pago.setMonth(fecha_pago.getMonth() + 3, fecha_pago.getDate());      
    } else if (periodo === "Cuatrimestral") {      
      fecha_pago.setMonth(fecha_pago.getMonth() + 4, fecha_pago.getDate());
    } else if (periodo === "A término") {      
      fecha_pago.setDate(fecha_pago.getDate() + 1)      
    } else {
      alert('PERIODO DE PAGO DESCONOCIDO')
    }
    this.form.controls['fecha_pago'].setValue(fecha_pago);
  }


  getCategoryName(number) {
    if (this.tiposCuenta!= undefined && number < this.tiposCuenta.length) {
      return this.tiposCuenta[number].nombre;
    }
    return "No existe"
  }

  createCategory(number) {
    return this.tiposCuenta != undefined && number < this.tiposCuenta.length;
  }

  getCuentas(index) {
    let cuentas = []    
    if (this.tiposCuenta && this.cuentas && index < this.tiposCuenta.length) {
      let id_categoria = this.tiposCuenta[index].id_tipo_cuenta;
      for (let t = 0; t < this.cuentas.length; t++) {
        const element = this.cuentas[t];      
          if(element.tipo_cuenta.id_tipo_cuenta === id_categoria){
            cuentas.push(element);
          }
      }
    }
    return cuentas;    
  }





}
