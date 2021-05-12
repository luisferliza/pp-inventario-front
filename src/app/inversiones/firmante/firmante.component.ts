import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatPaginator, MatSnackBar, MatSort } from '@angular/material';
import { ListColumn } from 'app/core/list/list-column.model';
import { ListDatabase } from 'app/core/list/list-database';
import { ListDataSource } from 'app/core/list/list-datasource';
import { componentDestroyed } from 'app/core/utils/component-destroyed';
import { Firmante } from 'app/modelos/inversiones/firmante';
import { FirmanteService } from 'app/servicios/inversiones/firmante.service';
import { Observable, ReplaySubject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { FirmanteEdicionComponent } from './firmante-edicion/firmante-edicion.component';

@Component({
  selector: 'elastic-firmante',
  templateUrl: './firmante.component.html',
  styleUrls: ['./firmante.component.scss']
})
export class FirmanteComponent implements OnInit {

  subject$: ReplaySubject<Firmante[]> = new ReplaySubject<Firmante[]>(1);
  data$: Observable<Firmante[]>;
  firmantes: Firmante[];

  @Input()
  columns: ListColumn[] = [
    { name: 'ID_Firmante', property: 'id_firmante', visible: false, isModelProperty: true },
    { name: 'Puesto', property: 'puesto', visible: true, isModelProperty: true },
    { name: 'Nombre', property: 'nombre', visible: true, isModelProperty: true },    
    { name: 'Texto desplegable', property: 'despliegue', visible: true, isModelProperty: true },        
    { name: 'Acciones', property: 'actions', visible: true },
  ] as ListColumn[];


  pageSize = 10;
  resultsLength: number;
  dataSource: ListDataSource<Firmante> | null;
  database: ListDatabase<Firmante>;
  pidu = '10';

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private firmanteService: FirmanteService, private snackBar: MatSnackBar, private dialog: MatDialog) { }

  get visibleColumns() {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }

  ngOnInit(): void {

    this.listar();
    this.firmanteService.message.subscribe(data => {
      this.snackBar.open(data, 'AVISO', {
        duration: 2000
      });
    });
  }

  listar() {
    this.firmanteService.listar(this.pidu).subscribe(data => {
      this.firmantes = data;
      this.subject$.next(data);
      this.data$ = this.subject$.asObservable();
      this.database = new ListDatabase<Firmante>();
      this.data$.pipe(
        takeUntil(componentDestroyed(this)),
        filter(Boolean)
      ).subscribe((firmantes: Firmante[]) => {        
        this.firmantes = firmantes;
        this.database.dataChange.next(firmantes);
        this.resultsLength = firmantes.length;
      });

      this.dataSource = new ListDataSource<Firmante>(this.database, this.sort, this.paginator, this.columns);
      document.getElementById('table').click();
      
    });
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }


  modificar(estado) {    
    this.dialog.open(FirmanteEdicionComponent, {
      data: estado
    }).afterClosed().subscribe(resp => {
      if (resp) {
        this.listar();
        this.firmanteService.message.next('Registro modificado correctamente.');
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
