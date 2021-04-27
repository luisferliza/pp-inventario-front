import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { CommonFunction } from 'app/inventario/shared/common';
import { InventarioActivosFijos } from 'app/modelos/inventario/reportes/InventarioActivosFijos';
import { ReportesService } from 'app/servicios/inventario/reportes.service';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { WorkSheet, WorkBook, utils, writeFile } from "xlsx";
pdfMake.vfs = pdfFonts.pdfMake.vfs;


@Component({
  selector: 'elastic-inventario-activos-fijos',
  templateUrl: './inventario-activos-fijos.component.html',
  styleUrls: ['./inventario-activos-fijos.component.scss']
})
export class InventarioActivosFijosComponent implements OnInit {

  pidu = '10';
  value = 1;
  first_row: number = 0;
  last_row: number = 0;
  rows: InventarioActivosFijos[];
  tipo_bien = "false";
  //False es bienes activos, true es fungibles

  constructor(private reportesService: ReportesService,
              public common: CommonFunction,
              private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.updateData();
  }

  updateData() {    
    this.reportesService.inventarioActivosFijos(this.pidu, this.tipo_bien).subscribe(data => {
      this.value = 1;
      this.rows = data;
      this.last_row = data.length;
      this.first_row = data.length == 0 ? 0 : 1;
      document.getElementById('table').click();
    });
  }


  getValue() {
    if (this.value > this.rows.length)
      this.value = 1;
    return this.value++;
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
              widths: ['13%', '15%', '44%', '15%', '13%'],
              body: [
                [{ text: 'Fecha Factura', style: 'tableHeader' }, { text: 'Número', style: 'tableHeader' }, { text: 'Descripción', style: 'tableHeader' }, { text: 'V/Adquisición', style: 'tableHeader' }, { text: 'Tarjeta No.', style: 'tableHeader' }],
                ...usefullData.map(p => ([p.fecha, p.numero, {text:p.descripcion, alignment: 'justify'}, {text: p.precio.toLocaleString('en', this.common.options), alignment: 'right'}, p.tarjeta])),
                [{}, {}, { text: 'Total:', colSpan: 1, bold: true }, { text: 'Q ' + usefullData.reduce((sum, p) => sum + (p.precio), 0).toLocaleString('en', this.common.options), bold: true , alignment: 'right'}, {}]
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
        ws.A1.v = 'Fecha';
        ws.B1.v = 'Número';
        ws.C1.v = 'Descripción';
        ws.D1.v = 'V/Adquisición';
        ws.E1.v = 'Tarjeta No.';
      }
      const wb: WorkBook = utils.book_new();
      utils.book_append_sheet(wb, ws, 'Inventario Activos Fijos');
      writeFile(wb, 'Inventario Activos Fijos.xlsx');
    } else {
      this.snackBar.open('No hay datos para exportar', 'AVISO', {
        duration: 2000
      });
    }
  }

  getSpecificData(): any[] {
    let cont = this.first_row - 1;
    let data = []
    while (cont < this.last_row && cont < this.rows.length) {
      data.push({
        fecha: this.common.getDate(this.rows[cont].fecha_compra),
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
