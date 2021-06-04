import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { INVERSIONES_HOST } from 'app/inventario/shared/var.constants';
import { Inversion } from 'app/modelos/inversiones/inversion';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InversionService {

  message = new Subject<string>();
  
  url: string = INVERSIONES_HOST;
  
  constructor(private http: HttpClient) { }

  listar(pidu: String, vigente: boolean) {
    return this.http.get<Inversion[]>(`${this.url}/inversiones?pidu=${pidu}&vigente=${vigente}`);
  }

  listarPorId(idInversion: number, pidu: String) {
    return this.http.get<Inversion>(`${this.url}/inversiones/${idInversion}?pidu=${pidu}`);
  }

  registrar(inversion: Inversion, pidu: String) {    
    return this.http.post(`${this.url}/inversiones?pidu=${pidu}`, inversion);
  }

  modificar(inversion: Inversion, pidu: String) {
    return this.http.put(`${this.url}/inversiones?pidu=${pidu}`, inversion);
  }

  eliminar(idInversion: number, pidu: String) {
    return this.http.delete(`${this.url}/inversiones/${idInversion}?pidu=${pidu}`);
  }
}
