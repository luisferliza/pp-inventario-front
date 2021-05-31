import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Articulo } from 'app/modelos/inventario/articulo';
import { Departamento } from 'app/modelos/inventario/departamento';
import { TarjetaResponsabilidad } from 'app/modelos/inventario/tarjeta-responsabilidad';
import { Traslado } from 'app/modelos/inventario/traslado';
import { Usuario } from 'app/modelos/inventario/usuario';
import { ArticuloService } from 'app/servicios/inventario/articulo.service';
import { DepartamentoService } from 'app/servicios/inventario/departamento.service';
import { TarjetaResponsabilidadService } from 'app/servicios/inventario/tarjeta-responsabilidad.service';
import { TrasladoService } from 'app/servicios/inventario/traslado.service';
import { UsuarioService } from 'app/servicios/inventario/usuario.service';
import { CommonFunction } from 'app/inventario/shared/common';

@Component({
  selector: 'elastic-tarjeta-responsabilidad-edicion',
  templateUrl: './tarjeta-responsabilidad-edicion.component.html',
  styleUrls: ['./tarjeta-responsabilidad-edicion.component.scss']
})
export class TarjetaResponsabilidadEdicionComponent implements OnInit {

  form: FormGroup;
  mode: 'create' | 'update' = 'create';
  pidu = '10';
  articulos: Articulo[];
  departamentos: Departamento[];
  usuarios: Usuario[];

  constructor(private dialogRef: MatDialogRef<TarjetaResponsabilidadEdicionComponent>,
    @Inject(MAT_DIALOG_DATA) private defaults: TarjetaResponsabilidad,
    private tarjetaResponsabilidadService: TarjetaResponsabilidadService,
    private trasladoService: TrasladoService,
    private departamentoService: DepartamentoService,
    private articuloService: ArticuloService,
    private usuarioService: UsuarioService,
    private fb: FormBuilder,
    private common: CommonFunction
  ) { }


  ngOnInit() {
    this.updateArticulos();
    this.updateDepartamentos();
    this.updateUsuarios();

    if (this.defaults) {
      this.mode = 'update';
    } else {
      this.defaults = {} as TarjetaResponsabilidad;
    }

    this.form = this.fb.group({
      id_tarjeta_responsabilidad: this.defaults.id_tarjeta_responsabilidad || 0,
      registro: this.defaults.receptor ? this.defaults.receptor.registro : null,
      id_articulo: this.defaults.articulo ? this.defaults.articulo.id_articulo : null,
      id_departamento: this.defaults.departamento ? this.defaults.departamento.id_departamento : null
    });
  }

  save() {
    if (this.mode === 'create') {
      this.create();
    } else if (this.mode === 'update') {
      this.update();
    }
  }

  updateArticulos() {
    this.articuloService.listarActivos(this.pidu).subscribe(data => {
      this.articulos = data;
    })
  }

  updateDepartamentos() {
    this.departamentoService.listar(this.pidu).subscribe(data => {
      this.departamentos = data;
    })
  }

  updateUsuarios() {
    this.usuarioService.listar(this.pidu).subscribe(data => {
      this.usuarios = data;
    })
  }

  create() {
    const tarjetaResponsabilidad: TarjetaResponsabilidad = this.form.value;

    tarjetaResponsabilidad.articulo = new Articulo();
    tarjetaResponsabilidad.articulo.id_articulo = this.form.value.id_articulo;

    tarjetaResponsabilidad.departamento = new Departamento();
    tarjetaResponsabilidad.departamento.id_departamento = this.form.value.id_departamento;

    tarjetaResponsabilidad.receptor = new Usuario();
    tarjetaResponsabilidad.receptor.registro = this.form.value.registro;

    this.tarjetaResponsabilidadService.registrar(tarjetaResponsabilidad, this.pidu).subscribe((data) => {
      /* Automaticamente se crea el traslado*/
      this.tarjetaResponsabilidadService.listarPorId(data.id_interno, this.pidu).subscribe((data) => {        
        const traslado: Traslado = new Traslado();
        traslado.fecha_fin = null;
        traslado.fecha_inicio = this.common.parseDate(data.articulo.fecha_compra).toISOString();

        traslado.usuario = new Usuario();
        traslado.usuario.registro = data.receptor.registro;

        traslado.tarjeta = new TarjetaResponsabilidad()
        traslado.tarjeta.id_interno = data.id_interno;

        traslado.seccion = new Departamento();
        traslado.seccion.id_departamento = data.departamento.id_departamento;
        
        this.trasladoService.registrar(traslado, this.pidu).subscribe(()=>{
          this.dialogRef.close(tarjetaResponsabilidad);  
        })        
      })
    })
  }

  update() {
    const tarjetaResponsabilidad: TarjetaResponsabilidad = this.form.value;

    tarjetaResponsabilidad.articulo = new Articulo();
    tarjetaResponsabilidad.articulo.id_articulo = this.form.value.id_articulo;

    tarjetaResponsabilidad.departamento = new Departamento();
    tarjetaResponsabilidad.departamento.id_departamento = this.form.value.id_departamento;

    tarjetaResponsabilidad.receptor = new Usuario();
    tarjetaResponsabilidad.receptor.registro = this.form.value.registro;

    tarjetaResponsabilidad.id_interno = this.defaults.id_interno;
    this.tarjetaResponsabilidadService.modificar(tarjetaResponsabilidad, this.pidu).subscribe(() => {
      this.dialogRef.close(tarjetaResponsabilidad);
    })
  }

  isCreateMode() {
    return this.mode === 'create';
  }

  isUpdateMode() {
    return this.mode === 'update';
  }



}
