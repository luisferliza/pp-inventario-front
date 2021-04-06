
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivosPorUsuario } from '../../modelos/inventario/reportes/activosPorUsuario';
import { INVENTARIO_HOST } from '../../inventario/shared/var.constants';
import { InventarioActivosFijos } from 'app/modelos/inventario/reportes/InventarioActivosFijos';
import { DepreciacionActivosFijos } from 'app/modelos/inventario/reportes/depreciacionActivosFijos';
import { ResponsableActivosFijos } from 'app/modelos/inventario/reportes/responsableActivos';
import { Donacion } from 'app/modelos/inventario/reportes/donaciones';
import { SubastaBienes } from 'app/modelos/inventario/reportes/subastaBienes';
import { Variable } from 'app/modelos/inventario/reportes/variable';



@Injectable({
  providedIn: 'root'
})
export class ReportesService {
  
  url: string = INVENTARIO_HOST;
  
  constructor(private http: HttpClient) { }

  inventarioActivosFijos(pidu: String, fungible:string) {
    return this.http.get<InventarioActivosFijos[]>(`${this.url}/reportes/activosfijos?pidu=${pidu}&fungible=${fungible}`);
  }

  bajasActivosFijos(pidu: String, fungible:string) {
    return this.http.get<InventarioActivosFijos[]>(`${this.url}/reportes/bajasactivosfijos?pidu=${pidu}&fungible=${fungible}`);
  }

  depreciacionActivosFijos(pidu: String, date:string, categoria:number) {
    return this.http.get<DepreciacionActivosFijos[]>(`${this.url}/reportes/activosfijosdepreciacion?pidu=${pidu}&date=${date}&id_categoria=${categoria}`);
  }

  responsableActivosFijos(pidu: String, fungible:string) {
    return this.http.get<ResponsableActivosFijos[]>(`${this.url}/reportes/activosfijosresponsable?pidu=${pidu}&fungible=${fungible}`);
  }

  donaciones(pidu: String, fungible:string, categoria:number) {
    return this.http.get<Donacion[]>(`${this.url}/reportes/donaciones?pidu=${pidu}&fungible=${fungible}&id_categoria=${categoria}`);
  }

  activosPorUsuario(pidu: String, fungible:string, usuario:number) {
    return this.http.get<ActivosPorUsuario[]>(`${this.url}/reportes/activosporusuario?pidu=${pidu}&fungible=${fungible}&id_usuario=${usuario}`);
  }  

  subastaBienesSinAgrupar(pidu: String, fungible:string, categoria:number) {
    return this.http.get<SubastaBienes[]>(`${this.url}/reportes/comprainterna?pidu=${pidu}&fungible=${fungible}&id_categoria=${categoria}`);
  }

  compraExterna(pidu: String, fungible:string, categoria:number) {
    return this.http.get<SubastaBienes[]>(`${this.url}/reportes/compraexterna?pidu=${pidu}&fungible=${fungible}&id_categoria=${categoria}`);
  }

  obtenerVariable(pidu: String, variable:string) {
    return this.http.get<Variable>(`${this.url}/variables?pidu=${pidu}&variableName=${variable}`);
  }

  modificarVariable(pidu: String, variable:Variable) {
    return this.http.put<Variable>(`${this.url}/variables?pidu=${pidu}`, variable);
  }

}
