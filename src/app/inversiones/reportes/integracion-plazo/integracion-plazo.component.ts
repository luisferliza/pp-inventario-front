import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { CommonFunction } from 'app/inventario/shared/common';
import { Banco } from 'app/modelos/inversiones/banco';
import { InteresPorBanco } from 'app/modelos/inversiones/InteresPorBanco';
import { Inversion } from 'app/modelos/inversiones/inversion';
import { BancoService } from 'app/servicios/inversiones/banco.service';
import { ReportesInversionesService } from 'app/servicios/inversiones/reportes-inversiones';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { WorkSheet, WorkBook, utils, writeFile } from "xlsx";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'elastic-integracion-plazo',
  templateUrl: './integracion-plazo.component.html',
  styleUrls: ['./integracion-plazo.component.scss']
})
export class IntegracionPlazoComponent implements OnInit {


  pidu = '10';
  rows: Inversion[];
  bancos: Banco[];
  id_banco: number;
  date = new Date();
  //False es bienes activos, true es fungibles

  constructor(private reportesService: ReportesInversionesService,
    private bancoService: BancoService,
    public common: CommonFunction,
    private snackBar: MatSnackBar) { }

  ngOnInit(): void {    
    this.getBancos();

  }

  getBancos() {
    this.bancoService.listar(this.pidu).subscribe(data => {
      this.bancos = data;
      this.id_banco = data[0].id_banco;
      this.listar(this.id_banco)
    })
  }

  listar(id_categoria) {
    this.reportesService.integracioPlazoFijo(this.pidu, this.date.toISOString().split('T')[0], id_categoria).subscribe(data => {
      this.rows = data;
      document.getElementById('table').click();
    });
  }

  update() {
    this.listar(this.id_banco);
  }

  getNextDate(date) {
    let futureDate = new Date(date);
    futureDate.setDate(futureDate.getDate() + 1)
    return this.common.getDate(futureDate.toISOString().split('T')[0]);
  }


  downloadPDF(data) {    
    if (data.length > 0) {
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
        }, footer: function (currentPage, pageCount) {
          return {
            text: 'Página ' + currentPage.toString() + ' de ' + pageCount + '   ',
            fontSize: 8,
            alignment: 'center',
            margin: [0, 10, 0, 20]
          }
        },
        content: [
          ...data
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

  
  downloadExcel(data: InteresPorBanco[]) {
    if (this.rows.length > 0) {
      const wb: WorkBook = utils.book_new();
      data.forEach(element => {
        let ws: WorkSheet;
        ws = utils.json_to_sheet(this.getXLSLData(element.inversiones),{ header: [], skipHeader: false });
        // Encabezados personalizados
        if (ws.A1) { // Valida si hay datos
          ws.A1.v = 'Tipo Docto.';
          ws.B1.v = 'No. registro';
          ws.C1.v = 'Cuenta';
          ws.D1.v = 'Fecha de emisión';
          ws.E1.v = 'Tasa (%)';
          ws.F1.v = 'Días Plazo';
          ws.G1.v = 'Forma de pago de intereses';
          ws.H1.v = 'Fecha vencimiento';
          ws.I1.v = 'Fecha pago';
          ws.J1.v = 'Valor nominal';
        }
      
      utils.book_append_sheet(wb, ws, element.banco);
      });
      
      writeFile(wb, 'Integración a plazo.xlsx');
    } else {
      this.snackBar.open('No hay datos para exportar', 'AVISO', {
        duration: 2000
      });
    }
  }

  createXLSXArray(){
    this.reportesService.integracioPlazoFijoCompleto(this.pidu, this.date.toISOString().split('T')[0]).subscribe(data => {
      this.downloadExcel(data);
    })
  }

  getXLSLData(inv: Inversion[]){    
    return inv.map(p => ([
          p.tipo_Inversion.nombre,
          p.referencia,
          p.cuenta,
          this.common.getDate(p.fecha_colocacion),
          p.tasa_interes,
          p.plazo,
          p.periodo_pago,
          this.common.getDate(p.vencimiento),
          this.getNextDate(p.vencimiento),
          p.monto          
      ]))
  }

  createTablesArray() {
    let tablas = [];
    let reference = this;
    this.reportesService.integracioPlazoFijoCompleto(this.pidu, this.date.toISOString().split('T')[0]).subscribe(data => {      
      for (let index = 0; index < data.length; index++) {
        const element = data[index];        
        tablas.push(
          ... this.getTitleDescription(reference, element),          
          ... this.getTable(element),
          {
            text: '',
            pageBreak: "after" // or after
          }
        )
      }
      tablas.pop();
      this.downloadPDF(tablas);
    })


  }


  getTitleDescription(reference, element){
    return [
      {
        text: `INTEGRACIÓN DE DOCUMENTOS A PLAZO VIGENTES `,
        style: 'subheader',
        alignment: "center",
        fontSize: 10,
        bold: true,
        margin: [0, 5, 0, 0],
      },
      {
        text: `INSTITUCIÓN: ${element.banco.toUpperCase()} `,
        style: 'subheader',
        alignment: "center",
        fontSize: 10,
        bold: true,
        margin: [0, 5, 0, 0],
      },
      {
        text: `AL ${new Date(reference.date).toLocaleDateString('es', { year: 'numeric', month: 'long', day: 'numeric' }).toUpperCase()}  `,
        style: 'subheader',
        alignment: "center",
        fontSize: 10,
        bold: true,
        margin: [0, 5, 0, 0],
      },
      {
        text: `EXPRESADO EN QUETZALES`,
        style: 'subheader',
        alignment: "center",
        fontSize: 10,
        bold: true,
        margin: [0, 5, 0, 10],
      },
    ]
    // fin de método
  }

  getTable(element){
    return [
      {
        style: 'tableExample',
        margin: [10, 8, 10, 50],
        fontSize: 8,
        alignment: "center",
        table: {
          headerRows: 1,
          widths: ['10%', '10%', '10%', '10%', '8%', '8%', '10%', '10%', '10%', '14%'],
          body: [
            [{ text: 'Tipo Docto. ', style: 'tableHeader' },
            { text: 'No. registro', style: 'tableHeader' },
            { text: 'Cuenta', style: 'tableHeader' },
            { text: 'Fecha de emisión', style: 'tableHeader' },
            { text: 'Tasa (%)', style: 'tableHeader' },
            { text: 'Días Plazo', style: 'tableHeader' },
            { text: 'Forma de pago de intereses', style: 'tableHeader' },
            { text: 'Fecha vencimiento', style: 'tableHeader' },
            { text: 'Fecha pago', style: 'tableHeader' },
            { text: 'Valor nominal', style: 'tableHeader' }],
            ...element.inversiones.map(p => ([p.tipo_Inversion.nombre,
                                              p.referencia,
                                              p.cuenta,
                                              this.common.getDate(p.fecha_colocacion),
                                              p.tasa_interes,
                                              p.plazo,
                                              p.periodo_pago,
                                              this.common.getDate(p.vencimiento),
                                              this.getNextDate(p.vencimiento),
                                              { text: 'Q' + p.monto.toLocaleString('en', this.common.options), alignment: 'right' }
                                              ])),
              [{}, {}, {}, {}, {}, {}, {}, {}, { text: 'Total:', colSpan: 1, bold: true },
              { text: 'Q ' + element.inversiones.reduce((sum, p) => sum + (p.monto), 0).toLocaleString('en', this.common.options), bold: true, alignment: 'right' }]
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
    // fin de metodo 
  }




}
