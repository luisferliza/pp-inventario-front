
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { TarjetaResponsabilidad } from '../../modelos/inventario/tarjeta-responsabilidad';
import { INVENTARIO_HOST } from '../../inventario/shared/var.constants';

@Injectable({
  providedIn: 'root'
})
export class TarjetaResponsabilidadService {

  
  message = new Subject<string>();
  
  url: string = INVENTARIO_HOST;
  
  constructor(private http: HttpClient) { }

  listar(pidu: String) {
    return this.http.get<TarjetaResponsabilidad[]>(`${this.url}/tarjetasresponsabilidad?pidu=${pidu}`);
  }

  listarPorId(idTipoArticulo: number, pidu: String) {
    return this.http.get<TarjetaResponsabilidad>(`${this.url}/tarjetasresponsabilidad/${idTipoArticulo}?pidu=${pidu}`);
  }

  registrar(idTipoArticulo: TarjetaResponsabilidad, pidu: String) {
    return this.http.post(`${this.url}/tarjetasresponsabilidad?pidu=${pidu}`, idTipoArticulo);
  }

  modificar(idTipoArticulo: TarjetaResponsabilidad, pidu: String) {
    return this.http.put(`${this.url}/tarjetasresponsabilidad?pidu=${pidu}`, idTipoArticulo);
  }

  eliminar(idTipoArticulo: number, pidu: String) {
    return this.http.delete(`${this.url}/tarjetasresponsabilidad/${idTipoArticulo}?pidu=${pidu}`);
  }
}
