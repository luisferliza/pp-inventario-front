import { Injectable } from "@angular/core";
import { CommonFunction } from "app/inventario/shared/common";
import { Firmante } from "app/modelos/inversiones/firmante";
import { Inversion } from "app/modelos/inversiones/inversion";

@Injectable({
    providedIn: 'root'
})
 
export class PlantillaTasaPromedio {

    constructor(private common: CommonFunction) { }

    public getDocument(rows: Inversion[], anio:number, contador: Firmante) {
        let docDefinition = {
            pageMargins: [50, 90, 50, 50],
            pageSize: 'FOLIO',
            pageOrientation: 'landscape',
            header: this.getHeader(),
            content: [
                this.getTitle(anio),
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

    private getTitle(anio) {
        return {
            text: `TASA PROMEDIO POR BANCO EN ${anio}`,
            style: 'header',
            alignment: "center",
            fontSize: 10,
            bold: true,
            decoration: 'underline',
            margin: [10, 20, 10, 20],
        }
    }

    private getTable(rows: Inversion[]) {
        return {
            style: 'tableExample',
            margin: [7, 8, 7, 20],
            fontSize: 8,
            alignment: "center",
            table: {
                headerRows: 1,
                widths: ['19.25%', '6%', '6%', '6.25%', '6.25%', '6%', '6%', '6%', '6%', '7%', '6%', '6.75%', '6.5%', '6%'],
                body: [
                    this.getHeaders(),
                    ...rows.map(element => ([
                        element[0],
                        `${element[1].toFixed(2)}%`,
                        `${element[2].toFixed(2)}%`,
                        `${element[3].toFixed(2)}%`,
                        `${element[4].toFixed(2)}%`,
                        `${element[5].toFixed(2)}%`,
                        `${element[6].toFixed(2)}%`,
                        `${element[7].toFixed(2)}%`,
                        `${element[8].toFixed(2)}%`,
                        `${element[9].toFixed(2)}%`,
                        `${element[10].toFixed(2)}%`,
                        `${element[11].toFixed(2)}%`,
                        `${element[12].toFixed(2)}%`,
                        `${element[13].toFixed(2)}%`                        
                    ])),
                    [{},{},{},{},{},{},{},{},{},{},{ text: 'Promedio General Anual:', colSpan: 3, bold: true, alignment: 'right' },{},{},
                    { text:  (rows.reduce((sum, p) => sum + (p[13]), 0)/rows.length).toFixed(2) + "%", bold: true, alignment: 'center' }]
                    
                ]
            },
            layout: 'lightHorizontalLines'
        }
    }

    getHeaders() {
        return [{ text: 'Banco', style: 'tableHeader' },
        { text: 'Enero', style: 'tableHeader' },
        { text: 'Febrero', style: 'tableHeader' },
        { text: 'Marzo', style: 'tableHeader' },
        { text: 'Abril', style: 'tableHeader' },
        { text: 'Mayo', style: 'tableHeader' },
        { text: 'Junio', style: 'tableHeader' },
        { text: 'Julio', style: 'tableHeader' },
        { text: 'Agosto', style: 'tableHeader' },
        { text: 'Septiembre', style: 'tableHeader' },
        { text: 'Octubre', style: 'tableHeader' },
        { text: 'Noviembre', style: 'tableHeader' },
        { text: 'Diciembre', style: 'tableHeader' },
        { text: 'Promedio', style: 'tableHeader' },
        ]
    }

    // Evita la division por 0
    getAvg(element) {
        let total = element.slice(1).reduce((sum, p) => sum + (p == 0 ? 0 : 1), 0);
        if (total === 0) {
            return 0
        }
        return (element.slice(1).reduce((sum, p) => sum + (p), 0) / total).toFixed(2)
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