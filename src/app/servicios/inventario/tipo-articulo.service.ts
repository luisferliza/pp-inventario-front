
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { TipoArticulo } from '../../modelos/inventario/tipo-articulo';
import { INVENTARIO_HOST } from '../../inventario/shared/var.constants';

@Injectable({
  providedIn: 'root'
})
export class TipoArticuloService {

  mensajeCambio = new Subject<string>();
  
  url: string = INVENTARIO_HOST;
  
  constructor(private http: HttpClient) { }

  listar(pidu: String) {
    return this.http.get<TipoArticulo[]>(`${this.url}/tiposarticulo?pidu=${pidu}`);
  }

  listarPorId(idTipoArticulo: number, pidu: String) {
    return this.http.get<TipoArticulo>(`${this.url}/tiposarticulo/${idTipoArticulo}?pidu=${pidu}`);
  }

  registrar(idTipoArticulo: TipoArticulo, pidu: String) {
    return this.http.post(`${this.url}/tiposarticulo?pidu=${pidu}`, idTipoArticulo);
  }

  modificar(idTipoArticulo: TipoArticulo, pidu: String) {
    return this.http.put(`${this.url}/tiposarticulo?pidu=${pidu}`, idTipoArticulo);
  }

  eliminar(idTipoArticulo: number, pidu: String) {
    return this.http.delete(`${this.url}/tiposarticulo/${idTipoArticulo}?pidu=${pidu}`);
  }
}
