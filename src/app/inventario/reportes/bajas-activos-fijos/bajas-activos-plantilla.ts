import { Injectable } from "@angular/core";
import { CommonFunction } from "app/inventario/shared/common";

@Injectable({
    providedIn: 'root'
})

export class PlantillaBajasActivosFijos {

    constructor(private common: CommonFunction) { }

    public getDocument(rows: any[], membretado:boolean) {
        let docDefinition = {
            pageMargins: [50, 90, 50, 50],
            pageSize: 'LEGAL',
            header: this.getHeader(membretado),
            content: [
                this.getTitle(membretado),
                this.getTable(rows),
                this.getGenerationDate(membretado)                
            ]
        };

        return docDefinition;
    }

    private getHeader(membretado: Boolean) {
        return !membretado?{
            text: `UNIVERSIDAD DE SAN CARLOS DE GUATEMALA \r\n PLAN DE PRESTACIONES`,
            style: 'header',
            alignment: "left",
            fontSize: 10,
            bold: true,
            margin: [50, 50, 50, 50],
        }:{}
    }

    private getTitle(membretado: Boolean) {
        return !membretado? {
            text: `BAJAS DE ACTIVOS FIJOS`,
            style: 'header',
            alignment: "center",
            fontSize: 10,
            bold: true,
            margin: [50, 20, 50, 10],
        }:{}
    }

    private getTable(rows: any[]) {
        return {
            style: 'tableExample',
            margin: [10, 20, 10, 5],
            fontSize: 8,
            alignment: "center",
            table: {
                headerRows: 1,
                widths: ['8%', '12%', '16%', '37%', '16%', '10%'],
                body: [
                    [{ text: 'No. Orden', style: 'tableHeader' }, { text: 'Fecha Factura', style: 'tableHeader' }, { text: 'Número', style: 'tableHeader' }, { text: 'Descripción', style: 'tableHeader' }, { text: 'V/Adquisición', style: 'tableHeader' }, { text: 'Tarjeta No.', style: 'tableHeader' }],
                    ...rows.map(p => ([p.orden, p.fecha, p.numero, { text: p.descripcion, alignment: 'justify' }, { text: "Q"+p.precio.toLocaleString(this.common.localNumber, this.common.numberOptions), alignment: 'right' }, p.tarjeta])),
                    [{}, {}, {}, { text: 'Total:', colSpan: 1, bold: true }, { text: 'Q ' + rows.reduce((sum, p) => sum + (p.precio), 0).toLocaleString(this.common.localNumber, this.common.numberOptions), bold: true, alignment: 'right' }, {}]
                ]
            },
            layout: 'headerLineOnly'
        }
    }
    private getGenerationDate(membretado: boolean) {
        return !membretado ? {
            text: `Guatemala, ${new Date().toLocaleDateString(this.common.localDate, this.common.dateOptions)}`,
            alignment: "left",
            fontSize: 9,
            bold: true,
            margin: [10, 15, 0, 15], 
        } : {}
    }
}