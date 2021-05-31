import { Injectable } from "@angular/core";
import { CommonFunction } from "app/inventario/shared/common";

@Injectable({
    providedIn: 'root'
})

export class PlantillaResponsableActivos {

    constructor(private common: CommonFunction) { }

    public getDocument(rows: any[]) {
        let docDefinition = {
            pageMargins: [50, 90, 50, 30],
            pageSize: 'LEGAL',
            header: this.getHeader(),
            content: [
                this.getTitle(),
                this.getTable(rows),
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

    getTitle() {
        return {
            text: 'REPORTE INTERNO DE INVENTARIO',
            style: 'header',
            alignment: "center",
            bold: true,
            fontSize: 10,
        }
    }

    private getTable(rows: any[]) {
        return {
            style: 'tableExample',
            margin: [8, 30, 8, 8],
            fontSize: 9,
            alignment: "center",
            table: {
                headerRows: 1,
                widths: ['13%', '12%', '13%', '30%', '17%', '15%'],
                body: [
                    [{ text: 'Número Inventario', style: 'tableHeader' }, { text: 'Alta el', style: 'tableHeader' }, { text: 'Valor factura', style: 'tableHeader' }, { text: 'Activo', style: 'tableHeader' }, { text: 'Responsable', style: 'tableHeader' }, { text: 'Ubicación', style: 'tableHeader' }],
                    ...rows.map(p => ([p.inventario, p.fecha_compra, { text: p.precio.toLocaleString(this.common.localNumber, this.common.numberOptions), alignment: 'right' }, p.descripcion, p.responsable.replace(',','\r\n'), p.ubicacion])),
                    [{}, { text: 'Total:', colSpan: 1, bold: true }, { text: 'Q ' + rows.reduce((sum, p) => sum + (p.precio), 0).toLocaleString(this.common.localNumber, this.common.numberOptions), bold: true, alignment: 'right' }, {}, {}, {}]
                ]
            },
            layout: 'headerLineOnly'
        }
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