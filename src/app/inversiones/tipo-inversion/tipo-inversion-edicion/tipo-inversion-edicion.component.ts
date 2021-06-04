import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DepartamentoService } from 'app/servicios/inventario/departamento.service';
import { TipoInversion } from 'app/modelos/inversiones/tipo-inversion';
import { TipoInversionService } from 'app/servicios/inversiones/tipo-inversion.service';

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
    private tipoInversionService: TipoInversionService,   
    private fb: FormBuilder) { }


  ngOnInit() {
    if (this.defaults) {
      this.mode = 'update';
    } else {
      this.defaults = {} as TipoInversion;
    }

    this.form = this.fb.group({      
      nombre: this.defaults.nombre || '',
      siglas: this.defaults.siglas || ''      
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
    const tipoInversion: TipoInversion = this.form.value;
    this.tipoInversionService.registrar(tipoInversion, this.pidu).subscribe(()=>{
      this.dialogRef.close(tipoInversion);
    })
    
  }

  update() {    
    const tipoInversion: TipoInversion = this.form.value;
    tipoInversion.id_tipo_inversion = this.defaults.id_tipo_inversion;
    this.tipoInversionService.modificar(tipoInversion, this.pidu).subscribe(()=>{
      this.dialogRef.close(tipoInversion);
    })
    
  }

  isCreateMode() {
    return this.mode === 'create';
  }

  isUpdateMode() {
    return this.mode === 'update';
  }

}
