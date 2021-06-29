import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog, MatPaginator, MatSnackBar, MatSort } from '@angular/material';
import { ROUTE_TRANSITION } from 'app/app.animation';
import { ListColumn } from 'app/core/list/list-column.model';
import { ListDatabase } from 'app/core/list/list-database';
import { ListDataSource } from 'app/core/list/list-datasource';
import { List } from 'app/core/list/list.interface';
import { componentDestroyed } from 'app/core/utils/component-destroyed';
import { Traslado } from 'app/modelos/inventario/traslado';
import { TrasladoService } from 'app/servicios/inventario/traslado.service';
import { Observable, ReplaySubject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { TrasladoEdicionComponent } from './traslado-edicion/traslado-edicion.component';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { WorkSheet, WorkBook, utils, writeFile } from "xlsx";
import { CommonFunction } from 'app/inventario/shared/common';
import { DeleteDialogComponent } from 'app/servicios/common/delete-dialog/delete-dialog.component';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'elastic-traslado',
  templateUrl: './traslado.component.html',
  styleUrls: ['./traslado.component.scss'],
  animations: [...ROUTE_TRANSITION],
  host: { '[@routeTransition]': '' }
})
export class TrasladoComponent implements List<Traslado>, OnInit, OnDestroy {

  subject$: ReplaySubject<Traslado[]> = new ReplaySubject<Traslado[]>(1);
  data$: Observable<Traslado[]>;
  traslados: Traslado[];

  @Input('data') data: number;
  @Output() closeView = new EventEmitter<boolean>();

  @Input()
  columns: ListColumn[] = [
    { name: 'ID_Traslado', property: 'id_traslado', visible: false, isModelProperty: true },
    { name: 'Fecha de inicio', property: 'fecha_inicio', visible: true, isModelProperty: false },
    { name: 'Fecha de fin', property: 'fecha_fin', visible: true, isModelProperty: false },
    { name: 'Usuario', property: 'usuario', visible: true, isModelProperty: false },
    { name: 'Sección', property: 'seccion', visible: true, isModelProperty: false },
    { name: 'Actions', property: 'actions', visible: true },
  ] as ListColumn[];


  pageSize = 10;
  resultsLength: number;
  dataSource: ListDataSource<Traslado> | null;
  database: ListDatabase<Traslado>;
  pidu = '10';

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private trasladoService: TrasladoService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    public common: CommonFunction) { }

  get visibleColumns() {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }

  ngOnInit(): void {
    this.updateData();
    this.trasladoService.message.subscribe(data => {
      this.snackBar.open(data, 'AVISO', {
        duration: 2000
      });
    });
  }

  updateData() {
    this.trasladoService.listar(this.pidu, this.data).subscribe(data => {
      this.traslados = data;
      this.subject$.next(data);
      this.data$ = this.subject$.asObservable();
      this.database = new ListDatabase<Traslado>();
      this.data$.pipe(
        takeUntil(componentDestroyed(this)),
        filter(Boolean)
      ).subscribe((traslados: Traslado[]) => {
        this.traslados = traslados;
        this.database.dataChange.next(traslados);
        this.resultsLength = traslados.length;
      });

      this.dataSource = new ListDataSource<Traslado>(this.database, this.sort, this.paginator, this.columns);
      document.getElementById('table').click();

    });
  }

  closeComponent() {
    this.closeView.emit(true);
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }  

  create() {
    this.dialog.open(TrasladoEdicionComponent, {
      data: {
        tarjeta: this.data
      }
    }).afterClosed().subscribe((traslado: Traslado) => {
      if (traslado) {
        this.updateData();
        this.trasladoService.message.next('Traslado creado correctamente.');
      }
    });
  }

  modify(traslado) {
    this.dialog.open(TrasladoEdicionComponent, {
      data: {
        traslado: traslado,
        tarjeta: this.data
      }
    }).afterClosed().subscribe(resp => {
      if (resp) {
        this.updateData();
        this.trasladoService.message.next('Traslado modificado correctamente.');
      }
    });

  }

  delete(traslado: Traslado) {
    this.dialog.open(DeleteDialogComponent).afterClosed().subscribe(resp => {
      if (resp) {
        let idTraslado = traslado.id_traslado;
        this.trasladoService.eliminar(idTraslado, this.pidu).subscribe(() => {
          this.updateData();
          this.trasladoService.message.next('Traslado eliminado correctamente.');
        });
      }
    });
  }


  downloadPDF() {
    // Set the fonts to use            
    let docDefinition = {
      content: [
        {
          style: 'tableExample',
          margin: [6, 60, 2, 8],
          fontSize: 9,
          alignment: "center",
          table: {
            headerRows: 0,
            widths: ['15%', '18%', '31%', '18%', '18%'],
            body: [
              ...this.traslados.map(p => ([this.common.getLocalDateString(p.fecha_inicio), '', p.seccion.nombre, p.usuario.nombrepp, '']))

            ]
          },
          layout: 'headerLineOnly'
        }
      ]
    };
    pdfMake.createPdf(docDefinition).open();
  }

  downloadExcel() {

    let ws: WorkSheet;
    ws = utils.json_to_sheet(this.prepareData(),
      { header: [], skipHeader: false });
    // Encabezados personalizados    
    if (ws.A1) { // Valida si hay datos    
      ws.A1.v = 'Fecha';
      ws.B1.v = 'Sección';
      ws.C1.v = 'Nombre';
    }
    const wb: WorkBook = utils.book_new();
    utils.book_append_sheet(wb, ws, 'Traslados');
    writeFile(wb, 'Traslados.xlsx');

  }

  prepareData(): any[] {
    let data = []
    this.traslados.forEach(p => {
      data.push({
        fecha_inicio: this.common.getLocalDateString(p.fecha_inicio),
        seccion: p.seccion.nombre,
        usuario: p.usuario.nombrepp
      })
    })
    return data;
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

