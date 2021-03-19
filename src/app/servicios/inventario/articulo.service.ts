import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Articulo } from '../../modelos/inventario/articulo';
import { INVENTARIO_HOST } from '../../inventario/shared/var.constants';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ArticuloService {
  
  message = new Subject<string>();
  
  url: string = INVENTARIO_HOST;
  
  constructor(private http: HttpClient) { }

  listar(pidu: String) {
    return this.http.get<Articulo[]>(`${this.url}/articulos?pidu=${pidu}`);
  }

  listarPorId(idArticulo: number, pidu: String) {
    return this.http.get<Articulo>(`${this.url}/articulos/${idArticulo}?pidu=${pidu}`);
  }

  registrar(articulo: Articulo, pidu: String) {    
    return this.http.post(`${this.url}/articulos?pidu=${pidu}`, articulo);
  }

  modificar(articulo: Articulo, pidu: String) {
    return this.http.put(`${this.url}/articulos?pidu=${pidu}`, articulo);
  }

  eliminar(idArticulo: number, pidu: String) {
    return this.http.delete(`${this.url}/articulos/${idArticulo}?pidu=${pidu}`);
  }
}
