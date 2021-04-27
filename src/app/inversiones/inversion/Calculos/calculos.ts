import { Injectable } from "@angular/core";
import { Inversion } from "app/modelos/inversiones/inversion";

@Injectable({
    providedIn: 'root'
})

export class Calculos {    

    calcularDiasInteres(inversion: Inversion, fecha: Date): number {
        let periodo = inversion.periodo_pago;
        if (periodo === "Mensual") {
            return this.interarFechas(1,inversion,fecha);
        } else if (periodo === "Anual") {
            return this.interarFechas(12,inversion,fecha);
        } else if (periodo === "Semestral") {
            return this.interarFechas(6,inversion,fecha);
        } else if (periodo === "Trimestral") {
            return this.interarFechas(3,inversion,fecha);
        } else if (periodo === "Cuatrimestral") {
            return this.interarFechas(4,inversion,fecha);
        } else if (periodo === "A término") {
            return inversion.plazo;
        } else {
            alert('PERIODO DE PAGO DESCONOCIDO')
            return 0;
        }
    }

    calcularInteres(inversion: Inversion, fecha):number {
        let diasInteres = this.calcularDiasInteres(inversion, fecha);
        let diasAnuales = 1;
        if (false) { //inversion.calculo_especial
            diasAnuales = inversion.dias_anuales;
        } else {
            diasAnuales = this.days_of_a_year(parseInt(inversion.fecha_colocacion.split('-')[0]))
        }
        let interesDiario = inversion.monto * inversion.tasa_interes / 100 / diasAnuales;
        return parseFloat((interesDiario * diasInteres).toFixed(2));
    }

    days_of_a_year(year: number): number {
        return this.isLeapYear(year) ? 366 : 365;
    }

    isLeapYear(year: number) {
        return year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0);
    }

    interarFechas(meses:number, inversion: Inversion, fecha:Date){   
        
        let fecha_colocacion = new Date(inversion.fecha_colocacion);        
        let periodo_activo = new Date(inversion.fecha_pago);    
        let primera_fecha_pago = new Date(inversion.fecha_pago);          
        
        if(fecha<periodo_activo){
            periodo_activo = fecha_colocacion;
        }else{
            console.log('Fecha pago 2: ' + periodo_activo);
            while(periodo_activo < fecha){ // Itera hasta encontrar el periodo de pago actual
                periodo_activo.setMonth(periodo_activo.getMonth() + meses);                     
            }
            periodo_activo.setMonth(periodo_activo.getMonth() - meses);                     
        }        
        // Verifica que no haya un desfase en la fecha
        let actualDate = 0;
        while (periodo_activo.getDate() < primera_fecha_pago.getDate()) { // Si no hay desfase, todo bien              
            actualDate = periodo_activo.getDate()
            periodo_activo.setDate(periodo_activo.getDate()-1);
            if(periodo_activo.getDate() > actualDate){
                break; // Se desplazó un mes atras
            }
        }             
        console.log(periodo_activo)
        let diferenciaEnTiempo = fecha.getTime() - periodo_activo.getTime();
        let diferenciaEnDias = diferenciaEnTiempo / (1000 * 3600 * 24);             
        return diferenciaEnDias+1;       
    }
}