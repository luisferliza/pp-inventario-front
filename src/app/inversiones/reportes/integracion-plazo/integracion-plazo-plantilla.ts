import { Injectable } from "@angular/core";
import { CommonFunction } from "app/inventario/shared/common";
import { Firmante } from "app/modelos/inversiones/firmante";
import { InversionesPorBanco } from "app/modelos/inversiones/InversionesPorBanco";

@Injectable({
    providedIn: 'root'
})

export class PlantillaIntegracionPlazo {

    constructor(private common: CommonFunction) { }

    appendTablesToPdf(tablas: any[]){
        let reference = this;
        let docDefinition = {
            pageMargins: [30, 50, 30, 50],
            pageSize: 'LETTER',            
            header: this.getHeader(),
            footer: function (currentPage, pageCount) { return reference.getFooter(currentPage, pageCount) },
            content: [
              ...tablas
            ],
            columnGap: 0
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
            margin: [0, 0, 0, 20]
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
                text: `(EXPRESADO EN QUETZALES)`,
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
            margin: [10, 10, 0, 40],
            fontSize: 7,
            alignment: "center",
            table: {
                headerRows: 1,
                widths: ['5%', '10%', '18%', '10.5%', '4%', '5%', '10.5%', '10.5%', '10.5%', '16%'],
                body: [
                    [{ text: 'Tipo Docto.', style: 'tableHeader' },
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

    createPDF(data: InversionesPorBanco[], date: Date, contador: Firmante, administrador: Firmante) {
        let tablas = [];
        for (let index = 0; index < data.length; index++) {
            const element = data[index];
            if(element.inversiones.length != 0 ){
                tablas.push(
                    ... this.getTitleByTable(date, element),
                    this.getTable(element),                
                    this.getFirmantes(contador, administrador),
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

    private getFirmantes(contador: Firmante, administrador: Firmante) {
        return [
            {
                text: `${contador.nombre}\r\n${contador.despliegue}`,
                style: 'subheader',
                alignment: "center",
                fontSize: 9,
                bold: true,
                margin: [0, 30, 250, 0],
            },
            {
                text: `Vo. Bo. ${administrador.nombre}\r\n${administrador.despliegue}`,
                style: 'subheader',
                alignment: "center",
                fontSize: 9,
                bold: true,
                margin: [250, -20, 0, 0],
            }
        ]
    }
}