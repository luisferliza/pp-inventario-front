
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Categoria } from '../../modelos/inventario/categoria';
import { INVENTARIO_HOST } from '../../inventario/shared/var.constants';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {
  
  message = new Subject<string>();
  
  url: string = INVENTARIO_HOST;
  
  constructor(private http: HttpClient) { }

  listar(pidu: String) {
    return this.http.get<Categoria[]>(`${this.url}/categorias?pidu=${pidu}`);
  }

  listarPorId(idCategoria: number, pidu: String) {
    return this.http.get<Categoria>(`${this.url}/categorias/${idCategoria}?pidu=${pidu}`);
  }

  registrar(categoria: Categoria, pidu: String) {    
    return this.http.post(`${this.url}/categorias?pidu=${pidu}`, categoria);
  }

  modificar(categoria: Categoria, pidu: String) {
    return this.http.put(`${this.url}/categorias?pidu=${pidu}`, categoria);
  }

  eliminar(idCategoria: number, pidu: String) {
    return this.http.delete(`${this.url}/categorias/${idCategoria}?pidu=${pidu}`);
  }

}
