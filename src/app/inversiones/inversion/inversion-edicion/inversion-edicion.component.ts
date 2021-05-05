import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { Banco } from 'app/modelos/inversiones/banco';
import { Cuenta } from 'app/modelos/inversiones/cuenta';
import { Inversion } from 'app/modelos/inversiones/inversion';
import { TipoCuenta } from 'app/modelos/inversiones/tipo-cuenta';
import { TipoInversion } from 'app/modelos/inversiones/tipo-inversion';
import { BancoService } from 'app/servicios/inversiones/banco.service';
import { CuentaService } from 'app/servicios/inversiones/cuenta.service';
import { InversionService } from 'app/servicios/inversiones/inversion.service';
import { TipoCuentaService } from 'app/servicios/inversiones/tipo-cuenta.service';
import { TipoInversionService } from 'app/servicios/inversiones/tipo-inversion.service';

@Component({
  selector: 'elastic-inversion-edicion',
  templateUrl: './inversion-edicion.component.html',
  styleUrls: ['./inversion-edicion.component.scss']
})
export class InversionEdicionComponent implements OnInit {


  form: FormGroup;
  mode: 'create' | 'update' = 'create';
  pidu = '10';
  tipo_cuenta: string;
  htmlToAdd: string

  bancos: Banco[] = [];
  tiposInversion: TipoInversion[];
  tiposCuenta: TipoCuenta[];
  cuentas: Cuenta[];
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
    @Inject(MAT_DIALOG_DATA) private defaults: Inversion,
    private bancoService: BancoService,
    private tipoInversionService: TipoInversionService,
    private tipoCuentaService: TipoCuentaService,
    private cuentaService: CuentaService,
    private inversionService: InversionService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar) { }


  ngOnInit() {

    this.updateBancos();
    this.updateTiposInversion();
    this.updateTiposCuenta();
    this.updateCuentas();

    if (this.defaults) {
      this.mode = 'update';
    } else {
      this.defaults = {} as Inversion;
    }

    this.form = this.fb.group({
      referencia: this.defaults.referencia || '',
      monto: this.defaults.monto || 0.0,
      fecha_colocacion: this.defaults.fecha_colocacion ? this.defaults.fecha_colocacion : null,
      no_inversion: this.defaults.no_inversion || '',
      acta_japp: this.defaults.acta_japp || '',
      periodo_pago: this.defaults.periodo_pago || 'Mensual',
      observacion: this.defaults.observacion || '',
      tasa_interes: this.defaults.tasa_interes || 0,
      plazo: this.defaults.plazo || 365,
      cuenta: this.defaults.cuenta || '',
      calculo_especial: this.defaults.calculo_especial || false,
      fecha_acta: this.defaults.fecha_acta ? this.defaults.fecha_acta : null,
      dias_anuales: this.defaults.dias_anuales || 365,
      vencimiento: this.defaults.vencimiento ? this.defaults.vencimiento : null,
      fecha_pago: this.defaults.fecha_pago ? this.defaults.fecha_pago : null,


      tipo_Inversion_id: this.defaults.tipo_Inversion ? this.defaults.tipo_Inversion.id_tipo_inversion : null,
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
    if (this.mode === 'create') {
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

    console.log(inversion);

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

    console.log(inversion);

    this.inversionService.modificar(inversion, this.pidu).subscribe(() => {
      this.dialogRef.close(inversion);
    })
  }

  isCreateMode() {
    return this.mode === 'create';
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
      console.log(data)
      this.tiposCuenta = data;
    })
  }

  updateCuentas() {
    this.cuentaService.listar(this.pidu).subscribe(data => {
      this.cuentas = data;
    })

  }

  provision() {
    this.tipo_cuenta = 'PROVISION';
    console.log(this.tipo_cuenta)
  }

  inversion() {
    this.tipo_cuenta = 'INVERSION';
    console.log(this.tipo_cuenta)
  }

  interes() {
    this.tipo_cuenta = 'INTERES';
    console.log(this.tipo_cuenta)
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
    let yourDate = this.form.value.fecha_colocacion
    let period = this.form.value.plazo
    let futureDate = new Date(yourDate);
    futureDate.setDate(futureDate.getDate() + period - 1)
    this.form.controls['vencimiento'].setValue(futureDate.toISOString().split('T')[0]);
  }

  ChangePayDate() {
    let periodo = this.form.value.periodo_pago;
    if (periodo === "Mensual") {
      let fecha_pago = new Date(this.form.value.fecha_colocacion);
      fecha_pago.setMonth(fecha_pago.getMonth() + 1);
      fecha_pago.setDate(0);
      this.form.controls['fecha_pago'].setValue(fecha_pago.toISOString().split('T')[0]);

    } else if (periodo === "Anual") {
      let fecha_pago = new Date(this.form.value.fecha_colocacion);
      fecha_pago.setFullYear(fecha_pago.getFullYear() + 1, fecha_pago.getMonth(), fecha_pago.getDate());
      this.form.controls['fecha_pago'].setValue(fecha_pago.toISOString().split('T')[0]);

    } else if (periodo === "Semestral") {
      let fecha_pago = new Date(this.form.value.fecha_colocacion);
      fecha_pago.setMonth(fecha_pago.getMonth() + 6, fecha_pago.getDate());
      this.form.controls['fecha_pago'].setValue(fecha_pago.toISOString().split('T')[0]);

    } else if (periodo === "Trimestral") {
      let fecha_pago = new Date(this.form.value.fecha_colocacion);
      fecha_pago.setMonth(fecha_pago.getMonth() + 3, fecha_pago.getDate());
      this.form.controls['fecha_pago'].setValue(fecha_pago.toISOString().split('T')[0]);

    } else if (periodo === "Cuatrimestral") {
      let fecha_pago = new Date(this.form.value.fecha_colocacion);
      fecha_pago.setMonth(fecha_pago.getMonth() + 4, fecha_pago.getDate());
      this.form.controls['fecha_pago'].setValue(fecha_pago.toISOString().split('T')[0]);

    } else if (periodo === "A término") {
      let fecha_pago = new Date(this.form.value.vencimiento);
      fecha_pago.setDate(fecha_pago.getDate() + 1)
      this.form.controls['fecha_pago'].setValue(fecha_pago.toISOString().split('T')[0]);
    } else {
      alert('PERIODO DE PAGO DESCONOCIDO')
    }

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
