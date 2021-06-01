
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Usuario } from '../../modelos/inventario/usuario';
import { INVENTARIO_HOST, USUARIOS_HOST } from '../../inventario/shared/var.constants';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private http: HttpClient) { }

  url: string = INVENTARIO_HOST;
  usuario_url: string = USUARIOS_HOST;

  listar(pidu: String) {
    return this.http.get<Usuario[]>(`${this.url}/usuarios?pidu=${pidu}`);
  }

  listarExterno() {
    return this.http.get<Usuario[]>(`${this.usuario_url}/gateway/pp-perfiles/usuario`);
  }

  listarPorId(udUsuario: number, pidu: String) {
    return this.http.get<Usuario>(`${this.url}/usuarios/${udUsuario}?pidu=${pidu}`);
  }

  modificar(usuarios: Usuario[], pidu: String) {
    return this.http.put<Usuario>(`${this.url}/usuarios?pidu=${pidu}`, usuarios);
  }
}
