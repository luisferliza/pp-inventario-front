import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { CommonFunction } from 'app/inventario/shared/common';
import { Banco } from 'app/modelos/inversiones/banco';
import { Firmante } from 'app/modelos/inversiones/firmante';
import { BancoService } from 'app/servicios/inversiones/banco.service';
import { FirmanteService } from 'app/servicios/inversiones/firmante.service';
import { ReportesInversionesService } from 'app/servicios/inversiones/reportes-inversiones.service';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { WorkSheet, WorkBook, utils, writeFile } from "xlsx";
import { PlantillaTasaPromedio } from './tasa-promedio-plantilla';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'elastic-tasa-promedio',
  templateUrl: './tasa-promedio.component.html',
  styleUrls: ['./tasa-promedio.component.scss']
})
export class TasaPromedioComponent implements OnInit {

  pidu = '10';
  rows = [];
  bancos: Banco[];
  anio = new Date().getFullYear();
  contador: Firmante;

  //False es bienes activos, true es fungibles

  constructor(private reportesService: ReportesInversionesService,
    private bancoService: BancoService,
    private firmanteService: FirmanteService,
    public common: CommonFunction,
    private snackBar: MatSnackBar,
    private plantilla: PlantillaTasaPromedio) { }

  ngOnInit(): void {
    this.getBancos();
    this.getFirmante();

  }

  getBancos() {
    this.bancoService.listar(this.pidu).subscribe(data => {
      this.bancos = data;
      this.getTasasDTO();
    })
  }

  getFirmante(){
    this.firmanteService.obtenerFirmante(this.pidu, this.common.contador).subscribe(data =>{
      if(data.length>0){
        this.contador = data[0];
      }else{
        this.contador = new Firmante();
        this.snackBar.open(`${this.common.contador} no registrado`, 'AVISO', {
          duration: 2000
        });
      }
      
    })
  }

  // Crea la matriz de datos con mes en el encabezado y banco en el eje lateral
  getTasasDTO() {
    this.reportesService.tasaPromedio(this.pidu, this.anio).subscribe(data => {
      this.rows = [];
      this.bancos.forEach(banco => {
        let bancoTmp = []
        bancoTmp.push(banco.nombre)
        for (let index = 0; index < 12; index++) {
          let encontrado = false;
          for (let t = 0; t < data.length; t++) {
            const element = data[t];
            if (element.idBanco === banco.id_banco && element.mes === index + 1) {
              bancoTmp.push(element.tasa);
              encontrado = true;
              break;
            }
          }
          if (!encontrado) {
            bancoTmp.push(0);
          }
        }
        this.rows.push(bancoTmp);
      })
      document.getElementById('table').click();
    })
  }


  downloadPDF() {
    if (this.rows.length > 0) {      
      let docDefinition = this.plantilla.getDocument(this.rows, this.anio, this.contador);
      pdfMake.createPdf(docDefinition).open();
      this.getTasasDTO();
    }
    else {
      this.snackBar.open('No hay datos para exportar', 'AVISO', {
        duration: 2000
      });
    }
  }

  downloadExcel() {
    if (this.rows.length > 0) {
      const wb: WorkBook = utils.book_new();      
      let ws: WorkSheet;
        ws = utils.json_to_sheet(this.rows,{ header: [], skipHeader: false });
        // Encabezados personalizados
        if (ws.A1) { // Valida si hay datos
          ws.A1.v = 'Banco';
          ws.B1.v = 'Enero';
          ws.C1.v = 'Febrero';
          ws.D1.v = 'Marzo';
          ws.E1.v = 'Abril';
          ws.F1.v = 'Mayo';
          ws.G1.v = 'Junio';
          ws.H1.v = 'Julio';
          ws.I1.v = 'Agosto';
          ws.J1.v = 'Septiembre';
          ws.K1.v = 'Octubre';
          ws.L1.v = 'Noviembre';
          ws.M1.v = 'Diciembre';                
        }
      
      utils.book_append_sheet(wb, ws, 'Tasa Maxima');
      writeFile(wb, 'Integración a plazo.xlsx');
    } else {
      this.snackBar.open('No hay datos para exportar', 'AVISO', {
        duration: 2000
      });
    }
  }




}
