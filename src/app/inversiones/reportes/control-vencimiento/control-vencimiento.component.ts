import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { CommonFunction } from 'app/inventario/shared/common';
import { Calculos } from 'app/inversiones/inversion/calculos/calculos';
import { Inversion } from 'app/modelos/inversiones/inversion';
import { ReportesInversionesService } from 'app/servicios/inversiones/reportes-inversiones';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { WorkSheet, WorkBook, utils, writeFile } from "xlsx";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'elastic-control-vencimiento',
  templateUrl: './control-vencimiento.component.html',
  styleUrls: ['./control-vencimiento.component.scss']
})
export class ControlVencimientoComponent implements OnInit {

  pidu = '10';
  rows: Inversion[];
  fecha_ini = new Date();
  fecha_fin = new Date();
  //False es bienes activos, true es fungibles

  constructor(private reportesService: ReportesInversionesService,
    public common: CommonFunction,
    private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.fecha_ini.setDate(1)
    this.fecha_fin.setDate(this.getMonthDays(this.fecha_fin.getMonth()))          
    this.listar();
  }

  getMonthDays(month): number{
    let day = month % 2==0? ( month==1? 28:30) :31
    console.log(day)
    return day
  }

  listar() {
    this.reportesService.controlVencimiento(this.pidu, this.fecha_ini.toISOString().split('T')[0], this.fecha_fin.toISOString().split('T')[0]).subscribe(data => {
      this.rows = data;
      document.getElementById('table').click();
    });
  }

  update() {
    this.listar();
  }

  getFechaPago(inversion: Inversion) {
    let fecha_vencimiento = new Date(inversion.vencimiento);
    fecha_vencimiento.setDate(fecha_vencimiento.getDate() + 1);
    return this.common.getDate(fecha_vencimiento.toISOString().split('T')[0]);
  }



  downloadPDF() {
    if (this.rows.length > 0) {      
      let docDefinition = {
        pageMargins: [50, 90, 50, 50],
        pageSize: 'LETTER',
        pageOrientation: 'landscape',
        header: function (currentPage, pageCount, pageSize) {
          return [
            {
              text: `UNIVERSIDAD DE SAN CARLOS DE GUATEMALA \r\n PLAN DE PRESTACIONES`,
              style: 'header',
              alignment: "left",
              fontSize: 10,
              bold: true,
              margin: [50, 50, 50, 50],
            }
          ]
        },
        content: [
          {
            text: `CONTROL DE VENCIMIENTO DE INVERSIONES \r\n (EXPRESADO EN QUETZALES)`,
            style: 'header',
            alignment: "center",
            fontSize: 10,
            bold: true,
          },
          {
            text: `Del ${new Date(this.fecha_ini).toLocaleDateString('es', { year: 'numeric', month: 'long', day: 'numeric' })} al ${new Date(this.fecha_fin).toLocaleDateString('es', { year: 'numeric', month: 'long', day: 'numeric' })} `,
            style: 'subheader',
            alignment: "center",
            fontSize: 10,
            bold: true,
            margin: [0, 15, 0, 15],
          },
          {
            style: 'tableExample',
            margin: [10, 8, 10, 50],
            fontSize: 8,
            alignment: "center",
            table: {
              headerRows: 1,
              widths: ['16%', '10%', '6%', '10%', '10%', '12%', '8%', '6%', '10%', '12%'],
              body: [
                [{ text: 'Institución', style: 'tableHeader' },
                { text: 'Referencia', style: 'tableHeader' },
                { text: 'Plazo (dias)', style: 'tableHeader' },
                { text: 'Fecha de vencimiento', style: 'tableHeader' },
                { text: 'Fecha de pago', style: 'tableHeader' },
                { text: 'Valor Q', style: 'tableHeader' },
                { text: 'Tasa', style: 'tableHeader' },
                { text: 'Dias Int.', style: 'tableHeader' },
                { text: 'Valor Int.', style: 'tableHeader' },
                { text: 'Total', style: 'tableHeader' }],
                ...this.createDataArray(),
                [{}, {}, {}, {}, { text: 'Totales:', colSpan: 1, bold: true },
                { text: 'Q ' + this.rows.reduce((sum, p) => sum + (p.monto), 0).toLocaleString('en', this.common.options), bold: true, alignment: 'right' },
                {}, {},
                { text: 'Q ' + this.rows.reduce((sum, p) => sum + (p.interes), 0).toLocaleString('en', this.common.options), bold: true, alignment: 'right' },
                { text: 'Q ' + this.rows.reduce((sum, p) => sum + (p.monto+p.interes), 0).toLocaleString('en', this.common.options), bold: true, alignment: 'right' },
                ]
              ]
            },
            layout: 'headerLineOnly'
          },
          {
            text: `Guatemala, ${new Date().toLocaleDateString('es', { year: 'numeric', month: 'long', day: 'numeric' })}`,            
            alignment: "left",
            fontSize: 10,
            bold: true,
            margin: [0, 15, 0, 15],
          },
          {
            text: `${this.common.contador}\r\nContador General Plan de Prestaciones`,
            style: 'subheader',
            alignment: "left",
            fontSize: 10,
            bold: true,
            margin: [40, 40, 0, 15],
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
      ws = utils.json_to_sheet(this.createXLSXArray(),
        { header: [], skipHeader: false });
      // Encabezados personalizados
      if (ws.A1) { // Valida si hay datos
        ws.A1.v = 'Institución';
        ws.B1.v = 'Referencia';
        ws.C1.v = 'Plazo (dias)';
        ws.D1.v = 'Fecha de vencimiento';
        ws.E1.v = 'Fecha de pago';
        ws.F1.v = 'Valor Q';
        ws.G1.v = 'Tasa';
        ws.H1.v = 'Dias Int.';
        ws.I1.v = 'Valor Int.';
        ws.J1.v = 'Totales';
      }
      const wb: WorkBook = utils.book_new();
      utils.book_append_sheet(wb, ws, 'Control de vencimiento');
      writeFile(wb, 'Control de vencimiento.xlsx');
    } else {
      this.snackBar.open('No hay datos para exportar', 'AVISO', {
        duration: 2000
      });
    }
  }

  createDataArray(): any {
    return this.rows.map(p => ([p.banco.nombre,
                                p.referencia,
                                p.plazo,
                                this.common.getDate(p.vencimiento),
                                this.getFechaPago(p),
                                { text: 'Q' + p.monto.toLocaleString('en', this.common.options), alignment: 'right' },
                                p.tasa_interes + '%',
                                p.diasInteres,
                                { text: 'Q' + p.interes.toLocaleString('en', this.common.options), alignment: 'right' },
                                { text: 'Q' + (p.monto + p.interes).toLocaleString('en', this.common.options), alignment: 'right' },
                                ])
    )
  }

  createXLSXArray(): any {
    return this.rows.map(p=>([p.banco.nombre,
                          p.referencia,
                          p.plazo,
                          this.common.getDate(p.vencimiento),
                          this.getFechaPago(p),
                          p.monto,
                          p.tasa_interes + '%',
                          p.diasInteres,
                          p.interes,
                          p.monto+p.interes
      ]))
      
  }



}
