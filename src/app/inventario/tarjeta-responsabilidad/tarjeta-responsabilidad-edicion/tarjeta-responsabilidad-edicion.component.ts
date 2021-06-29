import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
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
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

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
  filteredOptions: Observable<Articulo[]>;
  articulo_selecionado: Articulo = null;

  constructor(private dialogRef: MatDialogRef<TarjetaResponsabilidadEdicionComponent>,
    @Inject(MAT_DIALOG_DATA) private defaults: TarjetaResponsabilidad,
    private tarjetaResponsabilidadService: TarjetaResponsabilidadService,
    private trasladoService: TrasladoService,
    private departamentoService: DepartamentoService,
    private articuloService: ArticuloService,
    private usuarioService: UsuarioService,
    private fb: FormBuilder,
    private common: CommonFunction,
    private snackBar: MatSnackBar,
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
      idTarjetaResponsabilidad: this.defaults.idTarjetaResponsabilidad || 0,
      idUsuario: this.defaults.receptor ? this.defaults.receptor.idUsuario : null,
      id_articulo: this.defaults.articulo ? this.defaults.articulo.inventario : null,
      id_departamento: this.defaults.departamento ? this.defaults.departamento.id_departamento : null
    });

    if (this.defaults.articulo) {
      this.articulo_selecionado = this.defaults.articulo;
    }

    this.filteredOptions = this.form.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
  }

  alertOption(articulo: Articulo) {
    console.log(articulo)
    this.articulo_selecionado = articulo;
  }

  removeArticulo() {
    if (this.articulo_selecionado && this.form.value.id_articulo != this.articulo_selecionado.inventario) {
      this.articulo_selecionado = null;
    }
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
    if (this.articulo_selecionado != null) {
      const tarjetaResponsabilidad: TarjetaResponsabilidad = this.form.value;

      tarjetaResponsabilidad.articulo = this.articulo_selecionado

      tarjetaResponsabilidad.departamento = new Departamento();
      tarjetaResponsabilidad.departamento.id_departamento = this.form.value.id_departamento;

      if (this.form.value.idUsuario != null) {
        tarjetaResponsabilidad.receptor = new Usuario();
        tarjetaResponsabilidad.receptor.idUsuario = this.form.value.idUsuario;
      } else {
        tarjetaResponsabilidad.receptor = null;
      }

      this.tarjetaResponsabilidadService.registrar(tarjetaResponsabilidad, this.pidu).subscribe((data) => {
        this.dialogRef.close(tarjetaResponsabilidad);
        // Automaticamente se crea el traslado
        /*
        if (data && this.form.value.idUsuario != null) {
          this.tarjetaResponsabilidadService.listarPorId(data.id_interno, this.pidu).subscribe((tarjetaData) => {
            const traslado: Traslado = new Traslado();
            traslado.fecha_fin = null;
            traslado.fecha_inicio = this.common.parseDate(tarjetaData.articulo.fecha_compra).toISOString();
  
            traslado.usuario = new Usuario();
            traslado.usuario.idUsuario = tarjetaData.receptor.idUsuario;
  
            traslado.tarjeta = new TarjetaResponsabilidad()
            traslado.tarjeta.id_interno = tarjetaData.id_interno;
  
            traslado.seccion = new Departamento();
            traslado.seccion.id_departamento = tarjetaData.departamento.id_departamento;          
  
            this.trasladoService.registrar(traslado, this.pidu).subscribe(() => {
              this.dialogRef.close(tarjetaResponsabilidad);
            })
          })
        }else{
          this.snackBar.open(`Se produjo un error al crear el traslado`, 'AVISO', {
            duration: 2000
          });
        }      
        */
      })

    } else {
      this.snackBar.open(`No se ha seleccionado el artículo`, 'AVISO', {
        duration: 2000
      });
    }
  }

  update() {
    if (this.articulo_selecionado != null) {
      const tarjetaResponsabilidad: TarjetaResponsabilidad = this.form.value;

      tarjetaResponsabilidad.articulo = this.articulo_selecionado;      

      tarjetaResponsabilidad.departamento = new Departamento();
      tarjetaResponsabilidad.departamento.id_departamento = this.form.value.id_departamento;

      if (this.form.value.idUsuario != null) {
        tarjetaResponsabilidad.receptor = new Usuario();
        tarjetaResponsabilidad.receptor.idUsuario = this.form.value.idUsuario;
      } else {
        tarjetaResponsabilidad.receptor = null;
      }
      tarjetaResponsabilidad.id_interno = this.defaults.id_interno;
      this.tarjetaResponsabilidadService.modificar(tarjetaResponsabilidad, this.pidu).subscribe(() => {
        this.dialogRef.close(tarjetaResponsabilidad);
      })

    } else {
      this.snackBar.open(`No se ha seleccionado el artículo`, 'AVISO', {
        duration: 2000
      });
    }
  }

  clearUser(){
    this.form.controls['idUsuario'].setValue(null);
  }

  isCreateMode() {
    return this.mode === 'create';
  }

  isUpdateMode() {
    return this.mode === 'update';
  }

  private _filter(value: any): Articulo[] {
    if (!this.articulos || value.id_articulo == null) {
      return [];
    }
    let filterValue;
    if (typeof value.id_articulo === "string") {
      filterValue = value.id_articulo.toLowerCase()
    } else if (value.id_articulo.inventario) {
      filterValue = value.id_articulo.inventario.toLowerCase();
    } else {
      return;
    }
    return this.articulos.filter(element => element.inventario.toLowerCase().includes(filterValue));
  }





}
