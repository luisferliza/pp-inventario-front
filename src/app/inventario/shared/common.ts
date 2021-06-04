import { Injectable } from '@angular/core';
import { Firmante } from 'app/modelos/inversiones/firmante';


@Injectable({
  providedIn: 'root'
})

export class CommonFunction {

  // Conversiones de tiempo 
  public getLocalDateString(dateTimeString: string | Date): string {    
    // Si el parametro es una cadena, lo convierte en fecha, sino solo lo usa
    if (dateTimeString == null)
      return '-'
    let dateTime: Date;
    if (typeof dateTimeString === "string") {
      dateTime = this.parseDate(dateTimeString);
    } else {
      dateTime = dateTimeString;
    }

    return this.getDateWithLeadingZeros(dateTime)
  }

  getDateWithLeadingZeros(date: Date) {
    let dateString = ('0' + date.getDate()).slice(-2) + '/'
      + ('0' + (date.getMonth() + 1)).slice(-2) + '/'
      + date.getFullYear();
    return dateString;
  }

  getFechaPagoString(dateString: string | Date): string {
    let date: Date;
    if (typeof dateString === "string") {
      date = this.parseDate(dateString);
    } else {
      date = dateString;
    }
    date.setDate(date.getDate() + 1);
    return this.getDateWithLeadingZeros(date);
  }

  public parseDate(date: string): Date {
    return new Date(date + this.timeOffset);
  }

  public localDate = 'es-GT'
  public dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };



  public timeOffset = 'T00:00:00';
  //Opciones de numeración
  public numberOptions = {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  };

  public localNumber = 'en';


  // Puestos generales
  public readonly contador = "Contador General";
  public readonly administrador = "Administrador Ejecutivo"
  public readonly presidenteJunta = "Presidente"
  public readonly secretarioJunta = "Secretario"
  public readonly asistente_administrativo = "Asistente Administrativo-Financiero"

  // Tipos de Cuenta
  public readonly CTA_INVERSION = 'Cta. de Inversión'
  public readonly CTA_INT_COBRAR ='Cta. de Intereses por cobrar'
  public readonly CTA_INT_PRODUCTO = 'Cta. de Interes producto'

  // Estados de inversion
  public readonly ESTADO_INVERSION = 'Inversion';
  public readonly ESTADO_REINVERSION = 'Reinversion';
  public readonly ESTADO_REINVERSION_PARCIAL = 'Reinversion Parcial';
  public readonly ESTADO_VENCIMIENTO = 'Vencimiento';
  public readonly ESTADO_DESINVERSION = 'Desinversión';

  // Bancos Especiales
  public readonly MINISTERIO_FINANZAS = 'MINISTERIO DE FINANZAS PÚBLICAS';
  public readonly BANCOS_ESTATALES = 'BANCOS ESTATALES';

}