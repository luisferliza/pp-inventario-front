import { Component, OnInit } from '@angular/core';
import { MatSnackBar, MatDialog } from '@angular/material';
import { CommonFunction } from 'app/inventario/shared/common';
import { ReportesInversionesService } from 'app/servicios/inversiones/reportes-inversiones.service';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { WorkSheet, WorkBook, utils, writeFile } from "xlsx";
import { Firmante } from 'app/modelos/inversiones/firmante';
import { FirmanteService } from 'app/servicios/inversiones/firmante.service';
import { PlantillaAnexo4 } from './anexo4-plantilla';
import { TipoEntidad } from 'app/modelos/inversiones/tipo-entidad';
import { TipoEntidadService } from 'app/servicios/inversiones/tipo-entidad.service';
import { TotalInversionesPorBanco } from 'app/modelos/inversiones/totalInversionesPorBanco';
import { Anexo4DialogComponent } from './anexo4-dialog/anexo4-dialog.component';
import { InversionesPorTipoBanco } from 'app/modelos/inversiones/inversionesPorTipoBanco';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'elastic-anexo4',
  templateUrl: './anexo4.component.html',
  styleUrls: ['./anexo4.component.scss']
})
export class Anexo4Component implements OnInit {

  pidu = '10';
  rows: TotalInversionesPorBanco[];
  entidades: TipoEntidad[];
  id_entidad: number;
  fecha = new Date();
  contador: Firmante;
  administrador: Firmante;
  asistente: Firmante;
  //False es bienes activos, true es fungibles

  constructor(private reportesService: ReportesInversionesService,
    private tipoEntidadService: TipoEntidadService,
    public common: CommonFunction,
    private snackBar: MatSnackBar,
    private plantilla: PlantillaAnexo4,
    private firmanteService: FirmanteService,
    private dialog: MatDialog) { }

  ngOnInit(): void {
    this.getTiposEntidad();
    this.getFirmantes(this.common.contador);
    this.getFirmantes(this.common.administrador);
    this.getFirmantes(this.common.asistente_administrativo);
    this.fecha.setHours(0);
  }

  getTiposEntidad() {
    this.tipoEntidadService.listar(this.pidu).subscribe(data => {
      this.entidades = data;
      this.id_entidad = data[0].id_tipo_entidad;
      this.listar()
    })
  }

  getFirmantes(firmante: string) {
    this.firmanteService.obtenerFirmante(this.pidu, firmante).subscribe(data => {
      if (data.length > 0) {
        if (firmante === this.common.administrador) {
          this.administrador = data[0];
        } else if (firmante === this.common.contador) {
          this.contador = data[0];
        } else {
          this.asistente = data[0];
        }
      } else {
        this.snackBar.open(`${firmante} No encontrado`, 'AVISO', {
          duration: 2000
        });
      }
    });
  }

  listar() {
    this.reportesService.anexo4VistaPrevia(this.pidu, this.fecha, this.id_entidad).subscribe(data => {
      this.rows = data;
      document.getElementById('table').click();
    });
  }

  downloadExcel() {
    this.reportesService.anexo4(this.pidu, this.fecha).subscribe(data => {
      if (data.length > 0) {
        let wb = this.createDataArray(data);
        writeFile(wb, 'Integración a plazo.xlsx');
      } else {
        this.snackBar.open('No hay datos para exportar', 'AVISO', {
          duration: 2000
        });
      }
    })
  }

  createDataArray(data: InversionesPorTipoBanco[]) {
    const wb: WorkBook = utils.book_new();
    data.forEach(element => {
      let ws: WorkSheet;
      ws = utils.json_to_sheet(this.getInversioninfo(element.bancos, element.totalCategoria), { header: [], skipHeader: false });
      // Encabezados personalizados
      if (ws.A1) { // Valida si hay datos
        ws.A1.v = 'Institución';
        ws.B1.v = 'Cantidad';
        ws.C1.v = 'Porcentaje';
      }
      utils.book_append_sheet(wb, ws, element.nombreCategoria);
    });
    return wb;
  }


  getInversioninfo(inv: TotalInversionesPorBanco[], total: number) {
    return inv.map(p => ([
      p.nombre,
      p.monto,
      total == 0 ? 0 : p.monto / total
    ]))
  }


  downloadPDF() {
    this.dialog.open(Anexo4DialogComponent).afterClosed().subscribe((response) => {
      if (response) {
        this.reportesService.anexo4(this.pidu, this.fecha).subscribe(data => {
          if (data.length > 0) {            
            let docDefinition = this.plantilla.getDocument( data, response.prestamos,response.prima, response.descuentos, response.anexo,
                                                            this.fecha, this.contador, this.administrador, this.asistente);
            pdfMake.createPdf(docDefinition).open();
          }
          else {
            this.snackBar.open('No hay datos para exportar', 'AVISO', {
              duration: 2000
            });
          }
        })
      }
    });
  }
}
