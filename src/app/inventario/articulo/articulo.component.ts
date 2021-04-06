import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { ROUTE_TRANSITION } from 'app/app.animation';
import { ListColumn } from 'app/core/list/list-column.model';
import { ListDatabase } from 'app/core/list/list-database';
import { ListDataSource } from 'app/core/list/list-datasource';
import { List } from 'app/core/list/list.interface';
import { componentDestroyed } from 'app/core/utils/component-destroyed';
import { Articulo } from 'app/modelos/inventario/articulo';
import { ArticuloService } from 'app/servicios/inventario/articulo.service';
import { Observable, ReplaySubject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { CommonFunction } from '../shared/common';
import { ArticuloEdicionComponent } from './articulo-edicion/articulo-edicion.component';

@Component({
  selector: 'app-articulo',
  templateUrl: './articulo.component.html',
  styleUrls: ['./articulo.component.scss'],
  animations: [...ROUTE_TRANSITION],
  host: { '[@routeTransition]': '' }
})
export class ArticuloComponent implements List<Articulo>, OnInit, OnDestroy {

  subject$: ReplaySubject<Articulo[]> = new ReplaySubject<Articulo[]>(1);
  data$: Observable<Articulo[]>;
  articulos: Articulo[];

  @Input()
  columns: ListColumn[] = [
    { name: 'ID_Estado', property: 'id_articulo', visible: false, isModelProperty: true },    
    { name: 'No. inventario', property: 'inventario', visible: true, isModelProperty: true },
    { name: 'Descripción', property: 'descripcion', visible: true, isModelProperty: true },      
    { name: 'Precio', property: 'precio', visible: true, isModelProperty: true },
    { name: 'Marca', property: 'marca', visible: true, isModelProperty: true },
    { name: 'Tipo de bien', property: 'fungible', visible: false},
    { name: 'Fecha de compra', property: 'fecha_compra', visible: true},    
    { name: 'Categoría', property: 'categoria', visible: false},    
    { name: 'Tipo de artículo', property: 'tipo_articulo', visible: false},
    { name: 'Estado', property: 'estado', visible: false},    
    { name: 'Proveedor', property: 'proveedor', visible: false},    
    { name: 'Departamento', property: 'departamento', visible: false},    
    { name: 'Acciones', property: 'actions', visible: true },
  ] as ListColumn[];


  pageSize = 10;
  resultsLength: number;
  dataSource: ListDataSource<Articulo> | null;
  database: ListDatabase<Articulo>;
  pidu = '10';

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private articuloService: ArticuloService, 
              private snackBar: MatSnackBar, 
              private dialog: MatDialog,
              public common: CommonFunction) { }

  get visibleColumns() {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }

  ngOnInit(): void {

    this.updateData();
    this.articuloService.message.subscribe(data => {
      this.snackBar.open(data, 'AVISO', {
        duration: 2000
      });
    });
  }

  updateData() {
    this.articuloService.listar(this.pidu).subscribe(data => {
      this.articulos = data;
      this.subject$.next(data);
      this.data$ = this.subject$.asObservable();
      this.database = new ListDatabase<Articulo>();
      this.data$.pipe(
        takeUntil(componentDestroyed(this)),
        filter(Boolean)
      ).subscribe((categorias: Articulo[]) => {
        this.articulos = categorias;
        this.database.dataChange.next(categorias);
        this.resultsLength = categorias.length;
      });

      this.dataSource = new ListDataSource<Articulo>(this.database, this.sort, this.paginator, this.columns);
      document.getElementById('table').click();
      
    });
  }



  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  create() {    
    this.dialog.open(ArticuloEdicionComponent).afterClosed().subscribe((articulo: Articulo) => {
      if (articulo) {
        this.updateData();
        this.articuloService.message.next('Registro creado correctamente.');
      }
    });    
  }

  modify(estado) {    
    this.dialog.open(ArticuloEdicionComponent, {
      data: estado
    }).afterClosed().subscribe(resp => {
      if (resp) {
        this.updateData();
        this.articuloService.message.next('Registro modificado correctamente.');
      }
    });    
  }

  delete(articulo: Articulo) {
    let idArticulo = articulo.id_articulo;
    this.articuloService.eliminar(idArticulo, this.pidu).subscribe(() => {
      this.updateData();
      this.articuloService.message.next('Registro eliminado correctamente.');
    });
  }


  onFilterChange(value) {
    if (!this.dataSource) {
      return;
    }
    this.dataSource.filter = value;
  }

  ngOnDestroy(): void {
  }

}
