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

export class DesinversionAnticipadaCreator {
  // tslint:disable-next-line: typedef
  constructor(private common: CommonFunction){}


  public createPDF(fecha: Date,
    grado: string,
    nombre: string,
    apellido: string,
    puesto: string,
    banco: string,
    fecha_acta: Date,
    acta_japp: string,
    certificado: string,
    cuenta: string,
    monto: number,
    dias_interes: number,
    interes: number,
    vencimiento: Date,
    entrega: Date,
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
            `${fecha_acta.toLocaleDateString(this.common.localDate, this.common.dateOptions)}, Acta No. ${acta_japp}, acordó desinvertir en ese banco el valor del ` +
            `certificado ${certificado}, cuenta ${cuenta} por Q${monto.toLocaleString(this.common.localNumber, this.common.numberOptions)}, `+
            `más intereses de ${dias_interes} días por Q${interes.toLocaleString(this.common.localNumber, this.common.numberOptions)} `+
            `al ${vencimiento.toLocaleDateString(this.common.localDate, this.common.dateOptions)}, fecha en que se realizará la desinversión.`,
          alignment: "justify",
          margin: [10, 20, 10, 0],
          fontSize: 10,
        },
        {
          text: `\u200B\t\tPor lo anterior solicitamos sirvan emitir cheque a nombre de PLAN DE PRESTACIONES USAC, `+
            `por un valor de Q${(monto+interes).toLocaleString(this.common.localNumber, this.common.numberOptions)} para `+
            `recogerlos el día ${entrega.toLocaleDateString(this.common.localDate, this.common.dateOptions)}.`,
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
          margin: [10, 50, 10, 10],
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

  createWord(fecha: Date,
    grado: string,
    nombre: string,
    apellido: string,
    puesto: string,
    banco: string,
    fecha_acta: Date,
    acta_japp: string,
    certificado: string,
    cuenta: string,
    monto: number,
    dias_interes: number,
    interes: number,
    vencimiento: Date,
    entrega: Date,
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
    <p style="text-align: left;">&nbsp;</p>
    <p style="text-align: left;">${grado} ${apellido}:</p>
    <p style="text-align: justify;">&nbsp; &nbsp; &nbsp;Atentamente hacemos de su conocimiento que la Junta Administradora del Plan de Prestaciones, en sesión del ` +
    `${fecha_acta.toLocaleDateString(this.common.localDate, this.common.dateOptions)}, Acta No. ${acta_japp}, acordó desinvertir en ese banco el valor del ` +
    `certificado ${certificado}, cuenta ${cuenta} por Q${monto.toLocaleString(this.common.localNumber, this.common.numberOptions)}, `+
    `más intereses de ${dias_interes} días por Q${interes.toLocaleString(this.common.localNumber, this.common.numberOptions)} `+
    `al ${vencimiento.toLocaleDateString(this.common.localDate, this.common.dateOptions)}, fecha en que se realizará la desinversión.</p>
    <p style="text-align: justify;">&nbsp; &nbsp; &nbsp;Por lo anterior solicitamos sirvan emitir cheque a nombre de PLAN DE PRESTACIONES USAC, `+
    `por un valor de Q${(monto+interes).toLocaleString(this.common.localNumber, this.common.numberOptions)} para `+
    `recogerlos el día ${entrega.toLocaleDateString(this.common.localDate, this.common.dateOptions)}.</p>    
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
    fileDownload.download = 'carta-desinversion.doc';
    fileDownload.click();
    document.body.removeChild(fileDownload);
  }

}

