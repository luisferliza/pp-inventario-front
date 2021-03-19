
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Estado } from '../../modelos/inventario/estado';
import { INVENTARIO_HOST } from '../../inventario/shared/var.constants';

@Injectable({
  providedIn: 'root'
})
export class EstadoService {

  
  message = new Subject<string>();
  
  url: string = INVENTARIO_HOST;
  
  constructor(private http: HttpClient) { }

  listar(pidu: String) {
    return this.http.get<Estado[]>(`${this.url}/estados?pidu=${pidu}`);
  }

  listarPorId(idEstado: number, pidu: String) {
    return this.http.get<Estado>(`${this.url}/estados/${idEstado}?pidu=${pidu}`);
  }

  registrar(idEstado: Estado, pidu: String) {
    return this.http.post(`${this.url}/estados?pidu=${pidu}`, idEstado);
  }

  modificar(idEstado: Estado, pidu: String) {
    return this.http.put(`${this.url}/estados?pidu=${pidu}`, idEstado);
  }

  eliminar(idEstado: number, pidu: String) {
    return this.http.delete(`${this.url}/estados/${idEstado}?pidu=${pidu}`);
  }
}
