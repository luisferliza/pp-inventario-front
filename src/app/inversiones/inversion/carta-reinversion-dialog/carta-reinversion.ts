//import { Document, Packer, Paragraph, TextRun } from "docx";

import { Injectable } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { CommonFunction } from "app/inventario/shared/common";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { Firmante } from "app/modelos/inversiones/firmante";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Injectable({
    providedIn: 'root'
})

export class ReInversionCreator {
    // tslint:disable-next-line: typedef
    constructor(private common: CommonFunction){}


    public createPDF(
        periodo_pago: string,
        certificado: string,
        cuenta: string,
        plazo: string,
        tasa_interes: string,
        monto: number,
        fecha_acta: Date,
        acta_japp: string,        
        grado: string,
        puesto: string,
        apellido: string,
        nombre: string,
        fecha: Date,
        banco: string,
        dias_interes: string,
        interes: number,
        fecha_reinversion: Date,
        vencimiento: Date,
        vencimiento_reinversion: Date,
        firmante: Firmante) {

        let docDefinition = {
            content: [
                {
                    text: `REF.: PP-`,
                    alignment: "left",
                    margin: [400, 50, 25, 0],
                    fontSize: 10,
                },
                {
                    text: `Guatemala, \r\n ${fecha.toLocaleDateString(this.common.localDate, this.common.dateOptions)}`,
                    alignment: "left",
                    margin: [400, 35, 25, 20],
                    fontSize: 10,
                },
                {
                    text: `${grado}`,
                    alignment: "left",
                    margin: [10, 2, 10, 0],
                    fontSize: 10,
                },
                {
                    text: `${nombre.toUpperCase()} ${apellido.toUpperCase()}`,
                    alignment: "left",
                    margin: [10, 2, 10, 0],
                    fontSize: 10,
                },
                {
                    text: `${puesto}`,
                    alignment: "left",
                    margin: [10, 2, 10, 0],
                    fontSize: 10,
                },
                {
                    text: `${banco.toUpperCase()}`,
                    alignment: "left",
                    margin: [10, 2, 10, 0],
                    fontSize: 10,
                },
                {
                    text: `Ciudad`,
                    alignment: "left",
                    margin: [10, 2, 10, 0],
                    fontSize: 10,
                },
                {
                    text: `${grado} ${apellido}:`,
                    alignment: "left",
                    margin: [10, 20, 10, 0],
                    fontSize: 10,
                },
                {
                    text: `\u200B\t\tAtentamente hacemos de su conocimiento que la Junta Administradora del Plan de Prestaciones, en sesión del ` +
                        `${fecha_acta.toLocaleDateString(this.common.localDate, this.common.dateOptions)}, Acta No. ${acta_japp}, acordó reinvertir en ese banco el valor del certificado ` +
                        `No. ${certificado}, Cuenta ${cuenta} por Q${monto.toLocaleString(this.common.localNumber, this.common.numberOptions)}, ` +
                        `mas intereses de ${dias_interes} días por Q${interes.toLocaleString(this.common.localNumber, this.common.numberOptions)} ` +
                        `al ${vencimiento.toLocaleDateString(this.common.localDate, this.common.dateOptions)}, fecha de vencimiento del certificado.`,
                    alignment: "justify",
                    margin: [10, 20, 10, 0],
                    fontSize: 10,
                },
                {
                    text: `\u200B\t\tPor lo anterior, solicitamos se sirvan efectuar la reinversión con fecha ` +
                        `${fecha_reinversion.toLocaleDateString(this.common.localDate, this.common.dateOptions)} por valor de Q${(monto + interes).toLocaleString(this.common.localNumber, this.common.numberOptions)} ` +
                        `a nombre de PLAN DE PRESTACIONES, USAC, a una tasa fija de interés anual del ${tasa_interes}%, ` +
                        `con pago ${periodo_pago.toLowerCase()} y plazo de ${plazo} días que vencerá el día ${vencimiento_reinversion.toLocaleDateString(this.common.localDate, this.common.dateOptions)}.`,
                    alignment: "justify",
                    margin: [10, 20, 10, 0],
                    fontSize: 10,
                },
                {
                    text: `\u200B\t\tAsimismo, se requiere que el certificado incluya lo relativo a la desinversión anticipada, forma ` +
                        `de pago de intereses y la identificación de las personas que suscriben con sus respectivos cargos y ` +
                        `sellos del banco.`,
                    alignment: "justify",
                    margin: [10, 20, 10, 0],
                    fontSize: 10,
                },
                {
                    text: `\u200B\t\tAgradeciendo su atención, le saludamos deferentemente. `,
                    alignment: "justify",
                    margin: [10, 20, 10, 20],
                    fontSize: 10,
                },
                {
                    text: `"ID Y ENSEÑAD A TODOS"`,
                    alignment: "center",
                    margin: [10, 60, 10, 20],
                    fontSize: 10,
                },
                {
                    text: `${firmante.nombre}\r\n${firmante.despliegue}`,
                    style: 'subheader',
                    alignment: "center",
                    fontSize: 10,          
                    margin: [300, 10, 10, 20],
                },
                {
                    text: `Vo. Bo. _______________________________________`,
                    alignment: "left",
                    margin: [10, 10, 10, 20],
                    fontSize: 10,
                },
                {
                    text: `/amrdec`,
                    alignment: "left",
                    margin: [10, 2, 10, 20],
                    fontSize: 10,
                }
            ]
        };

        pdfMake.createPdf(docDefinition).open();
    }

    createWord(
        periodo_pago: string,
        certificado: string,
        cuenta: string,
        plazo: string,
        tasa_interes: string,
        monto: number,
        fecha_acta: Date,
        acta_japp: string,        
        grado: string,
        puesto: string,
        apellido: string,
        nombre: string,
        fecha: Date,
        banco: string,
        dias_interes: string,
        interes: number,
        fecha_reinversion: Date,
        vencimiento: Date,
        vencimiento_reinversion: Date,
        firmante: Firmante) {
        let header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' " +
            "xmlns:w='urn:schemas-microsoft-com:office:word' " +
            "xmlns='http://www.w3.org/TR/REC-html40'>" +
            "<head><meta charset='utf-8'><title>Inversiones - Plan de Prestaciones</title></head><body>";
        let footer = "</body></html>";
        let content = `<p style="text-align: right;">REF: PP-&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</p>
    <p style="text-align: right;">&nbsp;</p>
    <p style="text-align: right; margin: 0cm; line-height: 14.2pt;">Guatemala,&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</p>
    <p style="text-align: right; margin: 0cm; line-height: 14.2pt;">${fecha.toLocaleDateString(this.common.localDate, this.common.dateOptions)}</p>
    <p style="margin: 0cm; line-height: 14.2pt;">${grado}</p>
    <p style="margin: 0cm; line-height: 14.2pt;">${nombre.toUpperCase()} ${apellido.toUpperCase()}</p>
    <p style="margin: 0cm; line-height: 14.2pt;">${puesto}</p>
    <p style="margin: 0cm; line-height: 14.2pt;">${banco.toUpperCase()}</p>
    <p style="margin: 0cm; line-height: 14.2pt;">Ciudad</p>    
    <p style="text-align: left;">${grado} ${apellido}:</p>
    <p style="text-align: justify;">&nbsp; &nbsp; &nbsp;Atentamente hacemos de su conocimiento que la Junta Administradora del Plan de Prestaciones, en sesión del ` +
            `${fecha_acta.toLocaleDateString(this.common.localDate, this.common.dateOptions)}, Acta No. ${acta_japp}, acordó reinvertir en ese banco el valor del certificado ` +
            `No. ${certificado}, Cuenta ${cuenta} por Q${monto.toLocaleString(this.common.localNumber, this.common.numberOptions)}, ` +
            `mas intereses de ${dias_interes} días por Q${interes.toLocaleString(this.common.localNumber, this.common.numberOptions)} ` +
            `al ${vencimiento.toLocaleDateString(this.common.localDate, this.common.dateOptions)}, fecha de vencimiento del certificado.</p>
    <p style="text-align: justify;">&nbsp; &nbsp; &nbsp;Por lo anterior, solicitamos se sirvan efectuar la reinversión con fecha ` +
            `${fecha_reinversion.toLocaleDateString(this.common.localDate, this.common.dateOptions)} por valor de Q${(monto + interes).toLocaleString(this.common.localNumber, this.common.numberOptions)} ` +
            `a nombre de PLAN DE PRESTACIONES, USAC, a una tasa fija de interés anual del ${tasa_interes}%, ` +
            `con pago ${periodo_pago.toLowerCase()} y plazo de ${plazo} días que vencerá el día ${vencimiento_reinversion.toLocaleDateString(this.common.localDate, this.common.dateOptions)}.</p>
    <p style="text-align: justify;">&nbsp; &nbsp; &nbsp;Asimismo, se requiere que el certificado incluya lo relativo a la desinversión anticipada, forma ` +
            `de pago de intereses y la identificación de las personas que suscriben con sus respectivos cargos y ` +
            `sellos del banco.</p>
    <p style="text-align: justify;">&nbsp; &nbsp; &nbsp;Agradeciendo su atenci&oacute;n, le saludamos deferentemente.</p>
    <p style="text-align: left;">&nbsp;</p>
    <p style="text-align: center;">"ID Y ENSE&Ntilde;AD A TODOS"</p>
    <p style="text-align: center;">&nbsp;</p>
    <p align=center style='margin-top:0cm;margin-right:-4.65pt;margin-bottom:0cm;
    margin-left:191.4pt;text-align:center'>${firmante.nombre}<br>${firmante.despliegue}</p>    
    <p style="text-align: right;">&nbsp;</p>
    <p style="text-align: left;">Vo. Bo. _____________________________</p>
    <p style="text-align: left;">/amrdec</p>`
        let sourceHTML = header + content + footer;

        let source = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(sourceHTML);
        let fileDownload = document.createElement("a");
        document.body.appendChild(fileDownload);
        fileDownload.href = source;
        fileDownload.download = 'carta-reinversion.doc';
        fileDownload.click();
        document.body.removeChild(fileDownload);
    }

}
