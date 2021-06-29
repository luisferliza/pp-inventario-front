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
  tipo_cuenta: CUENTA_ENUM;
  htmlToAdd: string

  bancos: Banco[] = [];
  tiposInversion: TipoInversion[];
  tiposCuenta: TipoCuenta[];
  estados: EstadoInversion[];
  cta_inversion: Cuenta[];
  cta_provision: Cuenta[];
  cta_interes_producto: Cuenta[];
  cta_completo: Cuenta[];
  defaults: Inversion;
  periodos = [
    'MENSUAL',
    'ANUAL',
    'SEMESTRAL',
    'TRIMESTRAL',
    'CUATRIMESTRAL',
    'A TÉRMINO'
  ];

  constructor(private dialogRef: MatDialogRef<InversionEdicionComponent>,
    @Inject(MAT_DIALOG_DATA) private transfer: { data: Inversion, type: 'create' | 'update' | 'reinvertir' },
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
    this.defaults = this.transfer ? this.transfer.data : null;
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
      periodo_pago: this.defaults.periodo_pago || 'MENSUAL',
      observacion: this.defaults.observacion || '',
      tasa_interes: this.defaults.tasa_interes || 0,
      plazo: this.defaults.plazo || 365,
      cuenta: this.defaults.cuenta || '',
      calculo_especial: this.defaults.calculo_especial || false,
      aprobado_japp: this.defaults.aprobado_japp || false,
      vigente: this.defaults.vigente,
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
    this.bancoService.listarActivas(this.pidu).subscribe(data => {
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
    this.updateCuentasInversion();
    this.updateCuentasInteresXCobrar();
    this.updateCuentasInteresProducto();
  }

  updateCuentasInversion() {
    this.cuentaService.listarActivas(this.pidu, this.common.CTA_INVERSION).subscribe(data => {
      this.cta_inversion = data;
    })
  }

  updateCuentasInteresXCobrar() {
    this.cuentaService.listarActivas(this.pidu, this.common.CTA_INT_COBRAR).subscribe(data => {
      this.cta_provision = data;
    })
  }

  updateCuentasInteresProducto() {
    this.cuentaService.listarActivas(this.pidu, this.common.CTA_INT_PRODUCTO).subscribe(data => {
      this.cta_interes_producto = data;
    })
  }


  updateEstados() {
    this.estadoService.listar(this.pidu).subscribe(data => {
      this.estados = data;
    })
  }

  provision() {
    this.tipo_cuenta = CUENTA_ENUM.PROVISION;
  }

  inversion() {
    this.tipo_cuenta = CUENTA_ENUM.INVERSION;
  }

  interes() {
    this.tipo_cuenta = CUENTA_ENUM.PRODUCTO;
  }

  AsignarCuentaACategoria(cuenta: Cuenta) {
    if (this.tipo_cuenta === CUENTA_ENUM.PROVISION) {
      this.setCuenta('cuenta_provision', cuenta);
    } else if (this.tipo_cuenta === CUENTA_ENUM.INVERSION) {
      this.setCuenta('cuenta_inversion', cuenta);
    } else if (this.tipo_cuenta === CUENTA_ENUM.PRODUCTO) {
      this.setCuenta('cuenta_interes', cuenta);
    }
  }

  setCuenta(nombreCuenta: string, cuenta: Cuenta) {
    if (cuenta != null) {
      this.form.controls[`${nombreCuenta}_codigo`].setValue(cuenta.numero);
      this.form.controls[`${nombreCuenta}_nombre`].setValue(cuenta.nombre);
      this.form.controls[`${nombreCuenta}_id`].setValue(cuenta.id_cuenta);
    } else {
      this.form.controls[`${nombreCuenta}_codigo`].setValue('');
      this.form.controls[`${nombreCuenta}_nombre`].setValue('');
      this.form.controls[`${nombreCuenta}_id`].setValue(-1);
    }
  }

  buscarCuenta(id, cuentas: Cuenta[]): Cuenta {
    for (let index = 0; index < cuentas.length; index++) {
      if (cuentas[index].numero === id) {
        return cuentas[index];
      }
    }
    return null;
  }

  // Interes por cobrar 
  provisionChanged() {
    let value = this.form.value.cuenta_provision_codigo;
    let cuenta = this.buscarCuenta(value, this.cta_provision);
    this.tipo_cuenta = CUENTA_ENUM.PROVISION;
    this.AsignarCuentaACategoria(cuenta)
    if (cuenta == null) {
      this.snackBar.open('Código de cuenta de interés por cobrar inválido', 'AVISO', {
        duration: 2000
      });
    }
  }
  // Interes Producto
  interesChanged() {
    let value = this.form.value.cuenta_interes_codigo;
    let cuenta = this.buscarCuenta(value, this.cta_interes_producto);
    this.tipo_cuenta = CUENTA_ENUM.PRODUCTO;
    this.AsignarCuentaACategoria(cuenta)
    if (cuenta == null) {
      this.snackBar.open('Código de cuenta de interés producto inválido', 'AVISO', {
        duration: 2000
      });
    }
  }
  // Inversion
  inversionChanged() {
    let value = this.form.value.cuenta_inversion_codigo;
    let cuenta = this.buscarCuenta(value, this.cta_inversion);
    this.tipo_cuenta = CUENTA_ENUM.INVERSION;
    this.AsignarCuentaACategoria(cuenta)
    if (cuenta == null) {
      this.snackBar.open('Código de cuenta de inversión inválido', 'AVISO', {
        duration: 2000
      });
    }
  }

  bancoChanged() {
    let id_banco: number = this.form.value.banco_id;    
    let cuenta = this.buscarCuentaPorBanco(id_banco, this.cta_inversion);
    this.tipo_cuenta = CUENTA_ENUM.INVERSION;
    this.AsignarCuentaACategoria(cuenta)
    cuenta = this.buscarCuentaPorBanco(id_banco, this.cta_provision);
    this.tipo_cuenta = CUENTA_ENUM.PROVISION;
    this.AsignarCuentaACategoria(cuenta)
    cuenta = this.buscarCuentaPorBanco(id_banco, this.cta_interes_producto);
    this.tipo_cuenta = CUENTA_ENUM.PRODUCTO;
    this.AsignarCuentaACategoria(cuenta)

  }

  buscarCuentaPorBanco(id_banco: number, cuentas: Cuenta[]) {    
    for (let index = 0; index < cuentas.length; index++) {
      if (cuentas[index].banco && cuentas[index].banco.id_banco === id_banco) {
        return cuentas[index];
      }
    }
    return null;
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
    if (periodo === "MENSUAL") {
      fecha_pago.setMonth(fecha_pago.getMonth() + 1);      
      fecha_pago.setDate(1);      
    } else if (periodo === "ANUAL") {
      fecha_pago.setFullYear(fecha_pago.getFullYear() + 1, fecha_pago.getMonth(), fecha_pago.getDate());
    } else if (periodo === "SEMESTRAL") {
      fecha_pago.setMonth(fecha_pago.getMonth() + 6, fecha_pago.getDate());
    } else if (periodo === "TRIMESTRAL") {
      fecha_pago.setMonth(fecha_pago.getMonth() + 3, fecha_pago.getDate());
    } else if (periodo === "CUATRIMESTRAL") {
      fecha_pago.setMonth(fecha_pago.getMonth() + 4, fecha_pago.getDate());
    } else if (periodo === "A TÉRMINO") {
      fecha_pago.setDate(fecha_pago.getDate() + 1)
    } else {
      alert('PERIODO DE PAGO DESCONOCIDO')
    }
    this.form.controls['fecha_pago'].setValue(fecha_pago);
  }

  stateChange() {
    for (let index = 0; index < this.estados.length; index++) {
      const element = this.estados[index];
      if (element.id_estado === this.form.value.estado_inversion) {
        switch (element.nombre) {
          case this.common.ESTADO_INVERSION:
            this.form.controls['vigente'].setValue(true);            
            break;
          case this.common.ESTADO_REINVERSION:
            this.form.controls['vigente'].setValue(true);
            break;
          case this.common.ESTADO_REINVERSION_PARCIAL:
            this.form.controls['vigente'].setValue(true);
            break;
          case this.common.ESTADO_DESINVERSION:
            this.form.controls['vigente'].setValue(false);
            break;
          case this.common.ESTADO_VENCIMIENTO:
            this.form.controls['vigente'].setValue(false);
            break;
        }
      }


    }
  }

}

enum CUENTA_ENUM {
  PROVISION,
  INVERSION,
  PRODUCTO
}
