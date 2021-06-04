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
import { Banco } from 'app/modelos/inversiones/banco';
import { BancoService } from 'app/servicios/inversiones/banco.service';
import { Observable, ReplaySubject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { BancoEdicionComponent } from './banco-edicion/banco-edicion.component';
import { DeleteDialogComponent } from 'app/servicios/common/delete-dialog/delete-dialog.component';

@Component({
  selector: 'elastic-banco',
  templateUrl: './banco.component.html',
  styleUrls: ['./banco.component.scss'],
  animations: [...ROUTE_TRANSITION],
  host: { '[@routeTransition]': '' }
})
export class BancoComponent implements List<Banco>, OnInit, OnDestroy {

  subject$: ReplaySubject<Banco[]> = new ReplaySubject<Banco[]>(1);
  data$: Observable<Banco[]>;
  Bancos: Banco[];

  @Input()
  columns: ListColumn[] = [
    { name: 'ID_Banco', property: 'id_banco', visible: false, isModelProperty: true },
    { name: 'Nombre', property: 'nombre', visible: true, isModelProperty: true },
    { name: 'No. Anexo', property: 'anexo', visible: true, isModelProperty: true },
    { name: 'Contacto', property: 'contacto', visible: true, isModelProperty: true },
    { name: 'Dirección', property: 'direccion', visible: true, isModelProperty: true },
    { name: 'Teléfono', property: 'telefono', visible: true, isModelProperty: true },
    { name: 'Nombre Gerente', property: 'nombre_gerente', visible: true, isModelProperty: true },
    { name: 'Título Gerente', property: 'titulo_gerente', visible: true, isModelProperty: true },
    { name: 'Tipo de entidad', property: 'tipo_Entidad', visible: true, isModelProperty: false },
    { name: 'Acciones', property: 'actions', visible: true },
  ] as ListColumn[];


  pageSize = 10;
  resultsLength: number;
  dataSource: ListDataSource<Banco> | null;
  database: ListDatabase<Banco>;
  pidu = '10';

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private BancoService: BancoService, private snackBar: MatSnackBar, private dialog: MatDialog) { }

  get visibleColumns() {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }

  ngOnInit(): void {

    this.listar();
    this.BancoService.message.subscribe(data => {
      this.snackBar.open(data, 'AVISO', {
        duration: 2000
      });
    });
  }

  listar() {
    this.BancoService.listar(this.pidu).subscribe(data => {
      this.Bancos = data;
      this.subject$.next(data);
      this.data$ = this.subject$.asObservable();
      this.database = new ListDatabase<Banco>();
      this.data$.pipe(
        takeUntil(componentDestroyed(this)),
        filter(Boolean)
      ).subscribe((bancos: Banco[]) => {
        this.Bancos = bancos;
        this.database.dataChange.next(bancos);
        this.resultsLength = bancos.length;
      });

      this.dataSource = new ListDataSource<Banco>(this.database, this.sort, this.paginator, this.columns);
      document.getElementById('table').click();

    });
  }



  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  crear() {
    this.dialog.open(BancoEdicionComponent).afterClosed().subscribe((Banco: Banco) => {
      if (Banco) {
        this.listar();
        this.BancoService.message.next('Registro creado correctamente.');
      }
    });
  }

  modificar(estado) {
    this.dialog.open(BancoEdicionComponent, {
      data: estado
    }).afterClosed().subscribe(resp => {
      if (resp) {
        this.listar();
        this.BancoService.message.next('Registro modificado correctamente.');
      }
    });
  }

  eliminar(Banco: Banco) {
    this.dialog.open(DeleteDialogComponent).afterClosed().subscribe(resp => {
      if (resp) {
        this.BancoService.eliminar(Banco.id_banco, this.pidu).subscribe(() => {
          this.listar();
          this.BancoService.message.next('Registro eliminado correctamente.');
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


