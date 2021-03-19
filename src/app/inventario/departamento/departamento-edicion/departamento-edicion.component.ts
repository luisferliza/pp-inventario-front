import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Departamento } from 'app/modelos/inventario/departamento';
import { DepartamentoService } from 'app/servicios/inventario/departamento.service';

@Component({
  selector: 'app-departamento-edicion',
  templateUrl: './departamento-edicion.component.html',
  styleUrls: ['./departamento-edicion.component.scss']
})
export class DepartamentoEdicionComponent implements OnInit {

  form: FormGroup;
  mode: 'create' | 'update' = 'create';
  pidu = '10';
  

  constructor(private dialogRef: MatDialogRef<DepartamentoEdicionComponent>,
    @Inject(MAT_DIALOG_DATA) private defaults: Departamento,
    private departamentoService: DepartamentoService,
    private fb: FormBuilder) { }


  ngOnInit() {
    if (this.defaults) {
      this.mode = 'update';
    } else {
      this.defaults = {} as Departamento;
    }

    this.form = this.fb.group({      
      nombre: this.defaults.nombre || ''      
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
    const departamento: Departamento = this.form.value;
    this.departamentoService.registrar(departamento, this.pidu).subscribe(()=>{
      this.dialogRef.close(departamento);
    })    
  }

  update() {
    const departamento: Departamento = this.form.value;
    departamento.id_departamento = this.defaults.id_departamento;
    this.departamentoService.modificar(departamento, this.pidu).subscribe(()=>{
      this.dialogRef.close(departamento);
    })    
  }

  isCreateMode() {
    return this.mode === 'create';
  }

  isUpdateMode() {
    return this.mode === 'update';
  }

}
