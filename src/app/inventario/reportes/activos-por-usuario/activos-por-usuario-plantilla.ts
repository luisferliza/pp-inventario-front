import { Injectable } from "@angular/core";
import { CommonFunction } from "app/inventario/shared/common";
import { ActivosPorUsuario } from "app/modelos/inventario/reportes/activosPorUsuario";
import { Usuario } from "app/modelos/inventario/usuario";

@Injectable({
    providedIn: 'root'
})

export class PlantillaActivosPorUsuario {

    constructor(private common: CommonFunction) { }

    public getDocument(rows: ActivosPorUsuario[], usuario: Usuario) {
        let docDefinition = {
            pageMargins: [50, 90, 50, 50],
            pageSize: 'LETTER',        
            header: this.getHeader(),
            content: [
                this.getTitle(),
                this.getTable( rows),                
                ... this.getFirmante(usuario),
                this.getGenerationDate()
            ]
        };

        return docDefinition;
    }

    private getHeader() {
        return {
            text: `UNIVERSIDAD DE SAN CARLOS DE GUATEMALA \r\n PLAN DE PRESTACIONES`,
            style: 'header',
            alignment: "left",
            fontSize: 10,
            bold: true,
            margin: [50, 50, 50, 50],
        }
    }

    private getTitle() {
        return {
            text: `CONSTANCIA DE BIENES ASIGNADOS`,
            style: 'header',
            alignment: "center",
            fontSize: 10,
            bold: true,
            margin: [0, 20],
        }
    }

    private getTable(rows: ActivosPorUsuario[]) {        
        return {
            style: 'tableExample',
            margin: [10, 5, 10, 40],
            fontSize: 8,
            alignment: "center",
            table: {
                headerRows: 1,
                widths: ['14%', '19%', '19%', '29%', '19%'],
                body: [
                    [
                    { text: 'Tarjeta No.', style: 'tableHeader' }, 
                    { text: 'Fecha Asignación', style: 'tableHeader' },
                    { text: 'No. Inventario', style: 'tableHeader' }, 
                    { text: 'Descripción', style: 'tableHeader' }, 
                    { text: 'Valor Neto', style: 'tableHeader' }],
                    ...rows.map(p => ([p.tarjeta , p.inicio, p.inventario, { text: p.descripcion, alignment: 'justify' }, { text: "Q" + p.precio.toLocaleString(this.common.localNumber, this.common.numberOptions), alignment: 'right' }])),
                    [{},{},{}, { text: 'Total:', bold: true, alignment: 'right' }, 
                    { text: 'Q' + rows.reduce((sum, p) => sum + (p.precio), 0).toLocaleString(this.common.localNumber, this.common.numberOptions), bold: true, alignment: 'right' }]
                ]
            },
            layout: 'headerLineOnly'
        }
    }

    private getFirmante(element: Usuario) {
        return [
            {
              text: '\t\t\t\t\t\t\t\t\t\t\t\t\t\t',            
              alignment: "center",
              fontSize: 8,            
              decoration: 'underline'                  
            },
            {
              text: element.nombrepp,            
              alignment: "center",
              fontSize: 8,
              bold: true           
            },
            {
              text: 'R.P. '+element.idUsuario,            
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

    private getGenerationDate() {
        return {
            text: `Guatemala, ${new Date().toLocaleDateString(this.common.localDate, this.common.dateOptions)}`,
            alignment: "left",
            fontSize: 9,
            bold: true,
            margin: [10, 15, 0, 15],
        } 
    }
}