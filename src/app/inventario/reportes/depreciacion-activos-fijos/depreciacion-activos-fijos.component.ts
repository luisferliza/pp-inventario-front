import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { CommonFunction } from 'app/inventario/shared/common';
import { Categoria } from 'app/modelos/inventario/categoria';
import { DepreciacionActivosFijos } from 'app/modelos/inventario/reportes/depreciacionActivosFijos';
import { CategoriaService } from 'app/servicios/inventario/categoria.service';
import { ReportesInventarioService } from 'app/servicios/inventario/reportes.service';
// Import pdfmake-wrapper and the fonts to use
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { WorkSheet, WorkBook, utils, writeFile } from "xlsx";
import { PlantillaDepreciacionActivos } from './depreciacion-activos-plantilla';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'elastic-depreciacion-activos-fijos',
  templateUrl: './depreciacion-activos-fijos.component.html',
  styleUrls: ['./depreciacion-activos-fijos.component.scss']
})
export class DepreciacionActivosFijosComponent implements OnInit {


  pidu = '10';
  valor = 1;
  first_row: number = 0;
  last_row: number = 0;
  rows: DepreciacionActivosFijos[];
  categorias: Categoria[];
  id_categoria: number;
  date = new Date();
  //False es bienes activos, true es fungibles

  constructor(private reportesService: ReportesInventarioService,
    private categoriaService: CategoriaService,
    public common: CommonFunction,
    private snackBar: MatSnackBar,
    private plantilla: PlantillaDepreciacionActivos) { }

  ngOnInit(): void {
    this.getCategorias();
    this.date.setHours(0);

  }

  getCategorias() {
    this.categoriaService.listar(this.pidu).subscribe(data => {
      this.categorias = data;
      this.id_categoria = data[0].id_categoria;
      this.listar(this.id_categoria)
    })
  }

  listar(categoria) {    
    this.reportesService.depreciacionActivosFijos(this.pidu, this.date, categoria).subscribe(data => {
      this.valor = 1;
      this.rows = data;
      this.last_row = data.length;
      this.first_row = data.length == 0 ? 0 : 1;
      document.getElementById('table').click();
    });
  }

  update() {
    this.listar(this.id_categoria);
  }

  getValor() {
    if (this.valor > this.rows.length)
      this.valor = 1;
    return this.valor++;
  }

  downloadPDF() {    
    let categoria = this.getCategoryName(this.id_categoria)
    if (this.rows.length > 0) {
      let docDefinition = this.plantilla.getDocument(this.getDelimitedData(false), categoria, this.date)
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
    ws = utils.json_to_sheet(this.getDelimitedData(true),
      { header: [], skipHeader: false });
    // Encabezados personalizados
    if (ws.A1) { // Valida si hay datos
      ws.A1.v = 'Fecha';
      ws.B1.v = 'Número';
      ws.C1.v = 'Descripción';
      ws.D1.v = 'Valor Adquisición';
      ws.E1.v = 'Depre. Acum';
      ws.F1.v = 'Valor';
    }
    const wb: WorkBook = utils.book_new();
    utils.book_append_sheet(wb, ws, 'Inventario Activos Depreciacion');
    writeFile(wb, 'Inventario Activos Depreciacion.xlsx');
  }else{
    this.snackBar.open('No hay datos para exportar', 'AVISO', {
      duration: 2000
    });
  }
  }

  getDelimitedData(fixed: boolean): any[] {
    let cont = this.first_row - 1;
    let data = []
    while (cont < this.last_row && cont < this.rows.length) {
      data.push({
        fecha: this.common.getLocalDateString(this.rows[cont].fecha_compra),
        numero: this.rows[cont].numero,
        descripcion: this.rows[cont].descripcion,
        precio: fixed ? this.rows[cont].precio.toFixed(2) : this.rows[cont].precio,
        depreciacion: fixed ? this.rows[cont].depreciacion.toFixed(2) : this.rows[cont].depreciacion,
        valor: fixed ? this.rows[cont].valor.toFixed(2) : this.rows[cont].valor,
      })
      cont++;
    }
    return data;
  }

  getCategoryName(id: number) {
    for (let index = 0; index < this.categorias.length; index++) {
      const element = this.categorias[index];
      if (element.id_categoria == id) {
        return element.nombre;
      }
    }
  }

}
