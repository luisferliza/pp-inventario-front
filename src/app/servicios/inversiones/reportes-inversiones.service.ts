import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { INVERSIONES_HOST } from "app/inventario/shared/var.constants";
import { InversionesPorBanco } from "app/modelos/inversiones/InversionesPorBanco";
import { Inversion } from "app/modelos/inversiones/inversion";
import { TasaDTO } from "app/modelos/inversiones/TasaDTO";
import { InversionesPorTipoBanco } from "app/modelos/inversiones/inversionesPorTipoBanco";
import { TotalInversionesPorBanco } from "app/modelos/inversiones/totalInversionesPorBanco";
import { InversionesPorTipoInversionAprobadas } from "app/modelos/inversiones/InversionesPorTipoInversionAprobadas";

@Injectable({
  providedIn: 'root'
})
export class ReportesInversionesService {

  url: string = INVERSIONES_HOST;

  constructor(private http: HttpClient) { }

  controlVencimiento(pidu: String, fecha_ini: Date, fecha_fin: Date) {
    return this.http.get<Inversion[]>(`${this.url}/reportes/controlvencimiento?pidu=${pidu}&fecha_ini=${fecha_ini.toISOString()}&fecha_fin=${fecha_fin.toISOString()}`);
  }

  integracioPlazoFijo(pidu: String, fecha: Date, id_banco: number) {
    return this.http.get<Inversion[]>(`${this.url}/reportes/integracionplazofijo?pidu=${pidu}&fecha=${fecha.toISOString()}&id_banco=${id_banco}`);
  }

  interesMensual(pidu: String, fecha: Date, id_banco: number) {
    return this.http.get<Inversion[]>(`${this.url}/reportes/interesmensual?pidu=${pidu}&fecha=${fecha.toISOString()}&id_banco=${id_banco}`);
  }

  integracioPlazoFijoCompleto(pidu: String, fecha: Date) {
    return this.http.get<InversionesPorBanco[]>(`${this.url}/reportes/integracionplazofijocompleto?pidu=${pidu}&fecha=${fecha.toISOString()}`);
  }

  interesMensualCompleto(pidu: String, fecha: Date) {
    return this.http.get<InversionesPorBanco[]>(`${this.url}/reportes/interesmensualcompleto?pidu=${pidu}&fecha=${fecha.toISOString()}`);
  }

  anexo4(pidu: String, fecha: Date) {
    return this.http.get<InversionesPorTipoBanco[]>(`${this.url}/reportes/anexo4?pidu=${pidu}&fecha=${fecha.toISOString()}`);
  }

  anexo4VistaPrevia(pidu: String, fecha: Date, id_tipoEntidad) {
    return this.http.get<TotalInversionesPorBanco[]>(`${this.url}/reportes/anexo4/${id_tipoEntidad}?pidu=${pidu}&fecha=${fecha.toISOString()}`);
  }

  autorizacionInversion(pidu: String) {
    return this.http.get<InversionesPorTipoInversionAprobadas[]>(`${this.url}/reportes/autorizacioninversion?pidu=${pidu}`);
  }

  tasaMaxima(pidu: String, anio: number) {
    return this.http.get<TasaDTO[]>(`${this.url}/reportes/tasamaxima?pidu=${pidu}&anio=${anio}`);
  }

  tasaPromedio(pidu: String, anio: number) {
    return this.http.get<TasaDTO[]>(`${this.url}/reportes/tasapromedio?pidu=${pidu}&anio=${anio}`);
  }

  inversionesVencen(pidu: String, fecha_ini: Date, fecha_fin: Date) {
    return this.http.get<Inversion[]>(`${this.url}/reportes/inversionesvencen?pidu=${pidu}&fecha_ini=${fecha_ini.toISOString()}&fecha_fin=${fecha_fin.toISOString()}`);
  }

  inversionesEmitidas(pidu: String, fecha_ini: Date, fecha_fin: Date) {
    return this.http.get<Inversion[]>(`${this.url}/reportes/inversionesemitidas?pidu=${pidu}&fecha_ini=${fecha_ini.toISOString()}&fecha_fin=${fecha_fin.toISOString()}`);
  }

  calculoInteres(pidu: String, fecha: Date, inversion: Inversion) {
    return this.http.put<Inversion>(`${this.url}/reportes/calculointeres?pidu=${pidu}&fecha=${fecha.toISOString()}`, inversion);
  }

  

}
