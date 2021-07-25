import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatPaginator, MatSnackBar, MatSort } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { ROUTE_TRANSITION } from 'app/app.animation';
import { ListColumn } from 'app/core/list/list-column.model';
import { ListDatabase } from 'app/core/list/list-database';
import { ListDataSource } from 'app/core/list/list-datasource';
import { List } from 'app/core/list/list.interface';
import { componentDestroyed } from 'app/core/utils/component-destroyed';
import { TarjetaResponsabilidad } from 'app/modelos/inventario/tarjeta-responsabilidad';
import { TarjetaResponsabilidadService } from 'app/servicios/inventario/tarjeta-responsabilidad.service';
import { Observable, ReplaySubject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { CommonFunction } from '../shared/common';
import { TarjetaResponsabilidadEdicionComponent } from './tarjeta-responsabilidad-edicion/tarjeta-responsabilidad-edicion.component';
import { DeleteDialogComponent } from 'app/servicios/common/delete-dialog/delete-dialog.component';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { WorkSheet, WorkBook, utils, writeFile } from "xlsx";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'elastic-tarjeta-responsabilidad',
  templateUrl: './tarjeta-responsabilidad.component.html',
  styleUrls: ['./tarjeta-responsabilidad.component.scss'],
  animations: [...ROUTE_TRANSITION],
  host: { '[@routeTransition]': '' }
})
export class TarjetaResponsabilidadComponent implements List<TarjetaResponsabilidad>, OnInit, OnDestroy {

  subject$: ReplaySubject<TarjetaResponsabilidad[]> = new ReplaySubject<TarjetaResponsabilidad[]>(1);
  data$: Observable<TarjetaResponsabilidad[]>;
  categorias: TarjetaResponsabilidad[];

  @Input()
  columns: ListColumn[] = [
    { name: 'ID_interno', property: 'id_interno', visible: false, isModelProperty: true },
    { name: 'No. Tarjeta', property: 'idTarjetaResponsabilidad', visible: true, isModelProperty: true },
    { name: 'Fecha de creación', property: 'fecha_creacion', visible: true, isModelProperty: false },
    { name: 'Inventario', property: 'inventario', visible: true, isModelProperty: false },
    { name: 'Descripcion', property: 'descripcion', visible: false, isModelProperty: false },
    { name: 'Sección', property: 'departamento', visible: true, isModelProperty: false },
    { name: 'Receptor', property: 'receptor', visible: true, isModelProperty: false },
    { name: 'Traslados', property: 'traslados', visible: true, isModelProperty: false },

    { name: 'Actions', property: 'actions', visible: true },
  ] as ListColumn[];


  pageSize = 10;
  resultsLength: number;
  dataSource: ListDataSource<TarjetaResponsabilidad> | null;
  database: ListDatabase<TarjetaResponsabilidad>;
  trasladosVisibles: boolean = false;
  pidu = '10';
  id_traslado: number;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private TarjetaResponsabilidadService: TarjetaResponsabilidadService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    public common: CommonFunction) { }

  get visibleColumns() {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }

  ngOnInit(): void {
    this.updateData();
    this.TarjetaResponsabilidadService.message.subscribe(data => {
      this.snackBar.open(data, 'AVISO', {
        duration: 2000
      });
    });
  }

  updateData() {
    this.TarjetaResponsabilidadService.listar(this.pidu).subscribe(data => {
      this.categorias = data;
      this.subject$.next(data);
      this.data$ = this.subject$.asObservable();
      this.database = new ListDatabase<TarjetaResponsabilidad>();
      this.data$.pipe(
        takeUntil(componentDestroyed(this)),
        filter(Boolean)
      ).subscribe((categorias: TarjetaResponsabilidad[]) => {
        this.categorias = categorias;
        this.database.dataChange.next(categorias);
        this.resultsLength = categorias.length;
      });

      this.dataSource = new ListDataSource<TarjetaResponsabilidad>(this.database, this.sort, this.paginator, this.columns);
      document.getElementById('table').click();

    });
  }

  verifyState(evt) {
    this.trasladosVisibles = false;
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  create() {
    this.dialog.open(TarjetaResponsabilidadEdicionComponent).afterClosed().subscribe((TarjetaResponsabilidad: TarjetaResponsabilidad) => {
      if (TarjetaResponsabilidad) {
        this.updateData();
        this.TarjetaResponsabilidadService.message.next('Registro creado correctamente.');
      }
    });
  }

  modify(TarjetaResponsabilidad) {
    this.dialog.open(TarjetaResponsabilidadEdicionComponent, {
      data: TarjetaResponsabilidad
    }).afterClosed().subscribe(resp => {
      if (resp) {
        this.updateData();
        this.TarjetaResponsabilidadService.message.next('Registro modificado correctamente.');
      }
    });
  }

  delete(TarjetaResponsabilidad: TarjetaResponsabilidad) {
    this.dialog.open(DeleteDialogComponent).afterClosed().subscribe(resp => {
      if (resp) {
        let idTarjeta = TarjetaResponsabilidad.id_interno;
        this.TarjetaResponsabilidadService.eliminar(idTarjeta, this.pidu).subscribe(() => {
          this.updateData();
          this.TarjetaResponsabilidadService.message.next('Registro eliminado correctamente.');
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

  showTraslados(id_interno: number) {
    this.id_traslado = id_interno;
    this.trasladosVisibles = true;
  }

  ngOnDestroy(): void {
  }

  
  downloadPDF(tarjeta: TarjetaResponsabilidad) {
    // Set the fonts to use            
    let docDefinition = {
      pageMargins: [10, 80, 10, 0],
      content: [
        {
          style: 'tableExample',
          //margin: [20, 70, 0, 8],
          margin: [20, 200, 0, 8],
          fontSize: 8,
          alignment: "center",
          table: {
            headerRows: 0,
            widths: ['13%', '15%', '36%', '12%', '12%', '12%'],
            body: [
              [this.common.getLocalDateString(tarjeta.articulo.fecha_compra), tarjeta.articulo.inventario,{ text: tarjeta.articulo.descripcion, alignment: 'justify'}, tarjeta.articulo.precio, tarjeta.receptor? tarjeta.receptor.nombrepp: '']              
            ]
          },
          layout: 'headerLineOnly'
        }
      ]
    };
    pdfMake.createPdf(docDefinition).open();
  }

  downloadExcel(tarjeta: TarjetaResponsabilidad) {
    let ws: WorkSheet;
    ws = utils.json_to_sheet([[this.common.getLocalDateString(tarjeta.articulo.fecha_compra), tarjeta.articulo.inventario, tarjeta.articulo.descripcion, tarjeta.articulo.precio, tarjeta.receptor.nombrepp]],
      { header: [], skipHeader: false });
    // Encabezados personalizados    
    if (ws.A1) { // Valida si hay datos    
      ws.A1.v = 'Fecha';
      ws.B1.v = 'No. Y clave de control';
      ws.C1.v = 'Descripción';
      ws.D1.v = 'Valor Neto';
      ws.E1.v = 'Nombre';
    }
    const wb: WorkBook = utils.book_new();
    utils.book_append_sheet(wb, ws, 'Tarjeta');
    writeFile(wb, 'Tarjeta.xlsx');
  }

}