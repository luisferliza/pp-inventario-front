import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { CategoriaEdicionComponent } from './categoria-edicion/categoria-edicion.component';
import { Categoria } from 'app/modelos/inventario/categoria';
import { CategoriaService } from 'app/servicios/inventario/categoria.service';
import { ROUTE_TRANSITION } from 'app/app.animation';
import { ListColumn } from 'app/core/list/list-column.model';
import { ListDataSource } from 'app/core/list/list-datasource';
import { ListDatabase } from 'app/core/list/list-database';
import { Observable, ReplaySubject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { componentDestroyed } from 'app/core/utils/component-destroyed';
import { List } from 'app/core/list/list.interface';

@Component({
  selector: 'app-categoria',
  templateUrl: './categoria.component.html',
  styleUrls: ['./categoria.component.scss'],
  animations: [...ROUTE_TRANSITION],
  host: { '[@routeTransition]': '' }
})
export class CategoriaComponent implements List<Categoria>, OnInit, OnDestroy {

  subject$: ReplaySubject<Categoria[]> = new ReplaySubject<Categoria[]>(1);
  data$: Observable<Categoria[]>;
  categorias: Categoria[];

  @Input()
  columns: ListColumn[] = [
    { name: 'ID_Categoria', property: 'id_categoria', visible: false },
    { name: 'Nombre', property: 'nombre', visible: true, isModelProperty: true },
    { name: 'Depreciación', property: 'depreciacion', visible: true},
    {name: 'Actions', property: 'actions', visible: true},
  ] as ListColumn[];


  pageSize = 10;
  resultsLength: number;
  dataSource: ListDataSource<Categoria> | null;
  database: ListDatabase<Categoria>;
  pidu = '10';

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private categoriaService: CategoriaService, private snackBar: MatSnackBar, private dialog: MatDialog) { }

  get visibleColumns() {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }

  ngOnInit(): void {

    this.updateData();
    this.categoriaService.message.subscribe(data => {
      this.snackBar.open(data, 'AVISO', {
        duration: 2000
      });
    });
  }

  updateData() {
    this.categoriaService.listar(this.pidu).subscribe(data => {      
      this.categorias = data;
      this.subject$.next(data);
      this.data$ = this.subject$.asObservable();
      this.database = new ListDatabase<Categoria>();
      this.data$.pipe(
        takeUntil(componentDestroyed(this)),
        filter(Boolean)
      ).subscribe((categorias: Categoria[]) => {
        this.categorias = categorias;
        this.database.dataChange.next(categorias);
        this.resultsLength = categorias.length;
      });

      this.dataSource = new ListDataSource<Categoria>(this.database, this.sort, this.paginator, this.columns);
      document.getElementById('table').click();

    });
  }

  

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  getDesc(depreciacion: number) {
    if (depreciacion === 0) {
      return "Sin depreciacion";
    } else if (depreciacion === 1) {
      return "1 Año"
    } else {
      return `${depreciacion} años`
    }
  }

  create() {
    this.dialog.open(CategoriaEdicionComponent).afterClosed().subscribe((customer: Categoria) => {
      if (customer) {
        this.updateData();
        this.categoriaService.message.next('Registro creado correctamente.');
      }
    });    
  }

  modify(categoria) {
    this.dialog.open(CategoriaEdicionComponent, {
      data: categoria
    }).afterClosed().subscribe(resp => {
      if (resp) {
        this.updateData();
        this.categoriaService.message.next('Registro modificado correctamente.');
      }
    });
  }

  delete(categoria: Categoria) {
    let idCategoria = categoria.id_categoria;
    this.categoriaService.eliminar(idCategoria, this.pidu).subscribe(() => {
      this.updateData();
      this.categoriaService.message.next('Registro eliminado correctamente.');      
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
