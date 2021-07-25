import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Usuario } from 'app/modelos/inventario/usuario';
import { UsuarioService } from 'app/servicios/inventario/usuario.service';

@Component({
  selector: 'elastic-usuario-edicion',
  templateUrl: './usuario-edicion.component.html',
  styleUrls: ['./usuario-edicion.component.scss']
})
export class UsuarioEdicionComponent implements OnInit {

  form: FormGroup;
  mode: 'create' | 'update' = 'create';
  pidu = '10';
  

  constructor(private dialogRef: MatDialogRef<UsuarioEdicionComponent>,
    @Inject(MAT_DIALOG_DATA) private defaults: Usuario,
    private usuarioService: UsuarioService,
    private fb: FormBuilder) { }


  ngOnInit() {
    if (this.defaults) {
      this.mode = 'update';
    } else {
      this.defaults = {} as Usuario;
    }

    this.form = this.fb.group({      
      nombrepp: this.defaults.nombrepp || '',
      puesto: this.defaults.puesto || '',      
      idUsuario: this.defaults.idUsuario || 0    
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
    const usuario: Usuario = this.form.value;
    let usuarioArray = []
    usuarioArray.push(usuario)
    this.usuarioService.modificar(usuarioArray, this.pidu).subscribe(()=>{
      this.dialogRef.close(usuario);
    })    
  }

  update() {
    const usuario: Usuario = this.form.value;
    usuario.idUsuario = this.defaults.idUsuario;
    let usuarioArray = []
    usuarioArray.push(usuario)
    this.usuarioService.modificar(usuarioArray, this.pidu).subscribe(()=>{
      this.dialogRef.close(usuario);
    })    
  }

  isCreateMode() {
    return this.mode === 'create';
  }

  isUpdateMode() {
    return this.mode === 'update';
  }

}
