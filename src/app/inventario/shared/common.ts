import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})

export class CommonFunction {

  public getDate(dateTime: string) {
    if(dateTime == null)
      return '-'
    let dateFormat = dateTime.split('T')[0];
    let date = dateFormat.split('-');
    let day = date[2];
    let month = date[1];
    let year = date[0];
    return `${day}-${month}-${year}`
  }

  public options = { 
    minimumFractionDigits: 2,
    maximumFractionDigits: 2 
  };

  public contador = "Lic. Bagnner Santana Gramajo Barreno";
  public administrador = "Licda. Ana María Recinos Rivera de Córdova"
}