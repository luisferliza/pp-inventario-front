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
import { Observable, ReplaySubject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { DeleteDialogComponent } from 'app/servicios/common/delete-dialog/delete-dialog.component';
import { Condicion } from 'app/modelos/inventario/condicion';
import { CondicionService } from 'app/servicios/inventario/condicion.service';
import { CondicionEdicionComponent } from './condicion-edicion/condicion-edicion.component';


@Component({
  selector: 'elastic-condicion',
  templateUrl: './condicion.component.html',
  animations: [...ROUTE_TRANSITION],
  styleUrls: ['./condicion.component.scss']
})
export class CondicionComponent implements List<Condicion>, OnInit, OnDestroy {

  subject$: ReplaySubject<Condicion[]> = new ReplaySubject<Condicion[]>(1);
  data$: Observable<Condicion[]>;
  condiciones: Condicion[];

  @Input()
  columns: ListColumn[] = [
    { name: 'ID_Condicion', property: 'id_condicion', visible: false, isModelProperty: true },
    { name: 'Nombre', property: 'nombre', visible: true, isModelProperty: true },
    { name: 'Actions', property: 'actions', visible: true },
  ] as ListColumn[];

  pageSize = 10;
  resultsLength: number;
  dataSource: ListDataSource<Condicion> | null;
  database: ListDatabase<Condicion>;
  pidu = '10';

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private condicionService: CondicionService, private snackBar: MatSnackBar, private dialog: MatDialog) { }

  get visibleColumns() {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }

  ngOnInit(): void {
    this.updateData();
    this.condicionService.message.subscribe(data => {
      this.snackBar.open(data, 'AVISO', {
        duration: 2000
      });
    });
  }


  updateData() {
    this.condicionService.listar(this.pidu).subscribe(data => {
      this.condiciones = data;
      this.subject$.next(data);
      this.data$ = this.subject$.asObservable();
      this.database = new ListDatabase<Condicion>();
      this.data$.pipe(
        takeUntil(componentDestroyed(this)),
        filter(Boolean)
      ).subscribe((condiciones: Condicion[]) => {
        this.condiciones = condiciones;
        this.database.dataChange.next(condiciones);
        this.resultsLength = condiciones.length;
      });

      this.dataSource = new ListDataSource<Condicion>(this.database, this.sort, this.paginator, this.columns);
      document.getElementById('table').click();

    });
  }



  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }


  create() {
    this.dialog.open(CondicionEdicionComponent).afterClosed().subscribe((condiciones: Condicion) => {
      if (condiciones) {
        this.updateData();
        this.condicionService.message.next('Registro creado correctamente.');
      }
    });
  }

  modify(condicion) {
    this.dialog.open(CondicionEdicionComponent, {
      data: condicion
    }).afterClosed().subscribe(resp => {
      if (resp) {
        this.updateData();
        this.condicionService.message.next('Registro modificado correctamente.');
      }
    });
  }

  delete(condicion: Condicion) {
    this.dialog.open(DeleteDialogComponent).afterClosed().subscribe(resp => {
      if (resp) {
        let idCondicion = condicion.id_condicion;
        this.condicionService.eliminar(idCondicion, this.pidu).subscribe(() => {
          this.updateData();
          this.condicionService.message.next('Registro eliminado correctamente.');
        });
      }
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
