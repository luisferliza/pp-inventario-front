import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Condicion } from 'app/modelos/inventario/condicion';
import { CondicionService } from 'app/servicios/inventario/condicion.service';

@Component({
  selector: 'elastic-condicion-edicion',
  templateUrl: './condicion-edicion.component.html',
  styleUrls: ['./condicion-edicion.component.scss']
})
export class CondicionEdicionComponent implements OnInit {

  form: FormGroup;
  mode: 'create' | 'update' = 'create';
  pidu = '10';
  

  constructor(private dialogRef: MatDialogRef<CondicionEdicionComponent>,
    @Inject(MAT_DIALOG_DATA) private defaults: Condicion,
    private condicionService: CondicionService,
    private fb: FormBuilder) { }


  ngOnInit() {
    if (this.defaults) {
      this.mode = 'update';
    } else {
      this.defaults = {} as Condicion;
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
    const condicion: Condicion = this.form.value;
    this.condicionService.registrar(condicion, this.pidu).subscribe(()=>{
      this.dialogRef.close(condicion);
    })    
  }

  update() {
    const condicion: Condicion = this.form.value;
    condicion.id_condicion = this.defaults.id_condicion;
    this.condicionService.modificar(condicion, this.pidu).subscribe(()=>{
      this.dialogRef.close(condicion);
    })    
  }

  isCreateMode() {
    return this.mode === 'create';
  }

  isUpdateMode() {
    return this.mode === 'update';
  }

}
