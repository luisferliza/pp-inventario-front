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
import { TipoInversionEdicionComponent } from './tipo-inversion-edicion/tipo-inversion-edicion.component';
import { TipoInversion } from 'app/modelos/inversiones/tipo-inversion';
import { DeleteDialogComponent } from 'app/servicios/common/delete-dialog/delete-dialog.component';
import { TipoInversionService } from 'app/servicios/inversiones/tipo-inversion.service';

@Component({
  selector: 'elastic-tipo-inversion',
  templateUrl: './tipo-inversion.component.html',
  styleUrls: ['./tipo-inversion.component.scss'],
  animations: [...ROUTE_TRANSITION],
  host: { '[@routeTransition]': '' }
})
export class TipoInversionComponent implements List<TipoInversion>, OnInit, OnDestroy {

  subject$: ReplaySubject<TipoInversion[]> = new ReplaySubject<TipoInversion[]>(1);
  data$: Observable<TipoInversion[]>;
  tiposInversion: TipoInversion[];

  @Input()
  columns: ListColumn[] = [
    { name: 'ID_Tipo_Inversion', property: 'id_tipo_inversion', visible: false, isModelProperty: true },
    { name: 'Nombre', property: 'nombre', visible: true, isModelProperty: true },    
    { name: 'Siglas', property: 'siglas', visible: true, isModelProperty: true },    
    { name: 'Acciones', property: 'actions', visible: true },
  ] as ListColumn[];


  pageSize = 10;
  resultsLength: number;
  dataSource: ListDataSource<TipoInversion> | null;
  database: ListDatabase<TipoInversion>;
  pidu = '10';

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private tipoInversionService: TipoInversionService, private snackBar: MatSnackBar, private dialog: MatDialog) { }

  get visibleColumns() {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }

  ngOnInit(): void {
    this.listar();
    this.tipoInversionService.message.subscribe(data => {
      this.snackBar.open(data, 'AVISO', {
        duration: 2000
      });
    });
  }

  listar() {
    this.tipoInversionService.listar(this.pidu).subscribe(data => {
      this.tiposInversion = data;
      this.subject$.next(data);
      this.data$ = this.subject$.asObservable();
      this.database = new ListDatabase<TipoInversion>();
      this.data$.pipe(
        takeUntil(componentDestroyed(this)),
        filter(Boolean)
      ).subscribe((tiposInversion: TipoInversion[]) => {
        this.tiposInversion = tiposInversion;
        this.database.dataChange.next(tiposInversion);
        this.resultsLength = tiposInversion.length;
      });

      this.dataSource = new ListDataSource<TipoInversion>(this.database, this.sort, this.paginator, this.columns);
      document.getElementById('table').click();

    });
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  crear() {
    this.dialog.open(TipoInversionEdicionComponent).afterClosed().subscribe((tipoInversion: TipoInversion) => {
      if (tipoInversion) {
        this.listar();
        this.tipoInversionService.message.next('Registro creado correctamente.');
      }
    });
  }

  modificar(tipoInversion: TipoInversion) {
    this.dialog.open(TipoInversionEdicionComponent, {
      data: tipoInversion,
      width: '600px' 
    }).afterClosed().subscribe(resp => {
      if (resp) {
        this.listar();
        this.tipoInversionService.message.next('Registro modificado correctamente.');
      }
    });
  }

  eliminar(tipoInversion: TipoInversion) {
    this.dialog.open(DeleteDialogComponent).afterClosed().subscribe(resp => {
      if (resp) {
        this.tipoInversionService.eliminar(tipoInversion.id_tipo_inversion, this.pidu).subscribe(() => {
          this.listar();
          this.tipoInversionService.message.next('Registro eliminado correctamente.');
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
