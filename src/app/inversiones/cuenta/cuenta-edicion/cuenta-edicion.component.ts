import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Cuenta } from 'app/modelos/inversiones/cuenta';
import { TipoCuenta } from 'app/modelos/inversiones/tipo-cuenta';
import { CuentaService } from 'app/servicios/inversiones/cuenta.service';
import { TipoCuentaService } from 'app/servicios/inversiones/tipo-cuenta.service';
import { BancoService } from 'app/servicios/inversiones/banco.service';
import { Banco } from 'app/modelos/inversiones/banco';

@Component({
  selector: 'elastic-cuenta-edicion',
  templateUrl: './cuenta-edicion.component.html',
  styleUrls: ['./cuenta-edicion.component.scss']
})
export class CuentaEdicionComponent implements OnInit {

  form: FormGroup;
  mode: 'create' | 'update' = 'create';
  pidu = '10';
  tipos: TipoCuenta[];
  bancos: Banco[] = [];  
  

  constructor(private dialogRef: MatDialogRef<CuentaEdicionComponent>,
    @Inject(MAT_DIALOG_DATA) private defaults: Cuenta,
    private cuentaService: CuentaService,
    private tipoCuentaService: TipoCuentaService,
    private fb: FormBuilder,
    private bancoService: BancoService) { }


  ngOnInit() {    
    
    this.updateTiposEntidad();
    this.updateBancos();

    if (this.defaults) {
      this.mode = 'update';
    } else {
      this.defaults = {} as Cuenta;
    }

    this.form = this.fb.group({      
      nombre:  this.defaults.nombre || '',
      numero: this.defaults.numero || '',      
      activa: this.defaults.activa || false,            
      tipo_cuenta_id: this.defaults.tipoCuenta? this.defaults.tipoCuenta.id_tipo_cuenta : null,         
      banco_id: this.defaults.banco ? this.defaults.banco.id_banco : null
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
    const cuenta: Cuenta = this.form.value;

    cuenta.tipoCuenta= new TipoCuenta();
    cuenta.tipoCuenta.id_tipo_cuenta = this.form.value.tipo_cuenta_id;

    if(this.form.value.banco_id){
      cuenta.banco = new Banco();
      cuenta.banco.id_banco = this.form.value.banco_id;
    }    
    
    this.cuentaService.registrar(cuenta, this.pidu).subscribe(()=>{
      this.dialogRef.close(cuenta);
    })
    
  }

  update() {
    const cuenta: Cuenta = this.form.value;
    cuenta.id_cuenta = this.defaults.id_cuenta;

    cuenta.tipoCuenta= new TipoCuenta();
    cuenta.tipoCuenta.id_tipo_cuenta = this.form.value.tipo_cuenta_id;
    
    if(this.form.value.banco_id){
      cuenta.banco = new Banco();
      cuenta.banco.id_banco = this.form.value.banco_id;
    }    

    this.cuentaService.modificar(cuenta, this.pidu).subscribe(()=>{
      this.dialogRef.close(cuenta);
    })
  }

  isCreateMode() {
    return this.mode === 'create';
  }

  isUpdateMode() {
    return this.mode === 'update';
  }

  updateTiposEntidad() {
    this.tipoCuentaService.listar(this.pidu).subscribe(data => {      
      this.tipos = data;
    })
  }

  updateBancos() {
    this.bancoService.listarActivas(this.pidu).subscribe(data => {
      this.bancos = data;
    })
  }

  

}
