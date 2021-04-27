import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { CommonFunction } from 'app/inventario/shared/common';
import { Calculos } from 'app/inversiones/inversion/calculos/calculos';
import { Banco } from 'app/modelos/inversiones/banco';
import { Inversion } from 'app/modelos/inversiones/inversion';
import { BancoService } from 'app/servicios/inversiones/banco.service';
import { ReportesInversionesService } from 'app/servicios/inversiones/reportes-inversiones';

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
  date = new Date();
  //False es bienes activos, true es fungibles

  constructor(private reportesService: ReportesInversionesService,
    private bancoService: BancoService,
    public common: CommonFunction,
    private snackBar: MatSnackBar,
    private calculos: Calculos) { }

  ngOnInit(): void {
    this.getBancos();

  }

  getBancos() {
    this.bancoService.listar(this.pidu).subscribe(data => {      
      this.bancos = data;
      this.id_banco = data[0].id_banco;
      this.listar(this.id_banco)
    })
  }

  listar(id_categoria) {    
    this.reportesService.interesMensual(this.pidu, this.date.toISOString().split('T')[0], id_categoria).subscribe(data => {     
      this.rows = data;     
      document.getElementById('table').click();
    });
  }

  update() {
    this.listar(this.id_banco);
  }

  getNextDate(date){        
    let futureDate = new Date(date);
    futureDate.setDate(futureDate.getDate() + 1)    
    return this.common.getDate(futureDate.toISOString().split('T')[0]);
  }

  getDiasInteres(inversion:Inversion){
    let fecha_vencimiento = new Date(this.date.toISOString().split('T')[0]);        
    return this.calculos.calcularDiasInteres(inversion,fecha_vencimiento)
  }

  getInteres(inversion:Inversion){
    let fecha_vencimiento = new Date(this.date.toISOString().split('T')[0]);        
    return this.calculos.calcularInteres(inversion,fecha_vencimiento)
  }


  /*
  downloadPDF() {
    var reference = this;
    if (this.rows.length > 0) {
      let usefullData = this.getSpecificData(false);
      let docDefinition = {
        pageMargins: [50, 90, 50, 50],
        pageSize: 'LETTER',
        footer: function (currentPage, pageCount) {
          return { 
                  text: currentPage.toString() + ' de ' + pageCount + '   ', 
                  fontSize: 8, 
                  alignment: 'center',
                  margin: [0,10,0,20]
                }
        },
        header: function (currentPage, pageCount, pageSize) {
          return currentPage === 1 ?
            [
              {
                text: `Universidad de San Carlos de Guatemala \r\n Reporte de inventario de Activos Fijos con depreciación acumulada \r\n ${reference.date.toLocaleDateString('es', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`,
                style: 'header',
                alignment: "center",
                fontSize: 10,
                bold: true,
                margin: [0, 50],
              }
            ] :
            [
              {
                text: reference.getCategoryName(reference.id_categoria),
                alignment: 'left',
                fontSize: 10,
                bold: true,
                margin: [60, 50],
                decoration: 'underline'
              }
            ]
        },
        content: [
          {
            text: this.getCategoryName(this.id_categoria),
            style: 'subheader',
            fontSize: 10,
            bold: true,
            decoration: 'underline'
          },
          {
            style: 'tableExample',
            margin: [10, 8, 10, 50],
            fontSize: 8,
            alignment: "center",            
            table: {              
              headerRows: 1,
              widths: ['12%', '16%', '30%', '14%', '14%', '14%'],
              body: [
                [{ text: 'Fecha Factura', style: 'tableHeader' }, { text: 'Número', style: 'tableHeader' }, { text: 'Descripción', style: 'tableHeader' }, { text: 'V/Adquisición', style: 'tableHeader' }, { text: 'Depre. Acum', style: 'tableHeader' }, { text: 'Valor', style: 'tableHeader' }],
                ...usefullData.map(p => ([p.fecha, p.numero, { text: p.descripcion, alignment: 'justify' }, {text: p.precio.toLocaleString('en', this.common.options), alignment: 'right'}, {text: p.depreciacion.toLocaleString('en', this.common.options), alignment: 'right'}, {text: p.valor.toLocaleString('en', this.common.options), alignment: 'right'}])),
                [{}, {}, { text: 'Total:', colSpan: 1, bold: true },
                { text: 'Q ' + usefullData.reduce((sum, p) => sum + (p.precio), 0).toLocaleString('en', this.common.options), bold: true , alignment: 'right'},
                { text: 'Q ' + usefullData.reduce((sum, p) => sum + (p.depreciacion), 0).toLocaleString('en', this.common.options), bold: true , alignment: 'right'},
                { text: 'Q ' + usefullData.reduce((sum, p) => sum + (p.valor), 0).toLocaleString('en', this.common.options), bold: true , alignment: 'right'}]]
            },
            layout: 'headerLineOnly'
          }
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
    ws = utils.json_to_sheet(this.getSpecificData(true),
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

  getSpecificData(fixed: boolean): any[] {
    let cont = this.first_row - 1;
    let data = []
    while (cont < this.last_row && cont < this.rows.length) {
      data.push({
        fecha: this.common.getDate(this.rows[cont].fecha_compra),
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
  */
  

}
