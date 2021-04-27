import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { INVERSIONES_HOST } from 'app/inventario/shared/var.constants';
import { TipoEntidad } from 'app/modelos/inversiones/tipo-entidad';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TipoEntidadService {

  message = new Subject<string>();
  
  url: string = INVERSIONES_HOST;
  
  constructor(private http: HttpClient) { }

  listar(pidu: String) {
    return this.http.get<TipoEntidad[]>(`${this.url}/tiposentidad?pidu=${pidu}`);
  }

  listarPorId(idTipoEntidad: number, pidu: String) {
    return this.http.get<TipoEntidad>(`${this.url}/tiposentidad/${idTipoEntidad}?pidu=${pidu}`);
  }

}
