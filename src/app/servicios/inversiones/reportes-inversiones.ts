import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { INVENTARIO_HOST, INVERSIONES_HOST } from "app/inventario/shared/var.constants";
import { InteresPorBanco } from "app/modelos/inversiones/InteresPorBanco";
import { Inversion } from "app/modelos/inversiones/inversion";

@Injectable({
  providedIn: 'root'
})
export class ReportesInversionesService {

  url: string = INVERSIONES_HOST;

  constructor(private http: HttpClient) { }

  controlVencimiento(pidu: String, fecha_ini: string, fecha_fin: string) {
    return this.http.get<Inversion[]>(`${this.url}/reportes/controlvencimiento?pidu=${pidu}&fecha_ini=${fecha_ini}&fecha_fin=${fecha_fin}`);
  }

  integracioPlazoFijo(pidu: String, fecha: string, id_banco: number) {
    return this.http.get<Inversion[]>(`${this.url}/reportes/integracionplazofijo?pidu=${pidu}&fecha=${fecha}&id_banco=${id_banco}`);
  }

  interesMensual(pidu: String, fecha: string, id_banco: number) {
    return this.http.get<Inversion[]>(`${this.url}/reportes/interesmensual?pidu=${pidu}&fecha=${fecha}&id_banco=${id_banco}`);
  }

  integracioPlazoFijoCompleto(pidu: String, fecha: string) {
    return this.http.get<InteresPorBanco[]>(`${this.url}/reportes/integracionplazofijocompleto?pidu=${pidu}&fecha=${fecha}`);
  }

  interesMensualCompleto(pidu: String, fecha: string) {
    return this.http.get<InteresPorBanco[]>(`${this.url}/reportes/interesmensualcompleto?pidu=${pidu}&fecha=${fecha}`);
  }

  calculoInteres(pidu: String, fecha: string, inversion: Inversion) {
    return this.http.put<Inversion>(`${this.url}/reportes/calculointeres?pidu=${pidu}&fecha=${fecha}`, inversion);
  }

}
