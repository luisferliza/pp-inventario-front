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
import { Departamento } from 'app/modelos/inventario/departamento';
import { DepartamentoService } from 'app/servicios/inventario/departamento.service';
import { Observable, ReplaySubject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { DepartamentoEdicionComponent } from './departamento-edicion/departamento-edicion.component';

@Component({
  selector: 'app-departamento',
  templateUrl: './departamento.component.html',
  styleUrls: ['./departamento.component.scss'],
  animations: [...ROUTE_TRANSITION],
  host: { '[@routeTransition]': '' }
})
export class DepartamentoComponent implements List<Departamento>, OnInit, OnDestroy {

  subject$: ReplaySubject<Departamento[]> = new ReplaySubject<Departamento[]>(1);
  data$: Observable<Departamento[]>;
  categorias: Departamento[];

  @Input()
  columns: ListColumn[] = [
    { name: 'ID_Departamento', property: 'id_departamento', visible: false, isModelProperty: true },
    { name: 'Nombre', property: 'nombre', visible: true, isModelProperty: true },    
    {name: 'Actions', property: 'actions', visible: true},
  ] as ListColumn[];

  pageSize = 10;
  resultsLength: number;
  dataSource: ListDataSource<Departamento> | null;
  database: ListDatabase<Departamento>;
  pidu = '10';

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private departamentoService: DepartamentoService, private snackBar: MatSnackBar, private dialog: MatDialog) { }

  get visibleColumns() {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }

  ngOnInit(): void {
    this.updateData();
    this.departamentoService.message.subscribe(data => {
      this.snackBar.open(data, 'AVISO', {
        duration: 2000
      });
    });
  }


  updateData() {
    this.departamentoService.listar(this.pidu).subscribe(data => {      
      this.categorias = data;
      this.subject$.next(data);
      this.data$ = this.subject$.asObservable();
      this.database = new ListDatabase<Departamento>();
      this.data$.pipe(
        takeUntil(componentDestroyed(this)),
        filter(Boolean)
      ).subscribe((categorias: Departamento[]) => {
        this.categorias = categorias;
        this.database.dataChange.next(categorias);
        this.resultsLength = categorias.length;
      });

      this.dataSource = new ListDataSource<Departamento>(this.database, this.sort, this.paginator, this.columns);
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
    this.dialog.open(DepartamentoEdicionComponent).afterClosed().subscribe((departamento: Departamento) => {
      if (departamento) {
        this.updateData();
        this.departamentoService.message.next('Registro creado correctamente.');
      }
    });    
  }

  modify(categoria) {
    this.dialog.open(DepartamentoEdicionComponent, {
      data: categoria
    }).afterClosed().subscribe(resp => {
      if (resp) {
        this.updateData();
        this.departamentoService.message.next('Registro modificado correctamente.');
      }
    });
  }

  delete(departamento: Departamento) {
    let idDepartamento = departamento.id_departamento;
    this.departamentoService.eliminar(idDepartamento, this.pidu).subscribe(() => {
      this.updateData();
      this.departamentoService.message.next('Registro eliminado correctamente.');      
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
