import { Injectable } from "@angular/core";
import { CommonFunction } from "app/inventario/shared/common";
import { Firmante } from "app/modelos/inversiones/firmante";
import { Inversion } from "app/modelos/inversiones/inversion";

@Injectable({
    providedIn: 'root'
})

export class PlantillaInversionesVencen {

    constructor(private common:CommonFunction){}

    public getDocument(rows: Inversion[], fecha_ini:Date, fecha_fin:Date, contador: Firmante) {
        let docDefinition = {
            pageMargins: [50, 90, 50, 50],
            pageSize: 'LETTER',
            pageOrientation: 'landscape',
            header: this.getHeader(),
            content: [
                ...this.getTitle(fecha_ini, fecha_fin),
                this.getTable(rows),
                this.getGenerationDate(),
                this.getFirmantes(contador)
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

    private getTitle(fecha_ini:Date, fecha_fin:Date) {
        return [ 
            {
                text: `LISTADO DE INVERSIONES VENCEN \r\n (EXPRESADO EN QUETZALES)`,
                style: 'header',
                alignment: "center",
                fontSize: 10,
                bold: true,
            },
            {
                text: `Del ${fecha_ini.toLocaleDateString(this.common.localDate, this.common.dateOptions)} al ${fecha_fin.toLocaleDateString(this.common.localDate, this.common.dateOptions)} `,
                style: 'subheader',
                alignment: "center",
                fontSize: 10,
                bold: true,
                margin: [0, 15, 0, 15],
            }
        ]
    }

    private getTable(rows: Inversion[]) {
        return {
            style: 'tableExample',
            margin: [10, 8, 10, 50],
            fontSize: 8,
            alignment: "center",
            table: {
              headerRows: 1,
              widths: ['16%', '10%', '10%', '10%', '6%', '6%', '10%', '10%', '10%', '12%'],
              body: [
                [{ text: 'Institución', style: 'tableHeader' },
                { text: 'Cuenta', style: 'tableHeader' },
                { text: 'Certificado', style: 'tableHeader' },
                { text: 'Fecha de colocación', style: 'tableHeader' },
                { text: 'Tasa', style: 'tableHeader' },
                { text: 'Plazo', style: 'tableHeader' },
                { text: 'Pago de Int.', style: 'tableHeader' },
                { text: 'Fecha de vencimiento', style: 'tableHeader' },
                { text: 'Fecha de pago', style: 'tableHeader' },
                { text: 'Valor Q', style: 'tableHeader' }],                
                ...this.createDataArray(rows),
                [{}, {}, {}, {},{}, {}, {}, {}, { text: 'Total:', bold: true },
                { text: 'Q ' + rows.reduce((sum, p) => sum + (p.monto), 0).toLocaleString(this.common.localDate, this.common.numberOptions ), bold: true, alignment: 'right' },                
                ]
              ]
            },
            layout: 'headerLineOnly'
          }
    }

    createDataArray(rows: Inversion[]): any {
        return rows.map(p => ([p.banco.nombre,
                                    p.cuenta,
                                    p.certificado,
                                    this.common.getLocalDateString(this.common.parseDate(p.fecha_colocacion)),
                                    p.tasa_interes + '%',
                                    p.plazo,
                                    p.periodo_pago,
                                    this.common.getLocalDateString(p.vencimiento),
                                    this.common.getFechaPagoString(p.vencimiento),
                                    { text: 'Q' + p.monto.toLocaleString(this.common.localNumber, this.common.numberOptions), alignment: 'right' }                                    
                                    ])
        )
      }

    private getGenerationDate( ) {
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