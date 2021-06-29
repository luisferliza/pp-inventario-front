import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { CommonFunction } from 'app/inventario/shared/common';
import { ActivosPorUsuario } from 'app/modelos/inventario/reportes/activosPorUsuario';
import { Usuario } from 'app/modelos/inventario/usuario';
import { ReportesInventarioService } from 'app/servicios/inventario/reportes.service';
import { UsuarioService } from 'app/servicios/inventario/usuario.service';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { WorkSheet, WorkBook, utils, writeFile } from "xlsx";
import { PlantillaActivosPorUsuario } from './activos-por-usuario-plantilla';
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

  constructor(private reportesService: ReportesInventarioService,
    private usuarioService: UsuarioService,
    public common: CommonFunction,
    private snackBar: MatSnackBar,
    private plantilla: PlantillaActivosPorUsuario) { }

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

  getUsuarios() {
    this.usuarioService.listar(this.pidu).subscribe(data => {
      if (data) {
        this.id_usuario = data[0].idUsuario;
      }
      this.usuarios = data;
      this.listar();
    })
  }

  downloadPDF() {
    if (this.rows.length > 0) {      
      let docDefinition = this.plantilla.getDocument( this.getDelimitedData(), this.getUserInfo()) 
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
      ws = utils.json_to_sheet(this.getDelimitedData(),
        { header: [], skipHeader: false });
      // Encabezados personalizados
      if (ws.A1) { // Valida si hay datos        
        ws.A1.v = 'Tarjeta No';
        ws.B1.v = 'Fecha Asignación';
        ws.C1.v = 'No. Inventario';
        ws.D1.v = 'Descripción';
        ws.E1.v = 'Precio';
      }
      const wb: WorkBook = utils.book_new();
      utils.book_append_sheet(wb, ws, 'Activos por usuario');
      writeFile(wb, 'Activos por usuario.xlsx');
    } else {
      this.snackBar.open('No hay datos para exportar', 'AVISO', {
        duration: 2000
      });
    }
  }

  getDelimitedData(): ActivosPorUsuario[] {
    let cont = this.first_row - 1;
    let data = []
    while (cont < this.last_row && cont < this.rows.length) {
      data.push({
        tarjeta: this.rows[cont].tarjeta,
        inicio: this.common.getLocalDateString(this.rows[cont].inicio),
        inventario: this.rows[cont].inventario,
        descripcion: this.rows[cont].descripcion,
        precio: this.rows[cont].precio        
      })
      cont++;
    }
    return data;
  }

  getUserInfo(): Usuario {
    for (let index = 0; index < this.usuarios.length; index++) {
      const element = this.usuarios[index];
      if (element.idUsuario === this.id_usuario) {
        return element;
      }

    }
  }

}
