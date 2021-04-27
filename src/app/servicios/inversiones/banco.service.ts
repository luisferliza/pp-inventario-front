import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { INVERSIONES_HOST } from 'app/inventario/shared/var.constants';
import { Banco } from 'app/modelos/inversiones/banco';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BancoService {

  message = new Subject<string>();
  
  url: string = INVERSIONES_HOST;
  
  constructor(private http: HttpClient) { }

  listar(pidu: String) {
    return this.http.get<Banco[]>(`${this.url}/bancos?pidu=${pidu}`);
  }

  listarPorId(idBanco: number, pidu: String) {
    return this.http.get<Banco>(`${this.url}/bancos/${idBanco}?pidu=${pidu}`);
  }

  registrar(banco: Banco, pidu: String) {    
    return this.http.post(`${this.url}/bancos?pidu=${pidu}`, banco);
  }

  modificar(banco: Banco, pidu: String) {
    return this.http.put(`${this.url}/bancos?pidu=${pidu}`, banco);
  }

  eliminar(idBanco: number, pidu: String) {
    return this.http.delete(`${this.url}/bancos/${idBanco}?pidu=${pidu}`);
  }
}
