import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { INVERSIONES_HOST } from 'app/inventario/shared/var.constants';
import { EstadoInversion } from 'app/modelos/inversiones/estadoinversion';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EstadoInversionService {

  message = new Subject<string>();
  
  url: string = INVERSIONES_HOST;
  
  constructor(private http: HttpClient) { }

  listar(pidu: String) {
    return this.http.get<EstadoInversion[]>(`${this.url}/estadoinversion?pidu=${pidu}`);
  }

  listarPorId(idEstado: number, pidu: String) {
    return this.http.get<EstadoInversion>(`${this.url}/estadoinversion/${idEstado}?pidu=${pidu}`);
  }
}
