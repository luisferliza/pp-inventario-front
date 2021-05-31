import { Injectable } from "@angular/core";
import { CommonFunction } from "app/inventario/shared/common";
import { ActivosPorUsuario } from "app/modelos/inventario/reportes/activosPorUsuario";
import { Usuario } from "app/modelos/inventario/usuario";

@Injectable({
    providedIn: 'root'
})

export class PlantillaSubastaBienes {

    constructor(private common: CommonFunction) { }

    public getDocument(rows: any[], inicio: string, categoria: string) {
        let docDefinition = {
            pageMargins: [80, 30, 80, 30],
            pageSize: 'LEGAL',
            pageOrientation: 'landscape',
            content: [
                this.getTitle(inicio, categoria),
                this.getTable(rows),
                this.getGenerationDate()                
            ]
        };

        return docDefinition;
    }

    private getTitle(inicio: string, categoria: string) {
        return [
            {
              text: `Universidad de San Carlos de Guatemala \r\n Plan de Prestaciones`,
              style: 'header',
              alignment: "left",
              fontSize: 12,
              bold: true,
              margin: [0, 20],
            },
            {
              text: inicio,
              alignment: 'center',
              fontSize: 10,
            },
            {
              text: `Cuenta: ${categoria}`,
              style: 'header',
              alignment: "left",
              fontSize: 12,
              bold: true,
              margin: [0, 20],
            }
        ]
    }

    private getTable(rows: any[]) {
        return {
          style: 'tableExample',
          margin: [5, 10, 5, 10],
          fontSize: 9,
          alignment: "center",
          table: {
            headerRows: 3,
            widths: ['6%', '29%', '13%', '11%', '11%', '12%', '3%', '3%', '12%'], 
            body: [
              [{ text: 'No. ', style: 'tableHeader', rowSpan: 3}, { text: 'Descripción', style: 'tableHeader', rowSpan: 3 }, { text: 'No. Inventario', style: 'tableHeader', rowSpan: 3 }, { text: 'Valor', style: 'tableHeader', rowSpan: 3 }, { text: 'Valor residual', style: 'tableHeader', rowSpan: 3 }, { text: 'Responsable', style: 'tableHeader', colSpan:4 },{},{},{}],
            [{},{},{},{},{},{text: 'Nombre', rowSpan: 2}, {text: 'Interesado',  colSpan:2 }, {}, {text: 'Firma', rowSpan: 2}],
            [{},{},{},{},{},{}, {text: 'Si'},{text: 'No'}, {}],            
            ...rows.map(p => ([p.contador, { text: p.descripcion, alignment: 'justify' }, p.inventario, {text: "Q"+p.precio.toLocaleString(this.common.localNumber, this.common.numberOptions), alignment: 'right'}, {text: "Q"+p.residual.toLocaleString(this.common.localNumber, this.common.numberOptions), alignment: 'right'}, p.responsable, '','',''])),                          
            ]
          }         
        };
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