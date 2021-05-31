import { Injectable } from "@angular/core";
import { CommonFunction } from "app/inventario/shared/common";
import { ActivosPorUsuario } from "app/modelos/inventario/reportes/activosPorUsuario";
import { Usuario } from "app/modelos/inventario/usuario";
import { Categoria } from "app/modelos/inventario/categoria";

@Injectable({
    providedIn: 'root'
})

export class PlantillaDonaciones {

    constructor(private common: CommonFunction) { }

    public getDocument(rows: any[], inicio: string, fin: string,acta: string, categoria: string, membretado: boolean) {
        let docDefinition = {
            pageMargins: [80, 100, 80, 30],
            pageSize: 'LEGAL',
            header: this.getHeader(membretado),
            content: [
                ...this.getTitle(inicio, acta), 
                this.getTable(rows,categoria),
                this.getPostTable(fin),
                this.getGenerationDate(membretado)
            ]
        };

        return docDefinition;
    }

    private getHeader(membretado: boolean) {
        return !membretado?{
            text: `UNIVERSIDAD DE SAN CARLOS DE GUATEMALA \r\n PLAN DE PRESTACIONES`,
            style: 'header',
            alignment: "left",
            fontSize: 10,
            bold: true,
            margin: [50, 50, 50, 50],
        }:{}
    }

    private getTitle(inicio: string, acta: string) { 
        return [
            {
                text: `ACTA No. ${acta}`,
                style: 'header',
                alignment: "center",
                fontSize: 12,
                bold: true,
                margin: [0, 20],
            },
            {
                text: inicio,
                alignment: 'justify',
                fontSize: 9,
            }
        ]
    }

    private getTable(rows: any[], categoria: string) {
        return {
            style: 'tableExample',
            margin: [0, 20, 0, 20],
            fontSize: 9,
            alignment: "center",
            table: {
                headerRows: 1,
                widths: ['12%', '55%', '18%', '15%'],
                body: [
                    [{ text: 'No. Orden', style: 'tableHeader' }, { text: 'Descripción', style: 'tableHeader' }, { text: 'No. Inventario', style: 'tableHeader' }, { text: 'Valor residual', style: 'tableHeader' }],
                    [{}, { text: `Cuenta: ${categoria}`, bold: true, alignment: 'left' }, {}, {}],
                    ...rows.map(p => ([p.contador, { text: p.descripcion, alignment: 'justify' }, p.inventario, { text: p.precio.toLocaleString(this.common.localNumber, this.common.numberOptions), alignment: 'right' }])),
                    [{}, {}, { text: 'Total:', colSpan: 1, bold: true }, { text: 'Q ' + rows.reduce((sum, p) => sum + (p.precio), 0).toLocaleString(this.common.localNumber, this.common.numberOptions), bold: true, alignment: 'right' }]
                ]
            }
        }
    }

    getPostTable(fin: string) {
        return {
            text: fin,
            alignment: 'justify',
            fontSize: 9
        }
    }


    private getGenerationDate(membretado: boolean) {
        return !membretado?{
            text: `Guatemala, ${new Date().toLocaleDateString(this.common.localDate, this.common.dateOptions)}`,
            alignment: "left",
            fontSize: 9,
            bold: true,
            margin: [10, 15, 0, 15],
        }:{}
    }
}