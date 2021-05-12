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
import { CommonFunction } from 'app/inventario/shared/common';
import { Articulo } from 'app/modelos/inventario/articulo';
import { Inversion } from 'app/modelos/inversiones/inversion';
import { BancoService } from 'app/servicios/inversiones/banco.service';
import { CuentaService } from 'app/servicios/inversiones/cuenta.service';
import { InversionService } from 'app/servicios/inversiones/inversion.service';
import { TipoEntidadService } from 'app/servicios/inversiones/tipo-entidad.service';
import { TipoInversionService } from 'app/servicios/inversiones/tipo-inversion.service';
import { Observable, ReplaySubject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { CartaDesinversionAnticipadaDialogComponent } from './carta-desinversion-anticipada-dialog/carta-desinversion-anticipada-dialog.component';
import { CartaDesinversionDialogComponent } from './carta-desinversion-dialog/carta-desinversion-dialog.component';
import { CartaInversionDialogComponent } from './carta-inversion-dialog/carta-inversion-dialog.component';
import { CartaReinversionDialogComponent } from './carta-reinversion-dialog/carta-reinversion-dialog.component';
import { InversionEdicionComponent } from './inversion-edicion/inversion-edicion.component';
//import { DocumentCreator } from './cartas/carta-inversion';
// import { Packer } from "docx";
// import { writeFileSync} from "fs"; 


@Component({
  selector: 'elastic-inversion',
  templateUrl: './inversion.component.html',
  styleUrls: ['./inversion.component.scss'],
  animations: [...ROUTE_TRANSITION],
  host: { '[@routeTransition]': '' }
})
export class InversionComponent implements List<Inversion>, OnInit, OnDestroy {

  subject$: ReplaySubject<Inversion[]> = new ReplaySubject<Inversion[]>(1);
  data$: Observable<Inversion[]>;
  inversiones: Inversion[];

  @Input()
  columns: ListColumn[] = [
    { name: 'ID_Inversion', property: 'id_inversion', visible: false, isModelProperty: true },
    { name: 'Referencia', property: 'referencia', visible: true, isModelProperty: true },
    { name: 'Monto', property: 'monto', visible: true, isModelProperty: false },
    { name: 'No. Inversión', property: 'no_inversion', visible: true, isModelProperty: true },
    { name: 'Acta JAPP', property: 'acta_japp', visible: true, isModelProperty: true },
    { name: 'Tasa', property: 'tasa_interes', visible: true, isModelProperty: true },
    { name: 'Plazo (Días)', property: 'plazo', visible: true, isModelProperty: true },    
    { name: 'No. de cuenta', property: 'cuenta', visible: true, isModelProperty: true },
    { name: 'Días anuales', property: 'dias_anuales', visible: true, isModelProperty: true },    
    { name: 'Periodo de pago', property: 'periodo_pago', visible: true, isModelProperty: true },
    { name: 'Fecha de colocación', property: 'fecha_colocacion', visible: true, isModelProperty: false },
    { name: 'Fecha de acta', property: 'fecha_acta', visible: false, isModelProperty: false },    
    { name: 'Fecha de vencimiento', property: 'vencimiento', visible: true, isModelProperty: false },
    { name: 'Tipo de inversión', property: 'tipo_Inversion', visible: false, isModelProperty: false },
    { name: 'Banco', property: 'banco', visible: true, isModelProperty: false },
    { name: 'Cuenta de inversión', property: 'inversion', visible: false, isModelProperty: false },
    { name: 'Cuenta de provisión', property: 'provision', visible: false, isModelProperty: false },
    { name: 'Cuenta de interés', property: 'interes', visible: false, isModelProperty: false },
    { name: 'Cálculo especial', property: 'calculo_especial', visible: false, isModelProperty: false },
    { name: 'Observación', property: 'observacion', visible: false, isModelProperty: true },
    { name: 'Acciones', property: 'actions', visible: true },
  ] as ListColumn[];



  pageSize = 10;
  resultsLength: number;
  dataSource: ListDataSource<Inversion> | null;
  database: ListDatabase<Inversion>;
  pidu = '10';

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private inversionService: InversionService,
    public common: CommonFunction) { }

  get visibleColumns() {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }

  ngOnInit(): void {

    this.listar();
    this.inversionService.message.subscribe(data => {
      this.snackBar.open(data, 'AVISO', {
        duration: 2000
      });
    });
  }

  listar() {
    this.inversionService.listar(this.pidu).subscribe(data => {
      this.inversiones = data;
      this.subject$.next(data);
      this.data$ = this.subject$.asObservable();
      this.database = new ListDatabase<Inversion>();
      this.data$.pipe(
        takeUntil(componentDestroyed(this)),
        filter(Boolean)
      ).subscribe((inversiones: Inversion[]) => {
        this.inversiones = inversiones;
        this.database.dataChange.next(inversiones);
        this.resultsLength = inversiones.length;
      });

      this.dataSource = new ListDataSource<Inversion>(this.database, this.sort, this.paginator, this.columns);
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
        this.inversionService.message.next('Registro creado correctamente.');
      }
    });
  }

  modificar(inversion) {
    this.dialog.open(InversionEdicionComponent, {
      data: {
        data: inversion,
        type: 'update'
      }
    }).afterClosed().subscribe(resp => {
      if (resp) {
        this.listar();
        this.inversionService.message.next('Registro modificado correctamente.');
      }
    });
  }

  eliminar(inversion: Inversion) {
    let idArticulo = inversion.id_inversion;
    this.inversionService.eliminar(idArticulo, this.pidu).subscribe(() => {
      this.listar();
      this.inversionService.message.next('Registro eliminado correctamente.');
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

  generarCartaInversion(row) {
    this.dialog.open(CartaInversionDialogComponent, {
      data: row
    })
  }

  generarCartaReInversion(row) {
    this.dialog.open(CartaReinversionDialogComponent, {
      data: row
    }) 
  }

  generarCartaDesInversion(row) {
    this.dialog.open(CartaDesinversionDialogComponent, {
      data: row
    })
  }
  generarCartaDesInversionAnticipada(row) {
    this.dialog.open(CartaDesinversionAnticipadaDialogComponent, {
      data: row
    })
  }
  reinvertir(row) {
    this.dialog.open(InversionEdicionComponent, {
      data: {
              data: row,
              type: 'reinvertir'
            }
    }).afterClosed().subscribe(resp => {
      if (resp) {
        this.listar();
        this.inversionService.message.next('Reinversion gestionada correctamente');
      }
    });
  }

  


}
