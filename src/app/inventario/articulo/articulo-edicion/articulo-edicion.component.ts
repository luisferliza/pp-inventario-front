import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Articulo } from 'app/modelos/inventario/articulo';
import { Categoria } from 'app/modelos/inventario/categoria';
import { Departamento } from 'app/modelos/inventario/departamento';
import { Estado } from 'app/modelos/inventario/estado';
import { Proveedor } from 'app/modelos/inventario/proveedor';
import { TipoArticulo } from 'app/modelos/inventario/tipo-articulo';
import { CategoriaService } from 'app/servicios/inventario/categoria.service';
import { ProveedorService } from 'app/servicios/inventario/proveedor.service';
import { TipoArticuloService } from 'app/servicios/inventario/tipo-articulo.service';
import { DepartamentoService } from 'app/servicios/inventario/departamento.service';
import { EstadoService } from 'app/servicios/inventario/estado.service';
import { ArticuloService } from 'app/servicios/inventario/articulo.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CommonFunction } from 'app/inventario/shared/common';



@Component({
  selector: 'app-articulo-edicion',
  templateUrl: './articulo-edicion.component.html',
  styleUrls: ['./articulo-edicion.component.scss']
})
export class ArticuloEdicionComponent implements OnInit {
 
  categorias: Categoria[];
  departamentos: Departamento[];
  estados: Estado[] = [];
  proveedores: Proveedor[];
  tiposArticulo: TipoArticulo[];  
  activo: boolean = true;

  
  form: FormGroup;
  mode: 'create' | 'update' = 'create';
  pidu = '10';
  
  constructor(private dialogRef: MatDialogRef<ArticuloEdicionComponent>,
    @Inject(MAT_DIALOG_DATA) private defaults: Articulo,
    private articuloService: ArticuloService,
    private categoriaService: CategoriaService,
    private departamentoService: DepartamentoService,
    private estadoService: EstadoService,
    private proveedorService: ProveedorService,
    private tipoArticuloService: TipoArticuloService,
    private fb: FormBuilder,
    private common: CommonFunction) { }


  ngOnInit() {
    this.updateCategorias();
    this.updateDepartamentos();
    this.updateEstados();
    this.updateProveedores();
    this.updateTiposArticulo();

    if (this.defaults) {
      this.mode = 'update';
      this.activo = this.defaults.estado.nombre == 'Activo'? true : false;
    } else {
      this.defaults = {} as Articulo;
    }
    
    this.form = this.fb.group({                      
      descripcion: this.defaults.descripcion || '',      
      residual: this.defaults.residual || 0.05,     
      inventario: this.defaults.inventario || '',      
      fecha_compra: this.defaults.fecha_compra? this.common.parseDate(this.defaults.fecha_compra) : null,      
      precio: this.defaults.precio || 0,            
      marca: this.defaults.marca || '',            
      fungible: this.defaults.fungible || false,            
      id_categoria: this.defaults.categoria? this.defaults.categoria.id_categoria : null,            
      id_departamento: this.defaults.departamento? this.defaults.departamento.id_departamento : null,            
      id_tipo_articulo: this.defaults.tipo_articulo? this.defaults.tipo_articulo.id_tipo_articulo : null,            
      id_estado: this.defaults.estado? this.defaults.estado.id_estado : null,                           
      id_proveedor: this.defaults.proveedor? this.defaults.proveedor.id_proveedor : null            
    });
  }

  save() {    
    if (this.mode === 'create') {
      this.create();
    } else if (this.mode === 'update') {      
      this.update();
    }
  }

  esBaja(value){
    let estado = this.getStringFromValue(value);    
    if(estado == 'Activo'){
      this.activo=true;
    }else{
      this.activo=false;
    }
  }

  getStringFromValue(value:number){
    for (let index = 0; index < this.estados.length; index++) {
      const element = this.estados[index];
      if(element.id_estado == value){
        return element.nombre;
      }      
    }
    return null;
  }

  create() {    
    const articulo: Articulo = this.form.value;    
    
    articulo.categoria = new Categoria();
    articulo.categoria.id_categoria = this.form.value.id_categoria;    

    articulo.estado = new Estado();
    articulo.estado.id_estado = this.form.value.id_estado;

    articulo.proveedor = new Proveedor();
    articulo.proveedor.id_proveedor = this.form.value.id_proveedor;

    articulo.tipo_articulo = new TipoArticulo();
    articulo.tipo_articulo.id_tipo_articulo = this.form.value.id_tipo_articulo;    

    articulo.departamento = new Departamento();
    articulo.departamento.id_departamento = this.form.value.id_departamento;   

    articulo.fecha_compra = this.form.value.fecha_compra.toISOString() // Convierte la fecha
        
    this.articuloService.registrar(articulo, this.pidu).subscribe(()=>{
      this.dialogRef.close(articulo);
    })
  }

  update() {
    const articulo: Articulo = this.form.value;
    articulo.id_articulo = this.defaults.id_articulo;
    
    articulo.categoria = new Categoria();
    articulo.categoria.id_categoria = this.form.value.id_categoria;

    articulo.estado = new Estado();
    articulo.estado.id_estado = this.form.value.id_estado;

    articulo.proveedor = new Proveedor();
    articulo.proveedor.id_proveedor = this.form.value.id_proveedor;

    articulo.tipo_articulo = new TipoArticulo();
    articulo.tipo_articulo.id_tipo_articulo = this.form.value.id_tipo_articulo;  
    
    articulo.departamento = new Departamento();
    articulo.departamento.id_departamento = this.form.value.id_departamento;   
    
    articulo.fecha_compra = this.form.value.fecha_compra.toISOString() // Convierte la fecha

    this.articuloService.modificar(articulo, this.pidu).subscribe(()=>{
      this.dialogRef.close(articulo);
    })    
  }

  isCreateMode() {
    return this.mode === 'create';
  }

  isUpdateMode() {
    return this.mode === 'update';
  } 

  updateCategorias() {
    this.categoriaService.listar(this.pidu).subscribe(data => {
      this.categorias = data;
    })
  }

  updateDepartamentos() {
    this.departamentoService.listar(this.pidu).subscribe(data => {
      this.departamentos = data;
    })
  }

  updateEstados() {
    this.estadoService.listar(this.pidu).subscribe(data => {
      this.estados = data;
    })
  }

  updateProveedores() {
    this.proveedorService.listar(this.pidu).subscribe(data => {
      this.proveedores = data;
    })
  }

  updateTiposArticulo() {
    this.tipoArticuloService.listar(this.pidu).subscribe(data => {
      this.tiposArticulo = data;
    })
  }

}
