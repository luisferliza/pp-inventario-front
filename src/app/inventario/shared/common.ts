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
  public contador = "Contador General";
  public administrador = "Administrador Ejecutivo"
  public presidenteJunta = "Presidente"
  public secretarioJunta = "Secretario"
  public asistente_administrativo = "Asistente Administrativo"

}