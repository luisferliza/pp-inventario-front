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
import { Firmante } from 'app/modelos/inversiones/firmante';
import { FirmanteService } from 'app/servicios/inversiones/firmante.service';
import { PlantillaInteresMensual } from './interes-mensual-plantilla';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'elastic-interes-mensual',
  templateUrl: './interes-mensual.component.html',
  styleUrls: ['./interes-mensual.component.scss']
})
export class InteresMensualComponent implements OnInit {

  pidu = '10';
  rows: Inversion[];
  bancos: Banco[];
  id_banco: number;
  fecha = new Date();
  contador: Firmante;
  //False es bienes activos, true es fungibles

  constructor(private reportesService: ReportesInversionesService,
    private bancoService: BancoService,
    public common: CommonFunction,
    private snackBar: MatSnackBar,
    private firmanteService: FirmanteService,
    private plantilla: PlantillaInteresMensual) { }

  ngOnInit(): void {
    this.getBancos();
    this.getFirmante();
    this.fecha.setHours(0);

  }

  getBancos() {
    this.bancoService.listarActivas(this.pidu).subscribe(data => {
      this.bancos = data;
      this.id_banco = data[0].id_banco;
      this.listar(this.id_banco)
    })
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

  listar(id_categoria) {
    this.reportesService.interesMensual(this.pidu, this.fecha, id_categoria).subscribe(data => {
      this.rows = data;
      document.getElementById('table').click();
    });
  }

  update() {
    this.listar(this.id_banco);
  }

  downloadExcel() {
    this.reportesService.interesMensualCompleto(this.pidu, this.fecha).subscribe(data => {
      if (data.length > 0) {
        let wb = this.createDataArray(data);
        writeFile(wb, 'Interes Mensual.xlsx');
      } else {
        this.snackBar.open('No hay datos para exportar', 'AVISO', {
          duration: 2000
        });
      }
    })
  }

  createDataArray(data: InversionesPorBanco[]) {
    const wb: WorkBook = utils.book_new();
    data.forEach(element => {
      if (element.inversiones.length != 0) {
        let ws: WorkSheet;
        ws = utils.json_to_sheet(this.getInversioninfo(element.inversiones), { header: [], skipHeader: false });
        // Encabezados personalizados
        if (ws.A1) { // Valida si hay datos
          ws.A1.v = 'Tipo Docto.';
          ws.B1.v = 'No. registro';
          ws.C1.v = 'Valor nominal';
          ws.D1.v = 'Fecha de emisión';
          ws.E1.v = 'Tasa (%)';
          ws.F1.v = 'Días corridos';
          ws.G1.v = 'Intereses';
        }
        utils.book_append_sheet(wb, ws, element.banco.substring(0, 30));
      }
    });
    return wb;
  }


  getInversioninfo(inv: Inversion[]) {
    return inv.map(p => ([
      p.tipo_Inversion.nombre,
      p.certificado,
      p.monto,
      this.common.getLocalDateString(p.fecha_colocacion),
      p.tasa_interes,
      p.diasInteres,
      p.interes
    ]))
  }


  downloadPDF() {
    this.reportesService.interesMensualCompleto(this.pidu, this.fecha).subscribe(data => {
      if (data.length > 0) {
        let docDefinition = this.plantilla.createPDF(data, this.fecha, this.contador);
        pdfMake.createPdf(docDefinition).open();
      }
      else {
        this.snackBar.open('No hay datos para exportar', 'AVISO', {
          duration: 2000
        });
      }
    })
  }



}
