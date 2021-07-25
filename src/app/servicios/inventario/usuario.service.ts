
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Usuario } from '../../modelos/inventario/usuario';
import { INVENTARIO_HOST, USUARIOS_HOST } from '../../inventario/shared/var.constants';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  mensajeCambio = new Subject<string>();

  constructor(private http: HttpClient) { }

  url: string = INVENTARIO_HOST;
  usuario_url: string = USUARIOS_HOST;

  listar(pidu: String) {
    return this.http.get<Usuario[]>(`${this.url}/usuarios?pidu=${pidu}`);
  }

  listarExterno() {
    return this.http.get<Usuario[]>(`${this.usuario_url}/gateway/pp-perfiles/usuario`);
  }

  listarPorId(idUsuario: number, pidu: String) {
    return this.http.get<Usuario>(`${this.url}/usuarios/${idUsuario}?pidu=${pidu}`);
  }

  modificar(usuarios: Usuario[], pidu: String) {
    return this.http.put<Usuario>(`${this.url}/usuarios?pidu=${pidu}`, usuarios);
  }

  eliminar(idUsuario: number, pidu: String) {
    return this.http.delete(`${this.url}/usuarios/${idUsuario}?pidu=${pidu}`);
  }
}
