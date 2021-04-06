
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

  listarPorId(idTarjeta: number, pidu: String) {
    return this.http.get<TarjetaResponsabilidad>(`${this.url}/tarjetasresponsabilidad/${idTarjeta}?pidu=${pidu}`);
  }

  registrar(tarjeta: TarjetaResponsabilidad, pidu: String){
    return this.http.post<TarjetaResponsabilidad>(`${this.url}/tarjetasresponsabilidad?pidu=${pidu}`, tarjeta);
  }

  modificar(tarjeta: TarjetaResponsabilidad, pidu: String) {
    return this.http.put(`${this.url}/tarjetasresponsabilidad?pidu=${pidu}`, tarjeta);
  }

  eliminar(idTarjeta: number, pidu: String) {
    return this.http.delete(`${this.url}/tarjetasresponsabilidad/${idTarjeta}?pidu=${pidu}`);
  }
}
