import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { CommonFunction } from 'app/inventario/shared/common';
import { InventarioActivosFijos } from 'app/modelos/inventario/reportes/InventarioActivosFijos';
import { Variable } from 'app/modelos/inventario/reportes/variable';
import { ReportesInventarioService } from 'app/servicios/inventario/reportes.service';
// Import pdfmake-wrapper and the fonts to use
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { WorkSheet, WorkBook, utils, writeFile } from "xlsx";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'elastic-bajas-activos-fijos',
  templateUrl: './bajas-activos-fijos.component.html',
  styleUrls: ['./bajas-activos-fijos.component.scss']
})
export class BajasActivosFijosComponent implements OnInit {

  pidu = '10';
  first_row: number = 0;
  last_row: number = 0;
  correlativo: number = 1;
  valorCorrelativo: number = this.correlativo;
  valor = 1;
  rows: InventarioActivosFijos[];
  variable: Variable;
  tipo_bien = "false";
  //False es bienes activos, true es fungibles

  constructor(private reportesService: ReportesInventarioService,
    public common: CommonFunction,
    private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.reportesService.obtenerVariable(this.pidu, 'BAJAS').subscribe(data => {
      if (data) {
        this.correlativo = data.valor;
        this.variable = data;
      } else {
        this.snackBar.open(`No se encontro ningún número de orden`, 'AVISO', {
          duration: 2000
        });
        this.correlativo = 1;
        this.variable = null;
      }
    })
    this.listar(this.tipo_bien);

  }

  listar(tipo_bien) {
    this.reportesService.bajasActivosFijos(this.pidu, tipo_bien).subscribe(data => {
      this.valor = 1;
      this.rows = data;
      this.last_row = data.length;
      this.first_row = data.length == 0 ? 0 : 1;
      document.getElementById('table').click();
    });
  }

  update() {
    this.listar(this.tipo_bien);
  }

  updateOrderNo() {
    if (this.variable != null) {
      this.variable.valor = this.correlativo + this.rows.length;
      this.reportesService.modificarVariable(this.pidu, this.variable).subscribe(() => {
        this.snackBar.open(`No. Orden modificado a ${this.variable.valor}`, 'AVISO', {
          duration: 2000
        });
      })
    } else {
      this.snackBar.open(`No. se ha creado un número de orden`, 'AVISO', {
        duration: 2000
      });
    }

  }

  getValor() {
    if (this.valorCorrelativo >= this.correlativo + this.rows.length || this.valorCorrelativo < this.correlativo) {
      this.valorCorrelativo = this.correlativo;
    }
    return this.valorCorrelativo++;
  }

  getFila() {
    if (this.valor > this.rows.length)
      this.valor = 1;
    return this.valor++;
  }


  downloadPDF() {
    if (this.rows.length > 0) {
      let usefullData = this.getSpecificData();
      let docDefinition = {
        pageMargins: [80, 100, 80, 30],
        pageSize: 'LEGAL',
        content: [
          {
            style: 'tableExample',
            margin: [10, 5, 10, 5],
            fontSize: 8,
            alignment: "center",
            table: {
              headerRows: 1,
              widths: ['8%', '12%', '16%', '37%', '16%', '10%'],
              body: [
                [{ text: 'No. Orden', style: 'tableHeader' }, { text: 'Fecha Factura', style: 'tableHeader' }, { text: 'Número', style: 'tableHeader' }, { text: 'Descripción', style: 'tableHeader' }, { text: 'V/Adquisición', style: 'tableHeader' }, { text: 'Tarjeta No.', style: 'tableHeader' }],
                ...usefullData.map(p => ([p.orden, p.fecha, p.numero, { text: p.descripcion, alignment: 'justify' }, { text: p.precio.toLocaleString(this.common.localNumber, this.common.numberOptions), alignment: 'right' }, p.tarjeta])),
                [{}, {}, {}, { text: 'Total:', colSpan: 1, bold: true }, { text: 'Q ' + usefullData.reduce((sum, p) => sum + (p.precio), 0).toLocaleString(this.common.localNumber, this.common.numberOptions), bold: true, alignment: 'right' }, {}]
              ]
            },
            layout: 'headerLineOnly'
          }
        ]
      };
      pdfMake.createPdf(docDefinition).open();
    }
    else {
      this.snackBar.open('No hay datos para exportar', 'AVISO', {
        duration: 2000
      });
    }

  }

  downloadExcel() {
    if (this.rows.length > 0) {
      let ws: WorkSheet;
      ws = utils.json_to_sheet(this.getSpecificData(),
        { header: [], skipHeader: false });
      // Encabezados personalizados
      if (ws.A1) { // Valida si hay datos
        ws.A1.v = 'No. Orden';
        ws.B1.v = 'Fecha';
        ws.C1.v = 'Número';
        ws.D1.v = 'Descripción';
        ws.E1.v = 'V/Adquisición';
        ws.F1.v = 'Tarjeta No.';
      }
      const wb: WorkBook = utils.book_new();
      utils.book_append_sheet(wb, ws, 'Bajas de inventario');
      writeFile(wb, 'Bajas de inventario.xlsx');
    } else {
      this.snackBar.open('No hay datos para exportar', 'AVISO', {
        duration: 2000
      });
    }
  }

  getSpecificData(): any[] {
    let cont = this.first_row - 1;
    let correlativoTmp = this.correlativo;
    let data = []
    while (cont < this.last_row && cont < this.rows.length) {
      data.push({
        orden: correlativoTmp++,
        fecha: this.common.getLocalDateString(this.rows[cont].fecha_compra),
        numero: this.rows[cont].numero,
        descripcion: this.rows[cont].descripcion,
        precio: this.rows[cont].precio,
        tarjeta: this.rows[cont].tarjeta
      })
      cont++;
    }
    return data;
  }


}
