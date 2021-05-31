import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { CommonFunction } from 'app/inventario/shared/common';
import { ResponsableActivosFijos } from 'app/modelos/inventario/reportes/responsableActivos';
import { ReportesInventarioService } from 'app/servicios/inventario/reportes.service';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { WorkSheet, WorkBook, utils, writeFile } from "xlsx";
import { PlantillaResponsableActivos } from './responsable-activos-plantilla';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'elastic-responsable-activos',
  templateUrl: './responsable-activos.component.html',
  styleUrls: ['./responsable-activos.component.scss']
})
export class ResponsableActivosComponent implements OnInit {

  pidu = '10';
  valor = 1;
  first_row: number = 0;
  last_row: number = 0;
  rows: ResponsableActivosFijos[];
  tipo_bien = "false";
  //False es bienes activos, true es fungibles

  constructor(private reportesService: ReportesInventarioService,
    public common: CommonFunction,
    private snackBar: MatSnackBar,
    private plantilla: PlantillaResponsableActivos) { }

  ngOnInit(): void {
    this.listar(this.tipo_bien);

  }

  listar(tipo_bien) {    
    this.reportesService.responsableActivosFijos(this.pidu, tipo_bien).subscribe(data => {
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

  getValor() {
    if (this.valor > this.rows.length)
      this.valor = 1;
    return this.valor++;
  }

  downloadPDF() {
    // Set the fonts to use    
    if (this.rows.length > 0) {      
      let docDefinition = this.plantilla.getDocument(this.getDelimitedData())
      pdfMake.createPdf(docDefinition).open();
    } else {
      this.snackBar.open('No hay datos para exportar', 'AVISO', {
        duration: 2000
      });
    }

  }
  downloadExcel() {
    if (this.rows.length > 0) {
      let ws: WorkSheet;
      ws = utils.json_to_sheet(this.getDelimitedData(),
        { header: [], skipHeader: false });
      // Encabezados personalizados
      if (ws.A1) { // Valida si hay datos    
        ws.A1.v = 'Número de inventario';
        ws.B1.v = 'Alta el';
        ws.C1.v = 'Valor factura';
        ws.D1.v = 'Activo';
        ws.E1.v = 'Responsable';
        ws.F1.v = 'Ubicación';
      }
      const wb: WorkBook = utils.book_new();
      utils.book_append_sheet(wb, ws, 'Responsable Activos Fijos');
      writeFile(wb, 'Responsable Activos Fijos.xlsx');
    } else {
      this.snackBar.open('No hay datos para exportar', 'AVISO', {
        duration: 2000
      });
    }
  }

  getDelimitedData(): any[] {
    let cont = this.first_row - 1;
    let data = []
    while (cont < this.last_row && cont < this.rows.length) {
      data.push({
        inventario: this.rows[cont].inventario,
        fecha_compra: this.common.getLocalDateString(this.rows[cont].fecha_compra),
        precio: this.rows[cont].precio,
        descripcion: this.rows[cont].descripcion,
        responsable: this.rows[cont].responsable,
        ubicacion: this.rows[cont].ubicacion
      })
      cont++;
    }
    return data;

  }

}
