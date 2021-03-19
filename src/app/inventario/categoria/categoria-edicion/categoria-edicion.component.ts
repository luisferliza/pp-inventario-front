import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Categoria } from 'app/modelos/inventario/categoria';
import { CategoriaService } from 'app/servicios/inventario/categoria.service';

interface Depreciacion {
  valor: number;
  descripcion: string;
}

@Component({
  selector: 'app-categoria-edicion',
  templateUrl: './categoria-edicion.component.html',
  styleUrls: ['./categoria-edicion.component.scss']
})
export class CategoriaEdicionComponent implements OnInit {  

  form: FormGroup;
  mode: 'create' | 'update' = 'create';
  pidu = '10';

  depreciaciones: Depreciacion[] = [
    { valor: 0, descripcion: "Sin Depreciacion" },
    { valor: 1, descripcion: "1 año" },
    { valor: 2, descripcion: "2 años" },
    { valor: 3, descripcion: "3 años" },
    { valor: 4, descripcion: "4 años" },
    { valor: 5, descripcion: "5 años" },
    { valor: 10, descripcion: "10 años" },
    { valor: 20, descripcion: "20 años" }
  ]



  constructor(private dialogRef: MatDialogRef<CategoriaEdicionComponent>,
    @Inject(MAT_DIALOG_DATA) private defaults: Categoria,
    private categoriaService: CategoriaService,
    private fb: FormBuilder) { }


  ngOnInit() {
    if (this.defaults) {
      this.mode = 'update';
    } else {
      this.defaults = {} as Categoria;
    }

    this.form = this.fb.group({      
      nombre: this.defaults.nombre || '',
      depreciacion: this.defaults.depreciacion || 0      
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
    const categoria = this.form.value;
    this.categoriaService.registrar(categoria, this.pidu).subscribe(()=>{
      this.dialogRef.close(categoria);
    })    
  }

  update() {
    const categoria = this.form.value;
    categoria.id_categoria = this.defaults.id_categoria;
    this.categoriaService.modificar(categoria, this.pidu).subscribe(()=>{
      this.dialogRef.close(categoria);
    })    
  }

  isCreateMode() {
    return this.mode === 'create';
  }

  isUpdateMode() {
    return this.mode === 'update';
  }

}
