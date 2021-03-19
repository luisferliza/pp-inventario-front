import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Banco } from 'app/modelos/inversiones/banco';
import { DepartamentoService } from 'app/servicios/inventario/departamento.service';

@Component({
  selector: 'elastic-banco-edicion',
  templateUrl: './banco-edicion.component.html',
  styleUrls: ['./banco-edicion.component.scss']
})
export class BancoEdicionComponent implements OnInit {

  form: FormGroup;
  mode: 'create' | 'update' = 'create';
  pidu = '10';
  

  constructor(private dialogRef: MatDialogRef<BancoEdicionComponent>,
    @Inject(MAT_DIALOG_DATA) private defaults: Banco,
    private departamentoService: DepartamentoService,
    private fb: FormBuilder) { }


  ngOnInit() {
    if (this.defaults) {
      this.mode = 'update';
    } else {
      this.defaults = {} as Banco;
    }

    this.form = this.fb.group({      
      nombre:  '',
      contacto:  '',      
      direccion:  '',      
      telefono:  ''      
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
    /*const departamento: Banco = this.form.value;
    this.departamentoService.registrar(departamento, this.pidu).subscribe(()=>{
      this.dialogRef.close(departamento);
    })
    */    
  }

  update() {
    /*
    const departamento: Banco = this.form.value;
    departamento.id_departamento = this.defaults.id_departamento;
    this.departamentoService.modificar(departamento, this.pidu).subscribe(()=>{
      this.dialogRef.close(departamento);
    })
    */    
  }

  isCreateMode() {
    return this.mode === 'create';
  }

  isUpdateMode() {
    return this.mode === 'update';
  }

}
