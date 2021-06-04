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
import { InversionService } from 'app/servicios/inversiones/inversion.service';
import { Observable, ReplaySubject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { CartaDesinversionAnticipadaDialogComponent } from './carta-desinversion-anticipada-dialog/carta-desinversion-anticipada-dialog.component';
import { CartaDesinversionDialogComponent } from './carta-desinversion-dialog/carta-desinversion-dialog.component';
import { CartaInversionDialogComponent } from './carta-inversion-dialog/carta-inversion-dialog.component';
import { CartaReinversionDialogComponent } from './carta-reinversion-dialog/carta-reinversion-dialog.component';
import { InversionEdicionComponent } from './inversion-edicion/inversion-edicion.component';
import { DeleteDialogComponent } from 'app/servicios/common/delete-dialog/delete-dialog.component';
import { EstadoInversion } from 'app/modelos/inversiones/estadoinversion';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { EstadoInversionService } from 'app/servicios/inversiones/estadoinversion.service';
import { DesinversionDialogComponent } from './desinversion-dialog/desinversion-dialog.component';

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
  estados: EstadoInversion[];

  @Input()
  columns: ListColumn[] = [
    { name: 'ID_Inversion', property: 'id_inversion', visible: false, isModelProperty: true },
    { name: 'Referencia PP', property: 'referencia_pp', visible: false, isModelProperty: true },
    { name: 'No. Certificado', property: 'certificado', visible: true, isModelProperty: true },
    { name: 'Monto', property: 'monto', visible: true, isModelProperty: false },
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
  mostarVigente = true;
  tituloVigente = "Inversiones vigentes"
  tituloNoVigente = "Inversiones no vigentes"

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private inversionService: InversionService,
    private estadoInversionService: EstadoInversionService,
    public common: CommonFunction) { }

  get visibleColumns() {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }

  ngOnInit(): void {

    this.listar();
    this.updateEstados();
    this.inversionService.message.subscribe(data => {
      this.snackBar.open(data, 'AVISO', {
        duration: 2000
      });
    });
  }

  listar() {
    this.inversionService.listar(this.pidu, this.mostarVigente).subscribe(data => {
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

  updateEstados() {
    this.estadoInversionService.listar(this.pidu).subscribe(data => {
      this.estados = data;
    })
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
    this.dialog.open(DeleteDialogComponent).afterClosed().subscribe(resp => {
      if (resp) {
        this.inversionService.eliminar(inversion.id_inversion, this.pidu).subscribe(() => {
          this.listar();
          this.inversionService.message.next('Registro eliminado correctamente.');
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

  desinvertir(row: Inversion) {
    let estado_desinversion = this.getIdEstado(this.common.ESTADO_DESINVERSION);
    if (estado_desinversion != null) {
      this.dialog.open(DesinversionDialogComponent, {
        data: 'Desinversión',
        width: '600px'
      }).afterClosed().subscribe((response) => {
        if (response) {
          row.observacion = row.observacion.concat(response.observacion);
          row.estado = estado_desinversion;
          row.vigente = false;
          this.inversionService.modificar(row, this.pidu).subscribe(() => {
            this.inversionService.message.next('Desinversión realizada correctamente');      
            this.listar(); // Se recargan los datos
          })
        }
      });
    } else {
      this.inversionService.message.next('Error al realizar la desinversion. Contacte al administrador de BD.');
    }
  }

  vencimiento(row) {
    let estado_desinversion = this.getIdEstado(this.common.ESTADO_VENCIMIENTO);
    if (estado_desinversion != null) {
      this.dialog.open(DesinversionDialogComponent, {
        data: 'Vencimiento',
        width: '600px'
      }).afterClosed().subscribe((response) => {
        if (response) {
          row.observacion = row.observacion.concat(response.observacion);
          row.estado = estado_desinversion;
          row.vigente = false;
          this.inversionService.modificar(row, this.pidu).subscribe(() => {
            this.inversionService.message.next('Vencimiento realizado correctamente');      
            this.listar(); // Se recargan los datos
          })
        }
      });
    } else {
      this.inversionService.message.next('Error al confirmar el vencimiento. Contacte al administrador de BD.');
    }
  }

  getIdEstado(nombre: string): EstadoInversion {
    for (let index = 0; index < this.estados.length; index++) {
      const element = this.estados[index];
      if (element.nombre.toLocaleUpperCase() === nombre.toLocaleUpperCase()) {
        return element;
      }
    }
    return null;
  }

  updateRecords() {
    if (this.mostarVigente) {
      this.mostarVigente = false;
    } else {
      this.mostarVigente = true;
    }
    this.listar();
  }

  updateRecordName() {
    if (this.mostarVigente) {
      return "Mostrar no vigentes"
    }
    return "Mostrar vigentes"
  }

  getTitle() {
    return this.mostarVigente ? this.tituloVigente : this.tituloNoVigente;
  }




}
