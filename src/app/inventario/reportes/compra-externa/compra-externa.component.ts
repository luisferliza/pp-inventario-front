import { Component, OnInit } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { CommonFunction } from 'app/inventario/shared/common';
import { Categoria } from 'app/modelos/inventario/categoria';
import { SubastaBienes } from 'app/modelos/inventario/reportes/subastaBienes';
import { CategoriaService } from 'app/servicios/inventario/categoria.service';
import { ReportesInventarioService } from 'app/servicios/inventario/reportes.service';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { WorkSheet, WorkBook, utils, writeFile } from "xlsx";
import { CompraExternaDialogComponent } from './compra-externa-dialog/compra-externa-dialog.component';
import { PlantillaCompraExterna } from './compra-externa-plantilla';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'elastic-compra-externa',
  templateUrl: './compra-externa.component.html',
  styleUrls: ['./compra-externa.component.scss']
})
export class CompraExternaComponent implements OnInit {

  pidu = '10';
  valor = 1;
  first_row: number = 0;
  last_row: number = 0;
  rows: SubastaBienes[];
  exportRows: SubastaBienes[];
  id_categoria: number;
  categorias: Categoria[];
  tipo_bien = "false";
  //False es bienes activos, true es fungibles

  constructor(private reportesService: ReportesInventarioService,
    private categoriaService: CategoriaService,
    public common: CommonFunction,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private plantilla: PlantillaCompraExterna) { }

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
    this.reportesService.compraExterna(this.pidu, this.tipo_bien, this.id_categoria).subscribe(data => {
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
      this.dialog.open(CompraExternaDialogComponent, { width: '600px' }).afterClosed().subscribe((data) => {
        if (data) {
          this.downloadPDF(data.inicio);
        }
      });
    } else {
      this.snackBar.open('No hay datos para exportar', 'AVISO', {
        duration: 2000
      });
    }
  }


  downloadPDF(inicio) {    
    let docDefinition = this.plantilla.getDocument(this.getDelimitedData(), inicio, this.getCategoryName())
    pdfMake.createPdf(docDefinition).open();
  }

  downloadExcel() {
    if (this.rows.length > 0) {
      let ws: WorkSheet;
      ws = utils.json_to_sheet(this.getDelimitedData(),
        { header: [], skipHeader: false });
      // Encabezados personalizados
      if (ws.A1) { // Valida si hay datos
        ws.A1.v = 'No. Orden';
        ws.B1.v = 'Descripción';
        ws.C1.v = 'No. Inventario';
        ws.D1.v = 'Valor residual';
      }
      const wb: WorkBook = utils.book_new();
      utils.book_append_sheet(wb, ws, 'Compra Externa');
      writeFile(wb, 'Compra Externa.xlsx');
    }
    else {
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
        contador: cont + 1,
        descripcion: this.rows[cont].descripcion,
        inventario: this.rows[cont].inventario,
        precio: this.rows[cont].precio,
        residual: this.rows[cont].residual
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

