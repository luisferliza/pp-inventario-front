import { Injectable } from "@angular/core";
import { CommonFunction } from "app/inventario/shared/common";
import { Firmante } from "app/modelos/inversiones/firmante";
import { InversionesPorBanco } from "app/modelos/inversiones/InversionesPorBanco";

@Injectable({
    providedIn: 'root'
})

export class PlantillaInteresMensual {

    constructor(private common: CommonFunction) { }

    appendTablesToPdf(tablas: any[]) {
        let docDefinition = {
            pageMargins: [50, 90, 50, 50],
            pageSize: 'LETTER',
            header: this.getHeader(),
            content: [
                ...tablas
            ]
        };
        return docDefinition;
    }

    private getHeader() {
        return [
            {
                text: `UNIVERSIDAD DE SAN CARLOS DE GUATEMALA \r\n PLAN DE PRESTACIONES`,
                style: 'header',
                alignment: "left",
                fontSize: 10,
                bold: true,
                margin: [50, 50, 50, 50],
            }
        ]
    }


    getTitleByTable(date: Date, row: InversionesPorBanco) {
        return [
            {
                text: `INSTITUCIÓN: ${row.banco.toUpperCase()} `,
                style: 'subheader',
                alignment: "center",
                fontSize: 10,
                bold: true,
                margin: [0, 5, 0, 0],
            },
            {
                text: `INTERESES AL ${date.toLocaleDateString(this.common.localDate, { year: 'numeric', month: 'long', day: 'numeric' }).toUpperCase()}  `,
                style: 'subheader',
                alignment: "center",
                fontSize: 10,
                bold: true,
                margin: [0, 5, 0, 0],
            },
            {
                text: `EXPRESADO EN QUETZALES`,
                style: 'subheader',
                alignment: "center",
                fontSize: 10,
                bold: true,
                margin: [0, 5, 0, 10],
            }
        ]
        // fin de método
    }



    getTable(element: InversionesPorBanco) {
        return {
            style: 'tableExample',
            margin: [10, 8, 10, 20],
            fontSize: 8,
            alignment: "center",
            table: {
                headerRows: 1,
                widths: ['13%', '17%', '21%', '14%', '10%', '10%', '15%'],
                body: [
                    [{ text: 'Tipo Docto. ', style: 'tableHeader' },
                    { text: 'No. registro', style: 'tableHeader' },
                    { text: 'Valor nominal', style: 'tableHeader' },
                    { text: 'Fecha de emisión', style: 'tableHeader' },
                    { text: 'Tasa (%)', style: 'tableHeader' },
                    { text: 'Días corridos', style: 'tableHeader' },
                    { text: 'Intereses', style: 'tableHeader' }],
                    ...element.inversiones.map(p => ([p.tipo_Inversion.nombre,
                                                    p.certificado,
                                                    { text: 'Q' + p.monto.toLocaleString(this.common.localNumber, this.common.numberOptions), alignment: 'right' },
                                                    this.common.getLocalDateString(p.fecha_colocacion),
                                                    p.tasa_interes,
                                                    p.diasInteres,
                                                    { text: 'Q' + p.interes.toLocaleString(this.common.localNumber, this.common.numberOptions), alignment: 'right' },
                                                    ])),
                    [{}, {},
                    { text: '\t\t\t\t\t\t\t\t\t\t\t\t', colSpan: 1, bold: true, decoration: 'underline' }, 
                    {}, {}, {},
                    { text: '\t\t\t\t\t\t\t\t\t', colSpan: 1, bold: true, decoration: 'underline' }
                    ],
                    [{}, { text: 'Total:', colSpan: 1, bold: true },
                    { text: 'Q ' + element.inversiones.reduce((sum, p) => sum + (p.monto), 0).toLocaleString(this.common.localNumber, this.common.numberOptions), bold: true, alignment: 'right' }
                        , {}, {}, {},
                    { text: 'Q ' + element.inversiones.reduce((sum, p) => sum + (p.interes), 0).toLocaleString(this.common.localNumber, this.common.numberOptions), bold: true, alignment: 'right' }
                    ]
                ]
            },
            layout: 'headerLineOnly'
        }
        // fin de metodo 
    }

    createPDF(data: InversionesPorBanco[], date: Date, contador: Firmante) {
        let tablas = [];
        for (let index = 0; index < data.length; index++) {
            const element = data[index];            
            if (element.inversiones.length != 0) {
                tablas.push(
                    ... this.getTitleByTable(date, element),
                    this.getTable(element),
                    this.getFirmantes(contador),
                    {
                        text: '',
                        pageBreak: "after" // or after
                    }
                )
            }
        }
        tablas.pop();
        return this.appendTablesToPdf(tablas);
    }


    private getFirmantes(contador: Firmante) {
        return {
            text: `${contador.nombre}\r\n${contador.despliegue}`,
            style: 'subheader',
            alignment: "center",
            fontSize: 9,
            bold: true,
            margin: [0, 50, 300, 0],
        }
    }
}