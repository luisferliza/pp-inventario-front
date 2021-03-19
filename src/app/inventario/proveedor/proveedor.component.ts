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
import { Proveedor } from 'app/modelos/inventario/proveedor';
import { ProveedorService } from 'app/servicios/inventario/proveedor.service';
import { Observable, ReplaySubject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { ProveedorEdicionComponent } from './proveedor-edicion/proveedor-edicion.component';

@Component({
  selector: 'app-proveedor',
  templateUrl: './proveedor.component.html',
  styleUrls: ['./proveedor.component.scss'],
  animations: [...ROUTE_TRANSITION],
  host: { '[@routeTransition]': '' }
})
export class ProveedorComponent implements List<Proveedor>, OnInit, OnDestroy {

  subject$: ReplaySubject<Proveedor[]> = new ReplaySubject<Proveedor[]>(1);
  data$: Observable<Proveedor[]>;
  categorias: Proveedor[];

  @Input()
  columns: ListColumn[] = [
    { name: 'ID_Proveedor', property: 'id_proveedor', visible: false, isModelProperty: true  },
    { name: 'Nombre', property: 'nombre', visible: true, isModelProperty: true },    
    { name: 'Dirección', property: 'direccion', visible: true, isModelProperty: true },  
    { name: 'Nit', property: 'nit', visible: true, isModelProperty: true },  
    { name: 'Telefono', property: 'telefono', visible: true, isModelProperty: true },  
    { name: 'Correo', property: 'email', visible: true, isModelProperty: true },  
    { name: 'Asesor de ventas', property: 'asesor', visible: true, isModelProperty: true },  
    {name: 'Actions', property: 'actions', visible: true},
  ] as ListColumn[];


  pageSize = 10;
  resultsLength: number;
  dataSource: ListDataSource<Proveedor> | null;
  database: ListDatabase<Proveedor>;
  pidu = '10';

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private proveedorService: ProveedorService, private snackBar: MatSnackBar, private dialog: MatDialog) { }

  get visibleColumns() {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }

  ngOnInit(): void {
    this.listar();
    this.proveedorService.message.subscribe(data => {
      this.snackBar.open(data, 'AVISO', {
        duration: 2000
      });
    });
  }

  listar() {
    this.proveedorService.listar(this.pidu).subscribe(data => {      
      this.categorias = data;
      this.subject$.next(data);
      this.data$ = this.subject$.asObservable();
      this.database = new ListDatabase<Proveedor>();
      this.data$.pipe(
        takeUntil(componentDestroyed(this)),
        filter(Boolean)
      ).subscribe((categorias: Proveedor[]) => {
        this.categorias = categorias;
        this.database.dataChange.next(categorias);
        this.resultsLength = categorias.length;
      });

      this.dataSource = new ListDataSource<Proveedor>(this.database, this.sort, this.paginator, this.columns);
      document.getElementById('table').click();

    });
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  create() {
    this.dialog.open(ProveedorEdicionComponent).afterClosed().subscribe((proveedor: Proveedor) => {
      if (proveedor) {
        this.listar();
        this.proveedorService.message.next('Registro creado correctamente.');
      }
    });    
  }

  modify(proveedor) {
    this.dialog.open(ProveedorEdicionComponent, {
      data: proveedor
    }).afterClosed().subscribe(resp => {
      if (resp) {
        this.listar();
        this.proveedorService.message.next('Registro modificado correctamente.');
      }
    });
  }

  delete(proveedor: Proveedor) {
    let idEstado = proveedor.id_proveedor;
    this.proveedorService.eliminar(idEstado, this.pidu).subscribe(() => {
      this.listar();
      this.proveedorService.message.next('Registro eliminado correctamente.');      
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
