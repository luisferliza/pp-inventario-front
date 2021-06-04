import { Injectable } from "@angular/core";
import { CommonFunction } from "app/inventario/shared/common";
import { Firmante } from "app/modelos/inversiones/firmante";
import { InversionesPorTipoBanco } from "app/modelos/inversiones/inversionesPorTipoBanco";
import { TotalInversionesPorBanco } from "app/modelos/inversiones/totalInversionesPorBanco";

@Injectable({
    providedIn: 'root'
})

export class PlantillaAnexo4 {

    contador: number = 1
    total: number = 0;
    prima: number;
    descuentos: number;
    constructor(private common: CommonFunction) { }

    public getDocument(rows: InversionesPorTipoBanco[], prestamos: InversionesPorTipoBanco, prima: number,
        descuentos: number, anexo: number, fecha: Date, contador: Firmante, administrador: Firmante, asistente: Firmante) {        
        this.contador = 1;
        this.prima = prima;
        this.descuentos = descuentos;
        this.total = this.getCantidadTotal(rows) + prestamos.totalCategoria + prima - descuentos;
        let docDefinition = {
            pageMargins: [50, 90, 50, 50],
            pageSize: 'LETTER',
            header: this.getHeader(),
            content: [
                ...this.getTitle(fecha, anexo),
                this.getTableHeader(),
                ...this.createTableList(rows),
                this.getPrestamosTable(prestamos),
                this.getGenerationDate(),
                this.getFirmantes(contador, administrador, asistente)
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

    private getTitle(fecha: Date, anexo: number) {
        return [
            {
                text: `ANEXO NO. ${anexo} \r\n INVERSIONES PLAN DE PRESTACIONES`,
                style: 'header',
                alignment: "center",
                fontSize: 10,
                bold: true,
            },
            {
                text: `AL ${fecha.toLocaleDateString(this.common.localDate, this.common.dateOptions).toUpperCase()} `,
                style: 'subheader',
                alignment: "center",
                fontSize: 10,
                bold: true,
                margin: [0, 0, 0, 15],
            }
        ]
    }

    private createTableList(rows: InversionesPorTipoBanco[]) {
        let tables = [];
        rows.forEach(data => {
            if(data.nombreCategoria.toLocaleUpperCase() === this.common.BANCOS_ESTATALES){
                data.totalCategoria += this.prima;
                data.totalCategoria -= this.descuentos;
            }
            if(data.totalCategoria != 0){
                tables.push(this.getTable(data));
            }            
        })
        return tables;
    }

    private getTableHeader() {
        return {
            style: 'tableExample',
            margin: [10, 8, 10, 10],
            fontSize: 10,
            alignment: "center",
            table: {
                headerRows: 1,
                widths: ['40%', '10%', '20%', '20%', '10%'],
                body: [
                    [
                        { text: 'INSTITUCIONES', style: 'tableHeader', bold: true, alignment: 'left' },
                        { text: '%', style: 'tableHeader', bold: true },
                        { text: '', style: 'tableHeader', bold: true },
                        { text: 'TOTAL EN Q', style: 'tableHeader', bold: true },
                        { text: '%', style: 'tableHeader', bold: true }
                    ]
                ]
            },
            layout: 'headerLineOnly'
        }
    }

    private getTable(row: InversionesPorTipoBanco) {
        return {
            style: 'tableExample',
            margin: [10, 8, 10, 10],
            fontSize: 9,
            alignment: "center",
            table: {
                headerRows: 0,
                widths: ['40%', '10%', '20%', '20%', '10%'],
                body: [
                    [
                        { text: `${row.nombreCategoria.toUpperCase()}`, style: 'tableHeader', bold: true, alignment: 'left' },
                        {}, {},
                        { text: "Q" + row.totalCategoria.toLocaleString(this.common.localNumber, this.common.numberOptions), bold: true, alignment: 'right' },
                        { text: this.getPorcentaje(this.total, row.totalCategoria) + "%", bold: true }
                    ],
                    ...this.getBancosData(row.bancos, row.totalCategoria)
                ]
            },
            layout: 'headerLineOnly'
        }
    }

    getBancosData(bancos: TotalInversionesPorBanco[], totalCategoria: number) {
        let response = []
        for (let index = 0; index < bancos.length; index++) {
            const element = bancos[index];
            if (element.monto == 0) {
                continue;
            } else if (element.nombre.toLocaleUpperCase() === this.common.MINISTERIO_FINANZAS) {                
                response.push(...this.createMinisterioFinanzasRow(element, totalCategoria));
            } else {
                response.push([
                    { text: element.nombre.toUpperCase()+` /${element.anexo}`, alignment: 'left' },
                    this.getPorcentaje(totalCategoria, element.monto) + "%",
                    { text: "Q" + element.monto.toLocaleString(this.common.localNumber, this.common.numberOptions), alignment: 'right' },
                    {}, {}
                ])
            }
        }
        return response;
    }

    private createMinisterioFinanzasRow(element: TotalInversionesPorBanco, totalCategoria: number) {
        let response = []
        response.push([ 
            { text: element.nombre.toUpperCase()+` /${element.anexo}`, alignment: 'left' },
            this.getPorcentaje(totalCategoria, element.monto) + "%",
            { text: "Q" + element.monto.toLocaleString(this.common.localNumber, this.common.numberOptions), alignment: 'right' },
            {}, {}
        ])
        if (this.prima != 0) {
            response.push([
                { text: '  Bonos del tesoso de la República de Guatemala \r\n (Prima a amortizar)', alignment: 'left', fontSize:8 },
                {},
                { text: "\r\nQ" + this.prima.toLocaleString(this.common.localNumber, this.common.numberOptions), alignment: 'right' },
                {}, {}
            ])
        }
        if (this.descuentos != 0) {
            response.push([
                { text: '  Descuentos', alignment: 'left', fontSize:8 },
                {},
                { text: "Q" + this.descuentos.toLocaleString(this.common.localNumber, this.common.numberOptions), alignment: 'right' },
                {}, {}
            ])
        }
        return response;
    }


    private getPrestamosTable(row: InversionesPorTipoBanco) {
        return row.totalCategoria==0?{}:{
            style: 'tableExample',
            margin: [10, 8, 10, 10],
            fontSize: 9,
            alignment: "center",
            table: {
                headerRows: 0,
                widths: ['40%', '10%', '20%', '20%', '10%'],
                body: [
                    [
                        { text: `PRESTAMOS`, style: 'tableHeader', bold: true, alignment: 'left' },
                        {}, {},
                        { text: "Q" + row.totalCategoria.toLocaleString(this.common.localNumber, this.common.numberOptions), bold: true, alignment: 'right' },
                        { text: this.getPorcentaje(this.total, row.totalCategoria) + "%", bold: true }
                    ],
                    ...row.bancos.map(p => (p.monto == 0 ? [{}, {}, {}, {}, {}] : [
                        { text: p.nombre.toUpperCase(), alignment: 'left' },
                        this.getPorcentaje(row.totalCategoria, p.monto) + "%",
                        { text: "Q" + p.monto.toLocaleString(this.common.localNumber, this.common.numberOptions), alignment: 'right' },
                        {}, {}
                    ])),
                    [{ text: `TOTAL INVERSIONES PLAN`, bold: true, alignment: 'center' },
                    {},{},
                    { text: "Q" + this.total.toLocaleString(this.common.localNumber, this.common.numberOptions), bold: true,alignment: 'right' },
                    { text: "100.00%", bold: true}
                    ]
                ]
            },
            layout: 'headerLineOnly'
        }
    }



    getPorcentaje(total: number, valorActual: number) {
        return total === 0 ? 0 : (valorActual / total * 100).toFixed(2)
    }

    getCantidadTotal(rows: InversionesPorTipoBanco[]) {
        let total = 0;
        rows.forEach(p => {
            total += p.totalCategoria;
        })
        return total;
    }

    private getGenerationDate() {
        return {
            text: `Guatemala, ${new Date().toLocaleDateString(this.common.localDate, this.common.dateOptions)}`,
            alignment: "left",
            fontSize: 9,
            bold: true,
            margin: [10, 25, 0, 15],
        }
    }

    private getFirmantes(contador: Firmante, administrador: Firmante, asistente: Firmante) {
        return [
            {
                text: `${administrador.nombre}\r\n${administrador.despliegue}`,
                style: 'subheader',
                alignment: "center",
                fontSize: 9,
                bold: true,
                margin: [20, 60, 280, 20],
            },
            {
                text: `${contador.nombre}\r\n${contador.despliegue}`,
                style: 'subheader',
                alignment: "center",
                fontSize: 9,
                bold: true,
                margin: [20, 60, 280, 0],
            },
            {
                text: `${asistente.nombre}\r\n${asistente.despliegue}`,
                style: 'subheader',
                alignment: "center",
                fontSize: 9,
                bold: true,
                margin: [280, 0, 20, 15],
            }
        ]
    }
}