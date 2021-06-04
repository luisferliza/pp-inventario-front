import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TipoInversion } from 'app/modelos/inversiones/tipo-inversion';
import { Subject } from 'rxjs';
import { INVERSIONES_HOST } from 'app/inventario/shared/var.constants';

@Injectable({
  providedIn: 'root'
})
export class TipoInversionService {

  message = new Subject<string>();
  
  url: string = INVERSIONES_HOST;
  
  constructor(private http: HttpClient) { }

  listar(pidu: String) {
    return this.http.get<TipoInversion[]>(`${this.url}/tiposinversion?pidu=${pidu}`);
  }

  listarPorId(idTipoInversion: number, pidu: String) {
    return this.http.get<TipoInversion>(`${this.url}/tiposinversion/${idTipoInversion}?pidu=${pidu}`);
  }

  registrar(tipoInv: TipoInversion, pidu: String) {    
    return this.http.post(`${this.url}/tiposinversion?pidu=${pidu}`, tipoInv);
  }

  modificar(tipoInv: TipoInversion, pidu: String) {
    return this.http.put(`${this.url}/tiposinversion?pidu=${pidu}`, tipoInv);
  }

  eliminar(idCuenta: number, pidu: String) {
    return this.http.delete(`${this.url}/tiposinversion/${idCuenta}?pidu=${pidu}`);
  }

}
