import { Injectable } from "@angular/core";
import { CommonFunction } from "app/inventario/shared/common";
import { Firmante } from "app/modelos/inversiones/firmante";
import { Inversion } from "app/modelos/inversiones/inversion";

@Injectable({
    providedIn: 'root'
})

export class PlantillaControlVencimiento {

    constructor(private common: CommonFunction) { }

    public getDocument(rows: Inversion[], contador: Firmante, fecha_ini: Date, fecha_fin: Date) {
        let docDefinition = {
            pageMargins: [50, 60, 50, 50],
            pageSize: 'LETTER',
            pageOrientation: 'landscape',
            content: [
                this.getTitle(fecha_ini, fecha_fin),
                this.getTable(rows),
                this.getGenerationDate(),
                this.getFirmantes(contador)
            ]
        };

        return docDefinition;
    }

    private getTitle(fecha_ini: Date, fecha_fin: Date) {
        return [{
            text: `CONTROL DE VENCIMIENTO DE INVERSIONES \r\n (EXPRESADO EN QUETZALES)`,
            style: 'header',
            alignment: "center",
            fontSize: 10,
            bold: true,
        },
        {
            text: `Del ${fecha_ini.toLocaleDateString(this.common.localDate, { year: 'numeric', month: 'long', day: 'numeric' })} al ${fecha_fin.toLocaleDateString(this.common.localDate, { year: 'numeric', month: 'long', day: 'numeric' })} `,
            style: 'subheader',
            alignment: "center",
            fontSize: 10,
            bold: true,
            margin: [0, 15, 0, 15],
        }]
    }

    private getTable(rows: Inversion[]) {
        return {
            style: 'tableExample',
            margin: [10, 8, 10, 50],
            fontSize: 8,
            alignment: "center",
            table: {
                headerRows: 1,
                widths: ['16%', '10%', '6%', '10%', '10%', '12%', '8%', '6%', '10%', '12%'],
                body: [
                    [{ text: 'Institución', style: 'tableHeader' },
                    { text: 'Certificado', style: 'tableHeader' },
                    { text: 'Plazo (dias)', style: 'tableHeader' },
                    { text: 'Fecha de vencimiento', style: 'tableHeader' },
                    { text: 'Fecha de pago', style: 'tableHeader' },
                    { text: 'Valor Q', style: 'tableHeader' },
                    { text: 'Tasa', style: 'tableHeader' },
                    { text: 'Dias Int.', style: 'tableHeader' },
                    { text: 'Valor Int.', style: 'tableHeader' },
                    { text: 'Total', style: 'tableHeader' }],
                    ...this.createTableContent(rows),
                    [{}, {}, {}, {}, { text: 'Totales:', colSpan: 1, bold: true },
                    { text: 'Q ' + rows.reduce((sum, p) => sum + (p.monto), 0).toLocaleString(this.common.localNumber, this.common.numberOptions), bold: true, alignment: 'right' },
                    {}, {},
                    { text: 'Q ' + rows.reduce((sum, p) => sum + (p.interes), 0).toLocaleString(this.common.localNumber, this.common.numberOptions), bold: true, alignment: 'right' },
                    { text: 'Q ' + rows.reduce((sum, p) => sum + (p.monto + p.interes), 0).toLocaleString(this.common.localNumber, this.common.numberOptions), bold: true, alignment: 'right' },
                    ]
                ]
            },
            layout: 'headerLineOnly'
        }
    }

    createTableContent(rows: Inversion[]): any {
        return rows.map(p => ([p.banco.nombre,
        p.certificado,
        p.plazo,
        this.common.getLocalDateString(p.vencimiento),
        this.common.getFechaPagoString(p.vencimiento),
        { text: 'Q' + p.monto.toLocaleString(this.common.localNumber, this.common.numberOptions), alignment: 'right' },
        p.tasa_interes + '%',
        p.diasInteres,
        { text: 'Q' + p.interes.toLocaleString(this.common.localNumber, this.common.numberOptions), alignment: 'right' },
        { text: 'Q' + (p.monto + p.interes).toLocaleString(this.common.localNumber, this.common.numberOptions), alignment: 'right' },
        ])
        )
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
        return [
            {
                text: `${contador.nombre}\r\n${contador.despliegue}`,
                style: 'subheader',
                alignment: "center",
                fontSize: 9,
                bold: true,
                margin: [0, 60, 420, 0],
            }
        ]
    }
}