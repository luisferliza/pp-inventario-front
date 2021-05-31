import { Component, OnInit } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { CommonFunction } from 'app/inventario/shared/common';
import { Firmante } from 'app/modelos/inversiones/firmante';
import { Inversion } from 'app/modelos/inversiones/inversion';
import { FirmanteService } from 'app/servicios/inversiones/firmante.service';
import { ReportesInversionesService } from 'app/servicios/inversiones/reportes-inversiones.service';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { WorkSheet, WorkBook, utils, writeFile } from "xlsx";
import { AutorizacionInversionDialogComponent } from './autorizacion-inversion-dialog/autorizacion-inversion-dialog.component';
import { PlantillaAutorizacionInversion } from './autorizacion-inversion-plantilla';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'elastic-autorizacion-inversion',
  templateUrl: './autorizacion-inversion.component.html',
  styleUrls: ['./autorizacion-inversion.component.scss']
})
export class AutorizacionInversionComponent implements OnInit {

  pidu = '10';
  presidente: Firmante = new Firmante();
  secretario: Firmante = new Firmante();
  rows: Inversion[];
  //False es bienes activos, true es fungibles

  constructor(private reportesService: ReportesInversionesService,
    public common: CommonFunction,
    public firmanteService: FirmanteService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private plantilla: PlantillaAutorizacionInversion) { }

  ngOnInit(): void {
    this.listar();
    this.getFirmantes(this.common.presidenteJunta);
    this.getFirmantes(this.common.secretarioJunta);
  }

  listar() {
    this.reportesService.autorizacionInversion(this.pidu).subscribe(data => {
      this.rows = data;
      document.getElementById('table').click();
    });
  }

  getFirmantes(firmante: string) {
    this.firmanteService.obtenerFirmante(this.pidu, firmante).subscribe(data => {
      if (data.length > 0) {
        if (firmante === this.common.presidenteJunta) {
          this.presidente = data[0];
        } else {
          this.secretario = data[0];
        }
      } else {
        this.snackBar.open(`${firmante} No encontrado`, 'AVISO', {
          duration: 2000
        });
      }
    });
  }

  openDialog() {
    if (this.rows.length > 0) {
      this.dialog.open(AutorizacionInversionDialogComponent, { width: '600px' }).afterClosed().subscribe((data) => {
        if (data) {
          this.downloadPDF(data.acta, data.sesion);
        }
      });
    } else {
      this.snackBar.open('No hay datos para exportar', 'AVISO', {
        duration: 2000
      });
    }
  }

  downloadPDF(acta: string, sesion: Date) {
    console.log(new Date())
    let docDefinition = this.plantilla.getDocument(this.rows, this.presidente, this.secretario, acta, sesion);
    pdfMake.createPdf(docDefinition).open();
  }




  downloadExcel() {
    if (this.rows.length > 0) {
      let ws: WorkSheet;
      ws = utils.json_to_sheet(this.createXLSXArray(),
        { header: [], skipHeader: false });
      // Encabezados personalizados
      if (ws.A1) { // Valida si hay datos
        ws.A1.v = 'Días Plazo';
        ws.B1.v = 'Tasa Nominal';
        ws.C1.v = 'Institución Bancaria';
        ws.D1.v = 'Documento';
        ws.E1.v = 'Intervalo de interes';
        ws.F1.v = 'Valor inversión Q';
      }
      const wb: WorkBook = utils.book_new();
      utils.book_append_sheet(wb, ws, 'Autorización de Inversión');
      writeFile(wb, 'Autorización de Inversión.xlsx');
    } else {
      this.snackBar.open('No hay datos para exportar', 'AVISO', {
        duration: 2000
      });
    }
  }

  createXLSXArray(): any {
    return this.rows.map(p => ([p.plazo,
    p.tasa_interes,
    p.banco.nombre,
    p.tipo_Inversion.nombre,
    p.periodo_pago,
    p.monto
    ]))
  }

}