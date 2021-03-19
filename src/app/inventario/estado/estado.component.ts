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
import { Estado } from 'app/modelos/inventario/estado';
import { EstadoService } from 'app/servicios/inventario/estado.service';
import { Observable, ReplaySubject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { EstadoEdicionComponent } from './estado-edicion/estado-edicion.component';

@Component({
  selector: 'app-estado',
  templateUrl: './estado.component.html',
  styleUrls: ['./estado.component.scss'],
  animations: [...ROUTE_TRANSITION],
  host: { '[@routeTransition]': '' }
})
export class EstadoComponent implements List<Estado>, OnInit, OnDestroy {

  subject$: ReplaySubject<Estado[]> = new ReplaySubject<Estado[]>(1);
  data$: Observable<Estado[]>;
  estados: Estado[];

  @Input()
  columns: ListColumn[] = [
    { name: 'ID_Estado', property: 'id_estado', visible: false, isModelProperty: true  },
    { name: 'Nombre', property: 'nombre', visible: true, isModelProperty: true },    
    {name: 'Actions', property: 'actions', visible: true},
  ] as ListColumn[];


  pageSize = 10;
  resultsLength: number;
  dataSource: ListDataSource<Estado> | null;
  database: ListDatabase<Estado>;
  pidu = '10';

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private estadoService: EstadoService, private snackBar: MatSnackBar, private dialog: MatDialog) { }

  get visibleColumns() {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }

  ngOnInit(): void {
    this.listar();
    this.estadoService.message.subscribe(data => {
      this.snackBar.open(data, 'AVISO', {
        duration: 2000
      });
    });
  }

  listar() {
    this.estadoService.listar(this.pidu).subscribe(data => {      
      this.estados = data;
      this.subject$.next(data);
      this.data$ = this.subject$.asObservable();
      this.database = new ListDatabase<Estado>();
      this.data$.pipe(
        takeUntil(componentDestroyed(this)),
        filter(Boolean)
      ).subscribe((estados: Estado[]) => {        
        this.estados = estados;
        this.database.dataChange.next(estados);
        this.resultsLength = estados.length;
      });

      this.dataSource = new ListDataSource<Estado>(this.database, this.sort, this.paginator, this.columns);
      document.getElementById('table').click();

    });
  }

  

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  create() {
    this.dialog.open(EstadoEdicionComponent).afterClosed().subscribe((estado: Estado) => {
      if (estado) {
        this.listar();
        this.estadoService.message.next('Registro creado correctamente.');
      }
    });    
  }

  modify(estado: Estado) {
    if(!estado.editable){
      this.snackBar.open('Este registro no se puede modificar', 'AVISO', {
        duration: 2000
      });
      return;      
    }
    
    this.dialog.open(EstadoEdicionComponent, { 
      data: estado
    }).afterClosed().subscribe(resp => {
      if (resp) {
        this.listar();
        this.estadoService.message.next('Registro modificado correctamente.');
      }
    });
  }

  delete(estado: Estado) {
    let idEstado = estado.id_estado;
    this.estadoService.eliminar(idEstado, this.pidu).subscribe(() => {
      this.listar();
      this.estadoService.message.next('Registro eliminado correctamente.');      
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
