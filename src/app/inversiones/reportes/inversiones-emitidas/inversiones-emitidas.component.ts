import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { CommonFunction } from 'app/inventario/shared/common';
import { Firmante } from 'app/modelos/inversiones/firmante';
import { Inversion } from 'app/modelos/inversiones/inversion';
import { FirmanteService } from 'app/servicios/inversiones/firmante.service';
import { ReportesInversionesService } from 'app/servicios/inversiones/reportes-inversiones.service';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { WorkSheet, WorkBook, utils, writeFile } from "xlsx";
import { PlantillaInversionesEmitidas } from './inversiones-emitidas-plantilla';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'elastic-inversiones-emitidas',
  templateUrl: './inversiones-emitidas.component.html',
  styleUrls: ['./inversiones-emitidas.component.scss']
})
export class InversionesEmitidasComponent implements OnInit {

  
  pidu = '10';
  rows: Inversion[];
  fecha_ini = new Date();
  fecha_fin = new Date();
  contador: Firmante;
  //False es bienes activos, true es fungibles

  constructor(private reportesService: ReportesInversionesService,
    public common: CommonFunction,
    private snackBar: MatSnackBar,
    private plantilla: PlantillaInversionesEmitidas,
    private firmanteService: FirmanteService) { }

  ngOnInit(): void {
    this.fecha_ini.setDate(1);    
    this.getFirmante();
    this.listar();
  }

  getMonthDays(month): number{
    let day = month % 2 != 0? ( month==1? 28:30) :31    
    return day
  }

  getFirmante() {
    this.firmanteService.obtenerFirmante(this.pidu, this.common.contador).subscribe(data => {
      if (data.length > 0) {
        this.contador = data[0];
        console.log(this.contador)
      } else {
        this.snackBar.open(`${this.common.contador} No encontrado`, 'AVISO', {
          duration: 2000
        });
        this.contador= new Firmante();
      }
    });
  }

  listar() {
    console.log(this.fecha_fin)
    console.log(this.fecha_ini)
    this.reportesService.inversionesEmitidas(this.pidu, this.fecha_ini, this.fecha_fin).subscribe(data => {
      this.rows = data;
      document.getElementById('table').click();
    });
  }

  update() {
    this.listar();
  }

  downloadPDF() {
    if (this.rows.length > 0) {      
      let docDefinition = this.plantilla.getDocument(this.rows, this.fecha_ini, this.fecha_fin, this.contador)
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
        ws.B1.v = 'Cuenta';
        ws.C1.v = 'Certificado';
        ws.D1.v = 'Fecha de colocación';
        ws.E1.v = 'Tasa';
        ws.F1.v = 'Plazo';
        ws.G1.v = 'Pago de Int.';
        ws.H1.v = 'Fecha de vencimiento';
        ws.I1.v = 'Fecha de pago';
        ws.J1.v = 'Valor Q.';
      }
      const wb: WorkBook = utils.book_new();
      utils.book_append_sheet(wb, ws, 'Inversiones vencen');
      writeFile(wb, 'Inversiones vencen.xlsx');
    } else {
      this.snackBar.open('No hay datos para exportar', 'AVISO', {
        duration: 2000
      });
    }
  }


  createXLSXArray(): any {
    return this.rows.map(p=>([p.banco.nombre,
      p.cuenta,
      p.certificado,
      this.common.getLocalDateString(p.fecha_colocacion),
      p.tasa_interes + '%',
      p.plazo,
      p.periodo_pago,
      this.common.getLocalDateString(p.vencimiento),
      this.common.getFechaPagoString(p.vencimiento),
      p.monto.toLocaleString(this.common.localNumber, this.common.numberOptions)
      ]))
      
  }




}
