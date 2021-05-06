//import { Document, Packer, Paragraph, TextRun } from "docx";

import { Injectable } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { CommonFunction } from "app/inventario/shared/common";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Injectable({
    providedIn: 'root'
})

export class ReInversionCreator {
    // tslint:disable-next-line: typedef


    public createPDF(form: FormGroup, common: CommonFunction) {

        let docDefinition = {
            content: [
                {
                    text: `REF.: PP-`,
                    alignment: "left",
                    margin: [400, 50, 25, 0],
                    fontSize: 10,
                },
                {
                    text: `Guatemala, \r\n ${form.value.fecha_txt}`,
                    alignment: "left",
                    margin: [400, 35, 25, 20],
                    fontSize: 10,
                },
                {
                    text: `${form.value.grado}`,
                    alignment: "left",
                    margin: [10, 2, 10, 0],
                    fontSize: 10,
                },
                {
                    text: `${form.value.nombre.toUpperCase()} ${form.value.apellido.toUpperCase()}`,
                    alignment: "left",
                    margin: [10, 2, 10, 0],
                    fontSize: 10,
                },
                {
                    text: `${form.value.puesto}`,
                    alignment: "left",
                    margin: [10, 2, 10, 0],
                    fontSize: 10,
                },
                {
                    text: `${form.value.banco.toUpperCase()}`,
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
                    text: `${form.value.grado} ${form.value.apellido}:`,
                    alignment: "left",
                    margin: [10, 20, 10, 0],
                    fontSize: 10,
                },
                {
                    text: `\u200B\t\tAtentamente hacemos de su conocimiento que la Junta Administradora del Plan de Prestaciones, en sesión del ` +
                        `${form.value.fecha_acta_txt}, Acta No. ${form.value.acta_japp}, acordó reinvertir en ese banco el valor del certificado ` +
                        `No. ${form.value.referencia}, Cuenta ${form.value.cuenta} por Q${form.value.monto.toLocaleString('en', common.options)}, ` +
                        `mas intereses de ${form.value.dias_interes} días por Q${form.value.interes.toLocaleString('en', common.options)} ` +
                        `al ${form.value.vencimiento_txt}, fecha de vencimiento del certificado.`,
                    alignment: "justify",
                    margin: [10, 20, 10, 0],
                    fontSize: 10,
                },
                {
                    text: `\u200B\t\tPor lo anterior, solicitamos se sirvan efectuar la reinversión con fecha ` +
                        `${form.value.fecha_reinversion_txt} por valor de Q${(form.value.monto + form.value.interes).toLocaleString('en', common.options)} ` +
                        `a nombre de PLAN DE PRESTACIONES, USAC,a una tasa fija de interés anual del ${form.value.tasa_interes}%, ` +
                        `con pago ${form.value.periodo_pago.toLowerCase()} y plazo de ${form.value.plazo} días que vencerá el día ${form.value.vencimiento_reinversion_txt}.`,
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
                    text: `Licda. Ana María Recinos Rivera de Córdova`,
                    alignment: "left",
                    margin: [300, 40, 10, 2],
                    fontSize: 10,
                },
                {
                    text: `Administradora Ejecutiva`,
                    alignment: "left",
                    margin: [350, 2, 10, 20],
                    fontSize: 10,
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

    createWord(form: FormGroup, common: CommonFunction) {
        let header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' " +
            "xmlns:w='urn:schemas-microsoft-com:office:word' " +
            "xmlns='http://www.w3.org/TR/REC-html40'>" +
            "<head><meta charset='utf-8'><title>Inversiones - Plan de Prestaciones</title></head><body>";
        let footer = "</body></html>";
        let content = `<p style="text-align: right;">REF: PP-&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</p>
    <p style="text-align: right;">&nbsp;</p>
    <p style="text-align: right; margin: 0cm; line-height: 14.2pt;">Guatemala,&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</p>
    <p style="text-align: right; margin: 0cm; line-height: 14.2pt;">${form.value.fecha}</p>
    <p style="margin: 0cm; line-height: 14.2pt;">${form.value.grado}</p>
    <p style="margin: 0cm; line-height: 14.2pt;">${form.value.nombre.toUpperCase()} ${form.value.apellido.toUpperCase()}</p>
    <p style="margin: 0cm; line-height: 14.2pt;">${form.value.puesto}</p>
    <p style="margin: 0cm; line-height: 14.2pt;">${form.value.banco.toUpperCase()}</p>
    <p style="margin: 0cm; line-height: 14.2pt;">Ciudad</p>    
    <p style="text-align: left;">${form.value.grado} ${form.value.apellido}:</p>
    <p style="text-align: justify;">&nbsp; &nbsp; &nbsp;Atentamente hacemos de su conocimiento que la Junta Administradora del Plan de Prestaciones, en sesión del ` +
            `${form.value.fecha_acta_txt}, Acta No. ${form.value.acta_japp}, acordó reinvertir en ese banco el valor del certificado ` +
            `No. ${form.value.referencia}, Cuenta ${form.value.cuenta} por Q${form.value.monto.toLocaleString('en', common.options)}, ` +
            `mas intereses de ${form.value.dias_interes} días por Q${form.value.interes.toLocaleString('en', common.options)} ` +
            `al ${form.value.vencimiento_txt}, fecha de vencimiento del certificado.</p>
    <p style="text-align: justify;">&nbsp; &nbsp; &nbsp;Por lo anterior, solicitamos se sirvan efectuar la reinversión con fecha ` +
            `${form.value.fecha_reinversion_txt} por valor de Q${(form.value.monto + form.value.interes).toLocaleString('en', common.options)} ` +
            `a nombre de PLAN DE PRESTACIONES, USAC, a una tasa fija de interés anual del ${form.value.tasa_interes}%, ` +
            `con pago ${form.value.periodo_pago.toLowerCase()} y plazo de ${form.value.plazo} días que vencerá el día ${form.value.vencimiento_reinversion_txt}.</p>
    <p style="text-align: justify;">&nbsp; &nbsp; &nbsp;Asimismo, se requiere que el certificado incluya lo relativo a la desinversión anticipada, forma ` +
            `de pago de intereses y la identificación de las personas que suscriben con sus respectivos cargos y ` +
            `sellos del banco.</p>
    <p style="text-align: justify;">&nbsp; &nbsp; &nbsp;Agradeciendo su atenci&oacute;n, le saludamos deferentemente.</p>
    <p style="text-align: left;">&nbsp;</p>
    <p style="text-align: center;">"ID Y ENSE&Ntilde;AD A TODOS"</p>
    <p style="text-align: center;">&nbsp;</p>
    <p style="text-align: right;">Licda. Ana Mar&iacute;a Recinos Rivera de C&oacute;rdova</p>
    <p style="text-align: right;">Administradora Ejecutiva&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</p>
    <p style="text-align: right;">&nbsp;</p>
    <p style="text-align: left;">Vo. Bo. _____________________________</p>
    <p style="text-align: left;">/amrdec</p>`
        let sourceHTML = header + content + footer;

        let source = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(sourceHTML);
        let fileDownload = document.createElement("a");
        document.body.appendChild(fileDownload);
        fileDownload.href = source;
        fileDownload.download = 'inversion.doc';
        fileDownload.click();
        document.body.removeChild(fileDownload);
    }

}
