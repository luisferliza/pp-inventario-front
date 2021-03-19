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
import { InversionEdicionComponent } from './inversion-edicion/inversion-edicion.component';


@Component({
  selector: 'elastic-inversion',
  templateUrl: './inversion.component.html',
  styleUrls: ['./inversion.component.scss'],
  animations: [...ROUTE_TRANSITION],
  host: { '[@routeTransition]': '' }
})
export class InversionComponent implements List<Articulo>, OnInit, OnDestroy {

  subject$: ReplaySubject<Articulo[]> = new ReplaySubject<Articulo[]>(1);
  data$: Observable<Articulo[]>;
  articulos: Articulo[];

  @Input()
  columns: ListColumn[] = [
    { name: 'ID_Inversion', property: 'p1', visible: false, isModelProperty: true },
    { name: 'Registro', property: 'p2', visible: true, isModelProperty: true },
    { name: 'Monto', property: 'p3', visible: true, isModelProperty: true },    
    { name: 'Fecha de inicio', property: 'p4', visible: true, isModelProperty: true },
    { name: 'Fecha de fin', property: 'p5', visible: true, isModelProperty: true },
    { name: 'Días calendario', property: 'p6', visible: true, isModelProperty: true },
    { name: 'Plazo', property: 'p7', visible: true, isModelProperty: true },
    { name: 'Tasa', property: 'p8', visible: true, isModelProperty: true },    
    { name: 'Estado', property: 'p9', visible: true, isModelProperty: true },
    { name: 'Poliza', property: 'p10', visible: true, isModelProperty: true },
    { name: 'Comentario', property: 'p11', visible: true, isModelProperty: true },
    { name: 'Acta', property: 'p12', visible: true, isModelProperty: true },
    { name: 'Tipo de Inversion', property: 'p13', visible: true, isModelProperty: true },
    { name: 'Encargado', property: 'p14', visible: true, isModelProperty: true },
    { name: 'Cuenta', property: 'p15', visible: true, isModelProperty: true },
    { name: 'Plazo', property: 'p16', visible: true, isModelProperty: true },
    { name: 'Acciones', property: 'actions', visible: true },
  ] as ListColumn[];


  pageSize = 10;
  resultsLength: number;
  dataSource: ListDataSource<Articulo> | null;
  database: ListDatabase<Articulo>;
  pidu = '10';

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private articuloService: ArticuloService, private snackBar: MatSnackBar, private dialog: MatDialog) { }

  get visibleColumns() {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }

  ngOnInit(): void {

    this.listar();
    this.articuloService.message.subscribe(data => {
      this.snackBar.open(data, 'AVISO', {
        duration: 2000
      });
    });
  }

  listar() {
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

  crear() {        
    this.dialog.open(InversionEdicionComponent).afterClosed().subscribe((articulo: Articulo) => {
      if (articulo) {
        this.listar();
        this.articuloService.message.next('Registro creado correctamente.');
      }
    });    
  }

  modificar(estado) {    
    this.dialog.open(InversionEdicionComponent, {
      data: estado
    }).afterClosed().subscribe(resp => {
      if (resp) {
        this.listar();
        this.articuloService.message.next('Registro modificado correctamente.');
      }
    });    
  }

  eliminar(articulo: Articulo) {
    let idArticulo = articulo.id_articulo;
    this.articuloService.eliminar(idArticulo, this.pidu).subscribe(() => {
      this.listar();
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
