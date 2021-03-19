
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Traslado } from '../../modelos/inventario/traslado';
import { INVENTARIO_HOST } from '../../inventario/shared/var.constants';

@Injectable({
  providedIn: 'root'
})
export class TrasladoService {
  
  message = new Subject<string>();
  
  url: string = INVENTARIO_HOST;
  
  constructor(private http: HttpClient) { }

  listar(pidu: String, tarjeta:number) {
    return this.http.get<Traslado[]>(`${this.url}/traslados?pidu=${pidu}&tarjeta=${tarjeta}`);
  }

  listarPorId(idTraslado: number, pidu: String) {
    return this.http.get<Traslado>(`${this.url}/traslados/${idTraslado}?pidu=${pidu}`);
  }

  registrar(traslado: Traslado, pidu: String) {
    return this.http.post(`${this.url}/traslados?pidu=${pidu}`, traslado);
  }

  modificar(traslado: Traslado, pidu: String) {
    return this.http.put(`${this.url}/traslados?pidu=${pidu}`, traslado);
  }

  eliminar(idTraslado: number, pidu: String) {
    return this.http.delete(`${this.url}/traslados/${idTraslado}?pidu=${pidu}`);
  }
}
