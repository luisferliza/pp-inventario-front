
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Usuario } from '../../modelos/inventario/usuario';
import { INVENTARIO_HOST } from '../../inventario/shared/var.constants';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private http: HttpClient) { }

  url: string = INVENTARIO_HOST;

  listar(pidu: String) {
    return this.http.get<Usuario[]>(`${this.url}/usuarios?pidu=${pidu}`);
  }

  listarPorId(udUsuario: number, pidu: String) {
    return this.http.get<Usuario>(`${this.url}/usuarios/${udUsuario}?pidu=${pidu}`);
  }

  modificar(usuarios: Usuario[], pidu: String) {
    return this.http.put<Usuario>(`${this.url}/usuarios?pidu=${pidu}`, usuarios);
  }
}
