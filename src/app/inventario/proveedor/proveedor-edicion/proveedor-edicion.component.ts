import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Proveedor } from 'app/modelos/inventario/proveedor';
import { ProveedorService } from 'app/servicios/inventario/proveedor.service';

@Component({
  selector: 'app-proveedor-edicion',
  templateUrl: './proveedor-edicion.component.html',
  styleUrls: ['./proveedor-edicion.component.scss']
})
export class ProveedorEdicionComponent implements OnInit {

  form: FormGroup;
  mode: 'create' | 'update' = 'create';
  pidu = '10';
  
  constructor(private dialogRef: MatDialogRef<ProveedorEdicionComponent>,
    @Inject(MAT_DIALOG_DATA) private defaults: Proveedor,
    private proveedorService: ProveedorService,
    private fb: FormBuilder) { }


  ngOnInit() {
    if (this.defaults) {
      this.mode = 'update';
    } else {
      this.defaults = {} as Proveedor;
    }

    this.form = this.fb.group({      
      nombre: this.defaults.nombre || '',      
      direccion: this.defaults.direccion || '',      
      telefono: this.defaults.telefono || '',      
      nit: this.defaults.nit || ''  ,          
      email: this.defaults.email || '',      
      asesor: this.defaults.asesor || ''            
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
    const proveedor: Proveedor = this.form.value;
    this.proveedorService.registrar(proveedor, this.pidu).subscribe(()=>{
      this.dialogRef.close(proveedor);
    })    
  }

  update() {
    const proveedor: Proveedor = this.form.value;
    proveedor.id_proveedor = this.defaults.id_proveedor;
    this.proveedorService.modificar(proveedor, this.pidu).subscribe(()=>{
      this.dialogRef.close(proveedor);
    })    
  }

  isCreateMode() {
    return this.mode === 'create';
  }

  isUpdateMode() {
    return this.mode === 'update';
  }



}
