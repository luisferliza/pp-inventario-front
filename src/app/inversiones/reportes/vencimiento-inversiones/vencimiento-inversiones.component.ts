import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { CommonFunction } from 'app/inventario/shared/common';
import { Banco } from 'app/modelos/inversiones/banco';
import { InversionesPorBanco } from 'app/modelos/inversiones/InversionesPorBanco';
import { Inversion } from 'app/modelos/inversiones/inversion';
import { BancoService } from 'app/servicios/inversiones/banco.service';
import { ReportesInversionesService } from 'app/servicios/inversiones/reportes-inversiones.service';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { WorkSheet, WorkBook, utils, writeFile } from "xlsx";
import { FirmanteService } from 'app/servicios/inversiones/firmante.service';
import { Firmante } from 'app/modelos/inversiones/firmante';
import { PlantillaVencimientoInversiones } from './vencimiento-inversiones-plantilla';
import { PlantillaInversionesVencen } from '../inversiones-vencen/inversiones-vencen-plantilla';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'elastic-vencimiento-inversiones',
  templateUrl: './vencimiento-inversiones.component.html',
  styleUrls: ['./vencimiento-inversiones.component.scss']
})
export class VencimientoInversionesComponent implements OnInit {

  pidu = '10';
  rows: Inversion[];
  fecha_ini = new Date();
  fecha_fin = new Date();
  contador: Firmante;
  //False es bienes activos, true es fungibles

  constructor(private reportesService: ReportesInversionesService,
    public common: CommonFunction,
    private snackBar: MatSnackBar,
    private plantilla: PlantillaVencimientoInversiones,
    private firmanteService: FirmanteService) { }

  ngOnInit(): void {
    this.fecha_ini.setDate(1);
    this.getFirmante()
    this.listar();
  }  

  getFirmante() {
    this.firmanteService.obtenerFirmante(this.pidu, this.common.contador).subscribe(data => {
      if (data.length > 0) {
        this.contador = data[0];
      } else {
        this.snackBar.open(`${this.common.contador} No encontrado`, 'AVISO', {
          duration: 2000
        });
        this.contador = new Firmante();
      }
    });
  }

  listar() {
    this.reportesService.controlVencimiento(this.pidu, this.fecha_ini, this.fecha_fin).subscribe(data => {
      this.rows = data;
      document.getElementById('table').click();
    });
  }

  update() {
    this.listar();
  }
  /*
  downloadPDF() {
    if (this.rows.length > 0) {      
      let docDefinition = this.plantilla.getDocument(this.rows, this.contador, this.fecha_ini, this.fecha_fin)
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
        ws.B1.v = 'Certificado';
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


  createXLSXArray(): any {
    return this.rows.map(p=>([p.banco.nombre,
                          p.certificado,
                          p.plazo,
                          this.common.getLocalDateString(p.vencimiento),
                          this.common.getFechaPagoString(p.vencimiento),
                          p.monto,
                          p.tasa_interes + '%',
                          p.diasInteres,
                          p.interes,
                          p.monto+p.interes
      ]))
      
  }

  */

}
