import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { INVERSIONES_HOST } from 'app/inventario/shared/var.constants';
import { Firmante } from 'app/modelos/inversiones/firmante';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirmanteService {

  message = new Subject<string>();
  
  url: string = INVERSIONES_HOST;
  
  constructor(private http: HttpClient) { }

  listar(pidu: String) {
    return this.http.get<Firmante[]>(`${this.url}/firmantes?pidu=${pidu}`);
  }

  listarPorId(idCuenta: number, pidu: String) {
    return this.http.get<Firmante>(`${this.url}/firmantes/${idCuenta}?pidu=${pidu}`);
  }  

  obtenerFirmante(pidu: String, puesto: string){
    return this.http.get<Firmante[]>(`${this.url}/firmantes/puesto?pidu=${pidu}&puesto=${puesto}`);
  }

  registrar(firmante: Firmante, pidu: String) {    
    return this.http.post(`${this.url}/firmantes?pidu=${pidu}`, firmante);
  }

  modificar(firmante: Firmante, pidu: String) {
    return this.http.put(`${this.url}/firmantes?pidu=${pidu}`, firmante);
  }

  eliminar(idFirmante: number, pidu: String) {
    return this.http.delete(`${this.url}/firmantes/${idFirmante}?pidu=${pidu}`);
  }
}
