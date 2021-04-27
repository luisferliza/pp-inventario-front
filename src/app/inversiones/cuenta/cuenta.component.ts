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
import { Cuenta } from 'app/modelos/inversiones/cuenta';
import { CuentaService } from 'app/servicios/inversiones/cuenta.service';
import { Observable, ReplaySubject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { CuentaEdicionComponent } from './cuenta-edicion/cuenta-edicion.component';

@Component({
  selector: 'elastic-cuenta',
  templateUrl: './cuenta.component.html',
  styleUrls: ['./cuenta.component.scss'],
  animations: [...ROUTE_TRANSITION],
  host: { '[@routeTransition]': '' }
})
export class CuentaComponent implements List<Cuenta>, OnInit, OnDestroy {

  subject$: ReplaySubject<Cuenta[]> = new ReplaySubject<Cuenta[]>(1);
  data$: Observable<Cuenta[]>;
  cuentas: Cuenta[];

  @Input()
  columns: ListColumn[] = [
    { name: 'ID_Cuenta', property: 'id_cuenta', visible: false, isModelProperty: true },
    { name: 'Número', property: 'numero', visible: true, isModelProperty: true },
    { name: 'Nombre', property: 'nombre', visible: true, isModelProperty: true },    
    { name: 'Estado', property: 'activa', visible: true, isModelProperty: false },
    { name: 'Tipo de Cuenta', property: 'tipo_Cuenta', visible: true, isModelProperty: false },    
    { name: 'Acciones', property: 'actions', visible: true },
  ] as ListColumn[];


  pageSize = 10;
  resultsLength: number;
  dataSource: ListDataSource<Cuenta> | null;
  database: ListDatabase<Cuenta>;
  pidu = '10';

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private cuentaService: CuentaService, private snackBar: MatSnackBar, private dialog: MatDialog) { }

  get visibleColumns() {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }

  ngOnInit(): void {

    this.listar();
    this.cuentaService.message.subscribe(data => {
      this.snackBar.open(data, 'AVISO', {
        duration: 2000
      });
    });
  }

  listar() {
    this.cuentaService.listar(this.pidu).subscribe(data => {
      this.cuentas = data;
      this.subject$.next(data);
      this.data$ = this.subject$.asObservable();
      this.database = new ListDatabase<Cuenta>();
      this.data$.pipe(
        takeUntil(componentDestroyed(this)),
        filter(Boolean)
      ).subscribe((cuentas: Cuenta[]) => {        
        this.cuentas = cuentas;
        this.database.dataChange.next(cuentas);
        this.resultsLength = cuentas.length;
      });

      this.dataSource = new ListDataSource<Cuenta>(this.database, this.sort, this.paginator, this.columns);
      document.getElementById('table').click();
      
    });
  }



  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  crear() {        
    this.dialog.open(CuentaEdicionComponent).afterClosed().subscribe((cuenta: Cuenta) => {
      if (cuenta) {
        this.listar();
        this.cuentaService.message.next('Registro creado correctamente.');
      }
    });    
  }

  modificar(estado) {    
    this.dialog.open(CuentaEdicionComponent, {
      data: estado
    }).afterClosed().subscribe(resp => {
      if (resp) {
        this.listar();
        this.cuentaService.message.next('Registro modificado correctamente.');
      }
    });    
  }

  eliminar(cuenta: Cuenta) {
    let idCuenta = cuenta.id_cuenta;
    this.cuentaService.eliminar(idCuenta, this.pidu).subscribe(() => {
      this.listar();
      this.cuentaService.message.next('Registro eliminado correctamente.');
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
