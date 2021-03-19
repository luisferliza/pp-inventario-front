import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ROUTE_TRANSITION } from 'app/app.animation';
import { ListColumn } from 'app/core/list/list-column.model';
import { ListDatabase } from 'app/core/list/list-database';
import { ListDataSource } from 'app/core/list/list-datasource';
import { List } from 'app/core/list/list.interface';
import { componentDestroyed } from 'app/core/utils/component-destroyed';
import { TipoArticulo } from 'app/modelos/inventario/tipo-articulo';
import { TipoArticuloService } from 'app/servicios/inventario/tipo-articulo.service';
import { Observable, ReplaySubject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { TipoArticuloEdicionComponent } from './tipo-articulo-edicion/tipo-articulo-edicion.component';


@Component({
  selector: 'app-tipo-articulo',
  templateUrl: './tipo-articulo.component.html',
  styleUrls: ['./tipo-articulo.component.scss'],
  animations: [...ROUTE_TRANSITION],
  host: { '[@routeTransition]': '' }
})
export class TipoArticuloComponent implements List<TipoArticulo>, OnInit, OnDestroy {

  subject$: ReplaySubject<TipoArticulo[]> = new ReplaySubject<TipoArticulo[]>(1);
  data$: Observable<TipoArticulo[]>;
  categorias: TipoArticulo[];

  @Input()
  columns: ListColumn[] = [
    { name: 'ID_TipoArticulo', property: 'id_tipo_articulo', visible: false, isModelProperty: true  },
    { name: 'Nombre', property: 'nombre', visible: true, isModelProperty: true },    
    {name: 'Actions', property: 'actions', visible: true},
  ] as ListColumn[];


  pageSize = 10;
  resultsLength: number;
  dataSource: ListDataSource<TipoArticulo> | null;
  database: ListDatabase<TipoArticulo>;
  pidu = '10';

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private tipoArticuloService: TipoArticuloService, private snackBar: MatSnackBar, private dialog: MatDialog) { }

  get visibleColumns() {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }

  ngOnInit(): void {

    this.listar();
    this.tipoArticuloService.mensajeCambio.subscribe(data => {
      this.snackBar.open(data, 'AVISO', {
        duration: 2000
      });
    });
  }

  listar() {
    this.tipoArticuloService.listar(this.pidu).subscribe(data => {      
      this.categorias = data;
      this.subject$.next(data);
      this.data$ = this.subject$.asObservable();
      this.database = new ListDatabase<TipoArticulo>();
      this.data$.pipe(
        takeUntil(componentDestroyed(this)),
        filter(Boolean)
      ).subscribe((categorias: TipoArticulo[]) => {
        this.categorias = categorias;
        this.database.dataChange.next(categorias);
        this.resultsLength = categorias.length;
      });

      this.dataSource = new ListDataSource<TipoArticulo>(this.database, this.sort, this.paginator, this.columns);
      document.getElementById('table').click();

    });
  }

  

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  create() {
    this.dialog.open(TipoArticuloEdicionComponent).afterClosed().subscribe((tipoArticulo: TipoArticulo) => {
      if (tipoArticulo) {
        this.listar();
        this.tipoArticuloService.mensajeCambio.next('Registro creado correctamente.');
      }
    });    
  }

  modify(estado) {
    this.dialog.open(TipoArticuloEdicionComponent, {
      data: estado
    }).afterClosed().subscribe(resp => {
      if (resp) {
        this.listar();
        this.tipoArticuloService.mensajeCambio.next('Registro modificado correctamente.');
      }
    });
  }

  delete(estado: TipoArticulo) {
    let idEstado = estado.id_tipo_articulo;
    this.tipoArticuloService.eliminar(idEstado, this.pidu).subscribe(() => {
      this.listar();
      this.tipoArticuloService.mensajeCambio.next('Registro eliminado correctamente.');      
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
