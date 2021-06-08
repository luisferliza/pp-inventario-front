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
import { PlantillaInversionesVencen } from './inversiones-vencen-plantilla';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'elastic-inversiones-vencen',
  templateUrl: './inversiones-vencen.component.html',
  styleUrls: ['./inversiones-vencen.component.scss']
})
export class InversionesVencenComponent implements OnInit {

  pidu = '10';
  rows: Inversion[];
  fecha_ini = new Date();
  fecha_fin = new Date();
  contador: Firmante;
  //False es bienes activos, true es fungibles

  constructor(private reportesService: ReportesInversionesService,
    public common: CommonFunction,
    private snackBar: MatSnackBar,
    private plantilla: PlantillaInversionesVencen,
    private firmanteService: FirmanteService) { }

  ngOnInit(): void {
    this.fecha_ini.setDate(1);    
    this.getFirmante();
    this.listar();
    this.fecha_fin.setHours(0);
    this.fecha_ini.setHours(0);
  }

  getFirmante() {
    this.firmanteService.obtenerFirmante(this.pidu, this.common.contador).subscribe(data => {
      if (data.length > 0) {
        this.contador = data[0];        
      } else {
        this.snackBar.open(`${this.common.contador} No encontrado`, 'AVISO', {
          duration: 2000
        });
        this.contador= new Firmante();
      }
    });
  }

  listar() {    
    this.reportesService.inversionesVencen(this.pidu, this.fecha_ini, this.fecha_fin).subscribe(data => {
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
      this.common.getLocalDateString(this.common.parseDate(p.fecha_colocacion)),
      p.tasa_interes + '%',
      p.plazo,
      p.periodo_pago,
      this.common.getLocalDateString(this.common.parseDate(p.vencimiento)),
      this.common.getFechaPagoString(p.vencimiento), 
      p.monto
      ]))
      
  }




}
