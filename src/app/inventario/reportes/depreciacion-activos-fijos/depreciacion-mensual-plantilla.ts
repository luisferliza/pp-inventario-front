import { Injectable } from "@angular/core";
import { CommonFunction } from "app/inventario/shared/common";

@Injectable({
    providedIn: 'root'
})

export class PlantillaDepreciacionMensual {

    constructor(private common: CommonFunction) { }

    public getDocument(rows: any[], categoria: string, date: Date) {
        let reference = this;
        let docDefinition = {
            pageMargins: [50, 90, 50, 50],
            pageSize: 'LETTER',
            header: function (currentPage) { return reference.getHeader(currentPage, categoria, date); },
            footer: function (currentPage, pageCount) { return reference.getFooter(currentPage, pageCount); },
            content: [                
                this.getCategoria(categoria),
                this.getTable(rows, categoria),                
            ]
        };

        return docDefinition;
    }

    private getHeader(page, categoria, date: Date) {
        if (page === 1) {
            let otherDate = new Date(date.getTime());
            otherDate.setDate(1);
            return {
                text: `Plan de Prestaciones, USAC \r\n Reporte de gastos por depreciación de activos fijos \r\n ${otherDate.toLocaleDateString(this.common.localDate, this.common.dateOptions)} al ${date.toLocaleDateString(this.common.localDate, this.common.dateOptions)}`, 
                style: 'header',
                alignment: "center",
                fontSize: 10,
                bold: true,
                margin: [10, 50, 10, 20],
            }
        }
        return {
            text: categoria,
            style: 'subheader',
            fontSize: 10,
            bold: true,
            decoration: 'underline',
            margin: [60, 50, 10, 20],
        }
    }

    private getCategoria(categoria){
        return {
            text: categoria,
            style: 'subheader',
            fontSize: 10,
            bold: true,
            decoration: 'underline',
            margin: [10, 10, 10, 0],
        }
    }

    private getTable(rows: any[], categoria) {
        return {
            style: 'tableExample',
            margin: [10, 8, 10, 50],
            fontSize: 8,
            alignment: "center",
            table: {
                headerRows: 1,
                widths: ['14%', '19%', '33%', '17%', '17%',],
                body: [
                    [{ text: 'Fecha Factura', style: 'tableHeader' }, { text: 'Número', style: 'tableHeader' }, { text: 'Descripción', style: 'tableHeader' }, { text: 'Valor adquisición', style: 'tableHeader' }, { text: 'Depreciación', style: 'tableHeader' }],
                    ...rows.map(p => ([p.fecha, p.numero, { text: p.descripcion, alignment: 'justify' }, { text: p.precio.toLocaleString(this.common.localNumber, this.common.numberOptions), alignment: 'right' }, { text: p.depreciacion.toLocaleString(this.common.localNumber, this.common.numberOptions), alignment: 'right' }])),
                    [{}, {}, { text: 'Total:', colSpan: 1, bold: true },
                    { text: 'Q ' + rows.reduce((sum, p) => sum + (p.precio), 0).toLocaleString(this.common.localNumber, this.common.numberOptions), bold: true, alignment: 'right' },
                    { text: 'Q ' + rows.reduce((sum, p) => sum + (p.depreciacion), 0).toLocaleString(this.common.localNumber, this.common.numberOptions), bold: true, alignment: 'right' }]]            },
            layout: 'headerLineOnly'
        }
    }
    

    private getFooter(currentPage, pageCount) {
        return {
            text: currentPage.toString() + ' de ' + pageCount + '   ',
            fontSize: 8,
            alignment: 'center',
            margin: [0, 10, 0, 20]
        }
    }
}