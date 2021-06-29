import { Injectable } from "@angular/core";
import { CommonFunction } from "app/inventario/shared/common";
import { ActivosPorUsuario } from "app/modelos/inventario/reportes/activosPorUsuario";
import { Usuario } from "app/modelos/inventario/usuario";

@Injectable({
    providedIn: 'root'
})

export class PlantillaCompraExterna {

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
              widths: ['10%', '40%', '18%', '16%', '16%'],
              body: [
                [{ text: 'No. ', style: 'tableHeader'}, 
                { text: 'DESCRIPCIÓN CORRECTA DEL BIEN', style: 'tableHeader' }, 
                { text: 'INVENTARIO NO.', style: 'tableHeader' }, 
                { text: 'VALOR DE VENTA Q.', style: 'tableHeader' }, 
                { text: 'CONDICIÓN', style: 'tableHeader' }],            
              ...rows.map(p => ([p.contador, 
                                { text: p.descripcion, alignment: 'justify' }, 
                                p.inventario, 
                                { text: "Q"+p.residual.toLocaleString(this.common.localNumber, this.common.numberOptions), alignment: 'right'}, 
                                p.condicion])),              
              [{}, {}, { text: 'Total:', bold: true }, { text: 'Q ' + rows.reduce((sum, p) => sum + (p.residual), 0).toLocaleString(this.common.localNumber, this.common.numberOptions), bold: true , alignment: 'right'}, {}]
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