import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { CommonFunction } from 'app/inventario/shared/common';
import { ActivosPorUsuario } from 'app/modelos/inventario/reportes/activosPorUsuario';
import { InventarioActivosFijos } from 'app/modelos/inventario/reportes/InventarioActivosFijos';
import { Usuario } from 'app/modelos/inventario/usuario';
import { ReportesService } from 'app/servicios/inventario/reportes.service';
import { UsuarioService } from 'app/servicios/inventario/usuario.service';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { WorkSheet, WorkBook, utils, writeFile } from "xlsx";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'elastic-activos-por-usuario',
  templateUrl: './activos-por-usuario.component.html',
  styleUrls: ['./activos-por-usuario.component.scss']
})
export class ActivosPorUsuarioComponent implements OnInit {

  pidu = '10';
  valor = 1;
  first_row: number = 0;
  last_row: number = 0;
  rows: ActivosPorUsuario[];
  usuarios: Usuario[];
  tipo_bien = "false";
  id_usuario: number;
  //False es bienes activos, true es fungibles

  constructor(private reportesService: ReportesService,
              private usuarioService: UsuarioService,
              public common: CommonFunction,
              private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.getUsuarios();
  }

  listar() {    
    this.reportesService.activosPorUsuario(this.pidu, this.tipo_bien, this.id_usuario).subscribe(data => {
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

  getUsuarios(){
    this.usuarioService.listar(this.pidu).subscribe(data=>{
      if(data){
        this.id_usuario = data[0].registro;
      }
      this.usuarios = data;
      this.listar();
    })
  }
  
  downloadPDF() {      
    if (this.rows.length > 0) {
      let usefulData = this.getSpecificData();
      let docDefinition = {
        pageMargins: [40, 40, 40, 30],
        pageSize: 'LETTER',        
        content: [
          {
            text: `Universidad de San Carlos de Guatemala \r\n
                   Constancia de bienes asignados - Plan de prestaciones \r\n                    
                   ${new Date().toLocaleDateString('es', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`,
            style: 'header',
            alignment: "center",
            fontSize: 10,
            bold: true,
            margin: [0, 20],
          },
          {
            style: 'tableExample',
            margin: [10, 5, 10, 40],
            fontSize: 8,
            alignment: "center",
            table: {
              headerRows: 1,
              widths: ['12%', '13%', '28%', '13%', '8%', '13%', '13%'],
              body: [
                [{ text: 'Código', style: 'tableHeader' }, { text: 'No. Inventario', style: 'tableHeader' }, { text: 'Descripción', style: 'tableHeader' }, { text: 'V/Adquisición', style: 'tableHeader' }, { text: 'Tarjeta No.', style: 'tableHeader' }, { text: 'Fecha Asignación', style: 'tableHeader' }, { text: 'Fecha Fin', style: 'tableHeader' }],
                ...usefulData.map(p => ([p.codigo, p.inventario, {text:p.descripcion, alignment: 'justify'}, p.precio.toLocaleString('en', this.common.options), p.tarjeta, p.inicio, p.fin])),                
                [{}, {},  { text: 'Total:', colSpan: 1, bold: true }, { text: 'Q ' + usefulData.reduce((sum, p) => sum + (p.precio), 0).toLocaleString('en', this.common.options), bold: true }, {}, {}, {}]
              ]
            },
            layout: 'headerLineOnly'
          },
          ...this.getUserInfo() 
          
        ]
      };
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
      ws = utils.json_to_sheet(this.getSpecificData(),
        { header: [], skipHeader: false });
      // Encabezados personalizados
      if (ws.A1) { // Valida si hay datos
        ws.A1.v = 'Código';
        ws.B1.v = 'No. Inventario';
        ws.C1.v = 'Descripción';
        ws.D1.v = 'Precio';
        ws.E1.v = 'Tarjeta No.';
        ws.F1.v = 'Fecha Asignación';
        ws.G1.v = 'Fecha Fin';
      }
      const wb: WorkBook = utils.book_new();
      utils.book_append_sheet(wb, ws, 'Inventario Activos Fijos');
      writeFile(wb, 'Inventario Activos Fijos.xlsx');
    } else {
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
        codigo: this.rows[cont].codigo,
        inventario: this.rows[cont].inventario,
        descripcion: this.rows[cont].descripcion,
        precio: this.rows[cont].precio,
        tarjeta: this.rows[cont].tarjeta,
        inicio: this.common.getDate(this.rows[cont].inicio),
        fin: this.common.getDate(this.rows[cont].fin)        
      })
      cont++;
    }
    return data;
  }  

  getUserInfo(){
    for (let index = 0; index < this.usuarios.length; index++) {
      const element = this.usuarios[index];
      if(element.registro=== this.id_usuario){
        return [
          {
            text: '\t\t\t\t\t\t\t\t\t\t\t\t\t\t',            
            alignment: "center",
            fontSize: 8,            
            decoration: 'underline'                  
          },
          {
            text: element.nombre,            
            alignment: "center",
            fontSize: 8,
            bold: true           
          },
          {
            text: 'R.P. '+element.registro,            
            alignment: "center",
            fontSize: 8,
            bold: true                             
          },
          {
            text: element.puesto,            
            alignment: "center",
            fontSize: 8,
            bold: true           
          },
        ]
      }
      
    }
  }

}
