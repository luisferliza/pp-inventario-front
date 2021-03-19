import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TipoArticulo } from 'app/modelos/inventario/tipo-articulo';
import { TipoArticuloService } from 'app/servicios/inventario/tipo-articulo.service';

@Component({
  selector: 'app-tipo-articulo-edicion',
  templateUrl: './tipo-articulo-edicion.component.html',
  styleUrls: ['./tipo-articulo-edicion.component.scss']
})
export class TipoArticuloEdicionComponent implements OnInit {
  
  form: FormGroup;
  mode: 'create' | 'update' = 'create';
  pidu = '10';
  

  constructor(private dialogRef: MatDialogRef<TipoArticuloEdicionComponent>,
    @Inject(MAT_DIALOG_DATA) private defaults: TipoArticulo,
    private departamentoService: TipoArticuloService,
    private fb: FormBuilder) { }


  ngOnInit() {
    if (this.defaults) {
      this.mode = 'update';
    } else {
      this.defaults = {} as TipoArticulo;
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
    const tipoArticulo: TipoArticulo = this.form.value;
    this.departamentoService.registrar(tipoArticulo, this.pidu).subscribe(()=>{
      this.dialogRef.close(tipoArticulo);
    })    
  }

  update() {
    const tipoArticulo: TipoArticulo = this.form.value;
    tipoArticulo.id_tipo_articulo = this.defaults.id_tipo_articulo;
    this.departamentoService.modificar(tipoArticulo, this.pidu).subscribe(()=>{
      this.dialogRef.close(tipoArticulo);
    })    
  }

  isCreateMode() {
    return this.mode === 'create';
  }

  isUpdateMode() {
    return this.mode === 'update';
  }

}
