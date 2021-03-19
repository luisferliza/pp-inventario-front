import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Estado } from 'app/modelos/inventario/estado';
import { EstadoService } from 'app/servicios/inventario/estado.service';


@Component({
  selector: 'app-estado-edicion',
  templateUrl: './estado-edicion.component.html',
  styleUrls: ['./estado-edicion.component.scss']
})
export class EstadoEdicionComponent implements OnInit {

  
  form: FormGroup;
  mode: 'create' | 'update' = 'create';
  pidu = '10';
  

  constructor(private dialogRef: MatDialogRef<EstadoEdicionComponent>,
    @Inject(MAT_DIALOG_DATA) private defaults: Estado,
    private departamentoService: EstadoService,
    private fb: FormBuilder) { }


  ngOnInit() {
    if (this.defaults) {
      this.mode = 'update';
    } else {
      this.defaults = {} as Estado;
    }

    this.form = this.fb.group({      
      nombre: this.defaults.nombre || '',
      editable: this.defaults.editable || true,                  
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
    const estado: Estado = this.form.value;    
    this.departamentoService.registrar(estado, this.pidu).subscribe(()=>{
      this.dialogRef.close(estado);
    })    
  }

  update() {
    const estado: Estado = this.form.value;    
    estado.id_estado = this.defaults.id_estado;    
    this.departamentoService.modificar(estado, this.pidu).subscribe(()=>{
      this.dialogRef.close(estado);
    })    
  }

  isCreateMode() {
    return this.mode === 'create';
  }

  isUpdateMode() {
    return this.mode === 'update';
  }

}
