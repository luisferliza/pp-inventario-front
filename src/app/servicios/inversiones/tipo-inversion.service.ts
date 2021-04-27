import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { INVERSIONES_HOST } from 'app/inventario/shared/var.constants';
import { TipoInversion } from 'app/modelos/inversiones/tipo-inversion';
import { Subject } from 'rxjs';

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

}
