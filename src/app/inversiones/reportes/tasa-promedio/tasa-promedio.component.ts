import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { CommonFunction } from 'app/inventario/shared/common';
import { Banco } from 'app/modelos/inversiones/banco';
import { Firmante } from 'app/modelos/inversiones/firmante';
import { BancoService } from 'app/servicios/inversiones/banco.service';
import { FirmanteService } from 'app/servicios/inversiones/firmante.service';
import { ReportesInversionesService } from 'app/servicios/inversiones/reportes-inversiones';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { WorkSheet, WorkBook, utils, writeFile } from "xlsx";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'elastic-tasa-promedio',
  templateUrl: './tasa-promedio.component.html',
  styleUrls: ['./tasa-promedio.component.scss']
})
export class TasaPromedioComponent implements OnInit {

  pidu = '10';
  rows = [];
  firmante : Firmante = new Firmante();
  bancos: Banco[];
  anio = new Date().getFullYear();

  //False es bienes activos, true es fungibles

  constructor(private reportesService: ReportesInversionesService,
    private bancoService: BancoService,
    private firmanteService: FirmanteService,
    public common: CommonFunction,
    private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.getBancos();
    this.getFirmante();

  }

  getBancos() {
    this.bancoService.listar(this.pidu).subscribe(data => {
      this.bancos = data;
      this.getTasasDTO();
    })
  }

  getFirmante(){
    this.firmanteService.obtenerFirmante(this.pidu, this.common.contador).subscribe(data =>{
      if(data.length>0){
        this.firmante = data[0];
      }else{
        this.firmante.nombre=""
        this.firmante.puesto=""
        this.snackBar.open(`${this.common.contador} no registrado`, 'AVISO', {
          duration: 2000
        });
      }
      
    })
  }


  getTasasDTO() {
    this.reportesService.tasaPromedio(this.pidu, this.anio).subscribe(data => {
      this.rows = [];
      this.bancos.forEach(banco => {
        let bancoTmp = []
        bancoTmp.push(banco.nombre)
        for (let index = 0; index < 12; index++) {
          let encontrado = false;
          for (let t = 0; t < data.length; t++) {
            const element = data[t];
            if (element.idBanco === banco.id_banco && element.mes === index + 1) {
              bancoTmp.push(element.tasa);
              encontrado = true;
              break;
            }
          }
          if (!encontrado) {
            bancoTmp.push(0);
          }
        }
        this.rows.push(bancoTmp);
      })
      document.getElementById('table').click();
    })
  }


  downloadPDF() {
    if (this.rows.length > 0) {
      console.log(this.rows)
      console.log(this.rows[0].slice(1).reduce((sum, p) => sum + (p.tasa), 0))

      let docDefinition = {
        pageMargins: [50, 90, 50, 50],
        pageSize: 'FOLIO',
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
            text: `TASA PROMEDIO POR BANCO EN ${this.anio}`,
            style: 'header',
            alignment: "center",
            fontSize: 10,
            bold: true,
            decoration: 'underline',
            margin: [10, 20, 10, 20],
          },
          {
            style: 'tableExample',
            margin: [7, 8, 7, 50],
            fontSize: 9,
            alignment: "center",
            table: {
              headerRows: 1,
              widths: ['12.75%', '6.5%', '6.5%', '6.75%', '6.75%', '6.5%', '6.5%', '6.5%', '6.5%', '7.5%', '6.5%', '7.25%', '7%', '6.5%'],
              body: [
                this.getHeaders(),
                ...this.rows.map(element =>([
                  element[0],
                  `${element[1]}%`,
                  `${element[2]}%`,
                  `${element[3]}%`,
                  `${element[4]}%`,
                  `${element[5]}%`,
                  `${element[6]}%`,
                  `${element[7]}%`,
                  `${element[8]}%`,
                  `${element[9]}%`,
                  `${element[10]}%`,
                  `${element[11]}%`,
                  `${element[12]}%`,
                  this.getAvg(element)+"%"
                ])),                                
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
            text: `${this.firmante.nombre}\r\n${this.firmante.puesto}`,
            style: 'subheader',
            alignment: "center",
            fontSize: 10,
            bold: true,
            margin: [20, 40, 600, 15],
          }
        ]
      };
      console.log(docDefinition)
      pdfMake.createPdf(docDefinition).open();
      this.getTasasDTO();
    }
    else {
      this.snackBar.open('No hay datos para exportar', 'AVISO', {
        duration: 2000
      });
    }
  }

  getHeaders(){
    return [{ text: 'Banco', style: 'tableHeader' },
    { text: 'Enero', style: 'tableHeader' },
    { text: 'Febrero', style: 'tableHeader' },
    { text: 'Marzo', style: 'tableHeader' },
    { text: 'Abril', style: 'tableHeader' },
    { text: 'Mayo', style: 'tableHeader' },
    { text: 'Junio', style: 'tableHeader' },
    { text: 'Julio', style: 'tableHeader' },
    { text: 'Agosto', style: 'tableHeader' },
    { text: 'Septiembre', style: 'tableHeader' },
    { text: 'Octubre', style: 'tableHeader' },
    { text: 'Noviembre', style: 'tableHeader' },
    { text: 'Diciembre', style: 'tableHeader' },
    { text: 'Promedio', style: 'tableHeader' },
    ]
  }

  // Evita la division por 0
  getAvg(element){
    let total = element.slice(1).reduce((sum, p) => sum + (p==0?0:1), 0);
    if(total===0){
      return 0
    }
    return (element.slice(1).reduce((sum, p) => sum + (p), 0)/total).toFixed(2)
  }

  downloadExcel() {
    if (this.rows.length > 0) {
      const wb: WorkBook = utils.book_new();      
      let ws: WorkSheet;
        ws = utils.json_to_sheet(this.rows,{ header: [], skipHeader: false });
        // Encabezados personalizados
        if (ws.A1) { // Valida si hay datos
          ws.A1.v = 'Banco';
          ws.B1.v = 'Enero';
          ws.C1.v = 'Febrero';
          ws.D1.v = 'Marzo';
          ws.E1.v = 'Abril';
          ws.F1.v = 'Mayo';
          ws.G1.v = 'Junio';
          ws.H1.v = 'Julio';
          ws.I1.v = 'Agosto';
          ws.J1.v = 'Septiembre';
          ws.K1.v = 'Octubre';
          ws.L1.v = 'Noviembre';
          ws.M1.v = 'Diciembre';                
        }
      
      utils.book_append_sheet(wb, ws, 'Tasa Maxima');
      writeFile(wb, 'Integración a plazo.xlsx');
    } else {
      this.snackBar.open('No hay datos para exportar', 'AVISO', {
        duration: 2000
      });
    }
  }




}
