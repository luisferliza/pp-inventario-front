import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Departamento } from 'app/modelos/inventario/departamento';
import { TarjetaResponsabilidad } from 'app/modelos/inventario/tarjeta-responsabilidad';
import { Traslado } from 'app/modelos/inventario/traslado';
import { Usuario } from 'app/modelos/inventario/usuario';
import { DepartamentoService } from 'app/servicios/inventario/departamento.service';
import { TrasladoService } from 'app/servicios/inventario/traslado.service';
import { UsuarioService } from 'app/servicios/inventario/usuario.service';
import { CommonFunction } from 'app/inventario/shared/common';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'elastic-traslado-edicion',
  templateUrl: './traslado-edicion.component.html',
  styleUrls: ['./traslado-edicion.component.scss']
})
export class TrasladoEdicionComponent implements OnInit {

  departamentos: Departamento[];
  usuarios: Usuario[];  

  
  form: FormGroup;
  mode: 'create' | 'update' = 'create';
  pidu = '10';  
  
  constructor(private dialogRef: MatDialogRef<TrasladoEdicionComponent>,
    @Inject(MAT_DIALOG_DATA) private defaults: {traslado:Traslado, tarjeta:number},
    private trasladoService: TrasladoService,
    private departamentosService: DepartamentoService,
    private usuarioService: UsuarioService,    
    private fb: FormBuilder,
    private common: CommonFunction) { }


  ngOnInit() {
    this.updateDepartamentos();
    this.updateUsuarios();    

    if (this.defaults.traslado) {
      this.mode = 'update';
    } else {
      this.defaults.traslado = {} as Traslado;      
    }

    this.form = this.fb.group({                               
      departamento: this.defaults.traslado.seccion? this.defaults.traslado.seccion.id_departamento: null,   
      fecha_inicio: this.defaults.traslado.fecha_inicio? this.common.parseDate(this.defaults.traslado.fecha_inicio) : null,      
      fecha_fin: this.defaults.traslado.fecha_fin? this.common.parseDate(this.defaults.traslado.fecha_fin) : null,             
      idUsuario: this.defaults.traslado.usuario? this.defaults.traslado.usuario.idUsuario : null                          
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
    const traslado: Traslado = this.form.value;    
    
    
    traslado.usuario = new Usuario();
    traslado.usuario.idUsuario = this.form.value.idUsuario;       

    traslado.tarjeta =  new TarjetaResponsabilidad()
    traslado.tarjeta.id_interno = this.defaults.tarjeta;    

    traslado.seccion = new Departamento();
    traslado.seccion.id_departamento = this.form.value.departamento;  
    
    traslado.fecha_inicio = this.form.value.fecha_inicio.toISOString()
    if(traslado.fecha_fin != null){
      traslado.fecha_fin = this.form.value.fecha_fin.toISOString()
    }
    
    this.trasladoService.registrar(traslado, this.pidu).subscribe(()=>{
      this.dialogRef.close(traslado);
    })
  }

  update() {
    const traslado: Traslado = this.form.value;
    traslado.id_traslado = this.defaults.traslado.id_traslado;       
    
    traslado.usuario = new Usuario();
    traslado.usuario.idUsuario = this.form.value.idUsuario;       

    traslado.tarjeta =  new TarjetaResponsabilidad()
    traslado.tarjeta.id_interno = this.defaults.tarjeta;     

    traslado.seccion = new Departamento();
    traslado.seccion.id_departamento = this.form.value.departamento;
    
    traslado.fecha_inicio = this.form.value.fecha_inicio.toISOString()
    if(traslado.fecha_fin != null){
      traslado.fecha_fin = this.form.value.fecha_fin.toISOString()
    }

    this.trasladoService.modificar(traslado, this.pidu).subscribe(()=>{
      this.dialogRef.close(traslado);
    })    
  }

  isCreateMode() {
    return this.mode === 'create';
  }

  isUpdateMode() {
    return this.mode === 'update';
  } 

  updateDepartamentos() {    
    this.departamentosService.listar(this.pidu).subscribe(data => {      
      this.departamentos = data;
    })
  }

  updateUsuarios() {
    this.usuarioService.listar(this.pidu).subscribe(data => {
      this.usuarios = data;
    })
  }
}

