import { Component, OnInit } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { CommonFunction } from 'app/inventario/shared/common';
import { Categoria } from 'app/modelos/inventario/categoria';
import { Donacion } from 'app/modelos/inventario/reportes/donaciones';
import { CategoriaService } from 'app/servicios/inventario/categoria.service';
import { ReportesService } from 'app/servicios/inventario/reportes.service';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { WorkSheet, WorkBook, utils, writeFile } from "xlsx";
import { DonacionesDialogComponent } from './donaciones-dialog/donaciones-dialog.component';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'elastic-donaciones',
  templateUrl: './donaciones.component.html',
  styleUrls: ['./donaciones.component.scss']
})
export class DonacionesComponent implements OnInit {

  pidu = '10';
  valor = 1;
  first_row: number = 0;
  last_row: number = 0;
  rows: Donacion[];
  id_categoria: number;
  categorias: Categoria[];
  tipo_bien = "false";
  //False es bienes activos, true es fungibles

  constructor(private reportesService: ReportesService,
    private categoriaService: CategoriaService,
    public common: CommonFunction,
    private snackBar: MatSnackBar, 
    private dialog: MatDialog) { }

  ngOnInit(): void {
    this.getCategorias()

  }

  getCategorias() {
    this.categoriaService.listar(this.pidu).subscribe(data => {
      this.categorias = data;
      this.id_categoria = data[0].id_categoria;
      this.listar()
    })
  }

  listar() {
    
    this.reportesService.donaciones(this.pidu, this.tipo_bien, this.id_categoria).subscribe(data => {
      this.valor = 1;
      this.rows = data;
      this.last_row = data.length;
      this.first_row = data.length == 0 ? 0 : 1;
      document.getElementById('table').click();
    });
  }

  update() {
    this.listar();
  }

  getValor() {
    if (this.valor > this.rows.length)
      this.valor = 1;
    return this.valor++;
  }

  crearPDF() {    
    if (this.rows.length > 0) {
      this.dialog.open(DonacionesDialogComponent, { width: '600px' }).afterClosed().subscribe((data) => {
        if (data) {
          this.downloadPDF(data.acta, data.inicio, data.fin);
        }
      });    
    }else {
      this.snackBar.open('No hay datos para exportar', 'AVISO', {
        duration: 2000
      });
    }
  }


  downloadPDF(acta, inicio, fin) {
    // Set the fonts to use    
    
      let usefulData = this.getSpecificData();
      let docDefinition = {
        pageMargins: [80, 100, 80, 30],
        pageSize: 'LEGAL',   
        content: [
          {
            text: `ACTA No. ${acta}`,
            style: 'header',
            alignment: "center",
            fontSize: 12,
            bold: true,
            margin: [0, 20],
          },
          {
            text: inicio, 
            alignment: 'justify', 
            fontSize: 9,           
          },
          {
            style: 'tableExample',
            margin: [0, 20, 0, 20],
            fontSize: 9,
            alignment: "center",
            table: {
              headerRows: 1,
              widths: ['12%', '55%', '18%', '15%'],
              body: [
                [{ text: 'No. Orden', style: 'tableHeader' }, { text: 'Descripción', style: 'tableHeader' }, { text: 'No. Inventario', style: 'tableHeader' }, { text: 'Valor residual', style: 'tableHeader' }],
                [{}, {text:`Cuenta: ${this.getCategoryName()}`, bold:true, alignment: 'left' }, {},{}],
                ...usefulData.map(p => ([p.contador, { text: p.descripcion, alignment: 'justify' }, p.inventario, p.precio.toLocaleString('en', this.common.options)])),
                [{}, {}, { text: 'Total:', colSpan: 1, bold: true }, { text: 'Q ' + usefulData.reduce((sum, p) => sum + (p.precio), 0).toLocaleString('en', this.common.options), bold: true }]
              ]
            }
          },
          {
            text: fin, 
            alignment: 'justify',
            fontSize: 9                     
          },
        ]
      };
      pdfMake.createPdf(docDefinition).open();    
  }

  downloadExcel() {
    if (this.rows.length > 0) {
      let ws: WorkSheet;
      ws = utils.json_to_sheet(this.getSpecificData(),
        { header: [], skipHeader: false });
      // Encabezados personalizados
      if (ws.A1) { // Valida si hay datos
        ws.A1.v = 'No. Orden';
        ws.B1.v = 'Descripción';
        ws.C1.v = 'No. Inventario';
        ws.D1.v = 'Valor residual';
      }
      const wb: WorkBook = utils.book_new();
      utils.book_append_sheet(wb, ws, 'Bajas de inventario');
      writeFile(wb, 'Bajas de inventario.xlsx');
    }
    else {
      this.snackBar.open('No hay datos para exportar', 'AVISO', {
        duration: 2000
      });
    }
  }

  getSpecificData(): any[] {

    let cont = this.first_row - 1;
    let data = []
    while (cont < this.last_row && cont < this.rows.length) {
      data.push({
        contador: cont+1,
        descripcion: this.rows[cont].descripcion,
        inventario: this.rows[cont].inventario,
        precio: this.rows[cont].precio
      })
      cont++;
    }
    return data;
  }

  getCategoryName(){
    for (let index = 0; index < this.categorias.length; index++) {
      const element = this.categorias[index];
      if(element.id_categoria == this.id_categoria){
        return element.nombre;
      }      
    }
    return '-'
  }


}
