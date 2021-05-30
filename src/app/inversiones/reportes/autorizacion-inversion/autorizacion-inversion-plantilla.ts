import { Injectable } from "@angular/core";
import { CommonFunction } from "app/inventario/shared/common";
import { Firmante } from "app/modelos/inversiones/firmante";
import { Inversion } from "app/modelos/inversiones/inversion";

@Injectable({
    providedIn: 'root'
})

export class PlantillaAutorizacionInversion {

    constructor(private common: CommonFunction){}
    public getDocument(rows: Inversion[], presidente: Firmante, secretario: Firmante, acta: string, sesion: Date) {
        let docDefinition = {
            pageMargins: [50, 60, 50, 50],
            pageSize: 'LETTER',
            pageOrientation: 'portrait',
            content: [
                this.getTitle(),
                this.getTable(rows),
                ...this.getGenerationDate(acta,sesion),
                ... this.getFirmantes(presidente, secretario)
            ]
        };

        return docDefinition;
    }

    private getTitle() {
        return {
            text: `AUTORIZACIÓN DE INVERSIÓN`,
            style: 'header',
            alignment: "center",
            fontSize: 10,
            bold: true,
            margin: [50, 20, 50, 10],
        }
    }

    private getTable(rows: Inversion[]) {
        return {
            style: 'tableExample',
            margin: [10, 8, 10, 50],
            fontSize: 8,
            alignment: "center",
            table: {
                headerRows: 1,
                widths: ['12.5%', '12.5%', '20%', '15%', '20%', '20%'],
                body: [
                    [{ text: 'Dias Plazo', style: 'tableHeader' },
                    { text: 'Tasa Nominal', style: 'tableHeader' },
                    { text: 'Institución Bancaria', style: 'tableHeader' },
                    { text: 'Documento', style: 'tableHeader' },
                    { text: 'Intervalo de Int.', style: 'tableHeader' },
                    { text: 'Valor inversión Q', style: 'tableHeader' }],
                    ...rows.map(p => ([
                        p.plazo,
                        p.tasa_interes,
                        p.banco.nombre,
                        p.tipo_Inversion.nombre,
                        p.periodo_pago,
                        { text: 'Q' + p.monto.toLocaleString(this.common.localNumber, this.common.numberOptions), alignment: 'right' }
                    ])),
                    [{}, {}, {}, {}, { text: 'Total:', bold: true },
                    { text: 'Q ' + rows.reduce((sum, p) => sum + (p.monto), 0).toLocaleString(this.common.localNumber, this.common.numberOptions), bold: true, alignment: 'right' },
                    ]
                ]
            },
            layout: 'headerLineOnly'
        }
    }

    private getGenerationDate(acta: string, sesion:Date) {
        return [
            {
                text: `Aprobado\r\nActa No. ${acta} \r\n Sesion Del ${this.common.getLocalDateString(sesion)}`,
                alignment: "left",
                fontSize: 9,
                bold: true,
                margin: [380, 15, 0, 15],
            },
            {
                text: `Guatemala, ${new Date().toLocaleDateString(this.common.localDate, this.common.dateOptions)}`,
                alignment: "left",
                fontSize: 9,
                bold: true,
                margin: [10, 15, 0, 15],
            }
        ]
    }

    private getFirmantes(presidente: Firmante, secretario: Firmante){
        return [
            {
                text: `${presidente.nombre}\r\n${presidente.despliegue}`,
                style: 'subheader',
                alignment: "center",
                fontSize: 9,
                bold: true,
                margin: [20, 60, 280, 0],
            },
            {
                text: `${secretario.nombre}\r\n${secretario.despliegue}`,
                style: 'subheader',
                alignment: "center",
                fontSize: 9,
                bold: true,
                margin: [280, 0, 20, 15],
            }
        ]
    }
}