
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Condicion } from '../../modelos/inventario/condicion';
import { INVENTARIO_HOST } from '../../inventario/shared/var.constants';

@Injectable({
  providedIn: 'root'
})
export class CondicionService {  
  
  message = new Subject<string>();
  
  url: string = INVENTARIO_HOST;
  
  constructor(private http: HttpClient) { }

  listar(pidu: String) {
    return this.http.get<Condicion[]>(`${this.url}/condiciones?pidu=${pidu}`);
  }

  listarPorId(idCondicion: number, pidu: String) {
    return this.http.get<Condicion>(`${this.url}/condiciones/${idCondicion}?pidu=${pidu}`);
  }

  registrar(idCondicion: Condicion, pidu: String) {
    return this.http.post(`${this.url}/condiciones?pidu=${pidu}`, idCondicion);
  }

  modificar(idCondicion: Condicion, pidu: String) {
    return this.http.put(`${this.url}/condiciones?pidu=${pidu}`, idCondicion);
  }

  eliminar(idCondicion: number, pidu: String) {
    return this.http.delete(`${this.url}/condiciones/${idCondicion}?pidu=${pidu}`);
  }
}
