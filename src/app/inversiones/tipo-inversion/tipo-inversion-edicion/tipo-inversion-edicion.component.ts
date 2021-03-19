import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DepartamentoService } from 'app/servicios/inventario/departamento.service';
import { TipoInversion } from 'app/modelos/inversiones/tipo-inversion';

@Component({
  selector: 'elastic-tipo-inversion-edicion',
  templateUrl: './tipo-inversion-edicion.component.html',
  styleUrls: ['./tipo-inversion-edicion.component.scss']
})
export class TipoInversionEdicionComponent implements OnInit {

  form: FormGroup;
  mode: 'create' | 'update' = 'create';
  pidu = '10';
  

  constructor(private dialogRef: MatDialogRef<TipoInversionEdicionComponent>,
    @Inject(MAT_DIALOG_DATA) private defaults: TipoInversion,
    private departamentoService: DepartamentoService,
    private fb: FormBuilder) { }


  ngOnInit() {
    if (this.defaults) {
      this.mode = 'update';
    } else {
      this.defaults = {} as TipoInversion;
    }

    this.form = this.fb.group({      
      nombre:  '',
      descripcion:  '',            
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
