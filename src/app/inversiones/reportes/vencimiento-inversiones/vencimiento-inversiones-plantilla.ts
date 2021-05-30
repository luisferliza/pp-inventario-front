import { Injectable } from "@angular/core";
import { CommonFunction } from "app/inventario/shared/common";
import { Firmante } from "app/modelos/inversiones/firmante";
import { InversionesPorBanco } from "app/modelos/inversiones/InversionesPorBanco";

@Injectable({
    providedIn: 'root'
})

export class PlantillaVencimientoInversiones {

    constructor(private common: CommonFunction) { }

    appendTablesToPdf(tablas: any[]){
        let reference = this;
        let docDefinition = {
            pageMargins: [50, 90, 50, 50],
            pageSize: 'LETTER',
            pageOrientation: 'landscape',
            header: this.getHeader(),
            footer: function (currentPage, pageCount) { return reference.getFooter(currentPage, pageCount) },
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

    private getFooter(currentPage, pageCount) {
        return {
            text: 'Página ' + currentPage.toString() + ' de ' + pageCount + '   ',
            fontSize: 8,
            alignment: 'center',
            margin: [0, 10, 0, 20]
        }
    }


    getTitleByTable(date: Date, row: InversionesPorBanco) {
        return [
            {
                text: `INTEGRACIÓN DE DOCUMENTOS A PLAZO VIGENTES `,
                style: 'subheader',
                alignment: "center",
                fontSize: 10,
                bold: true,
                margin: [0, 5, 0, 0],
            },
            {
                text: `INSTITUCIÓN: ${row.banco.toUpperCase()} `,
                style: 'subheader',
                alignment: "center",
                fontSize: 10,
                bold: true,
                margin: [0, 5, 0, 0],
            },
            {
                text: `AL ${date.toLocaleDateString(this.common.localDate, this.common.dateOptions).toUpperCase()}  `,
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
            },
        ]
        // fin de método
    }



    getTable(element: InversionesPorBanco) {
        return {
            style: 'tableExample',
            margin: [10, 8, 10, 50],
            fontSize: 8,
            alignment: "center",
            table: {
                headerRows: 1,
                widths: ['10%', '10%', '10%', '10%', '8%', '8%', '10%', '10%', '10%', '14%'],
                body: [
                    [{ text: 'Tipo Docto. ', style: 'tableHeader' },
                    { text: 'No. certificado', style: 'tableHeader' },
                    { text: 'Cuenta', style: 'tableHeader' },
                    { text: 'Fecha de emisión', style: 'tableHeader' },
                    { text: 'Tasa (%)', style: 'tableHeader' },
                    { text: 'Días Plazo', style: 'tableHeader' },
                    { text: 'Forma de pago de intereses', style: 'tableHeader' },
                    { text: 'Fecha vencimiento', style: 'tableHeader' },
                    { text: 'Fecha pago', style: 'tableHeader' },
                    { text: 'Valor nominal', style: 'tableHeader' }],
                    ...element.inversiones.map(p => ([p.tipo_Inversion.nombre,
                    p.certificado,
                    p.cuenta,
                    this.common.getLocalDateString(p.fecha_colocacion),
                    p.tasa_interes,
                    p.plazo,
                    p.periodo_pago,
                    this.common.getLocalDateString(p.vencimiento),
                    this.common.getFechaPagoString(p.vencimiento),
                    { text: 'Q' + p.monto.toLocaleString(this.common.localNumber, this.common.numberOptions), alignment: 'right' }
                    ])),
                    [{}, {}, {}, {}, {}, {}, {}, {}, { text: 'Total:', colSpan: 1, bold: true },
                    { text: 'Q ' + element.inversiones.reduce((sum, p) => sum + (p.monto), 0).toLocaleString(this.common.localNumber, this.common.numberOptions), bold: true, alignment: 'right' }]
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
            tablas.push(
                ... this.getTitleByTable(date, element),
                this.getTable(element),
                this.getGenerationDate(),
                this.getFirmantes(contador),
                {
                    text: '',
                    pageBreak: "after" // or after
                }
            )
        }
        tablas.pop();
        return this.appendTablesToPdf(tablas);
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

    private getFirmantes(contador: Firmante) {
        return {
            text: `${contador.nombre}\r\n${contador.despliegue}`,
            style: 'subheader',
            alignment: "center",
            fontSize: 9,
            bold: true,
            margin: [0, 60, 420, 0],
        }
    }
}