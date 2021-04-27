import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { INVERSIONES_HOST } from 'app/inventario/shared/var.constants';
import { Cuenta } from 'app/modelos/inversiones/cuenta';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CuentaService {

  message = new Subject<string>();
  
  url: string = INVERSIONES_HOST;
  
  constructor(private http: HttpClient) { }

  listar(pidu: String) {
    return this.http.get<Cuenta[]>(`${this.url}/cuentas?pidu=${pidu}`);
  }

  listarPorId(idCuenta: number, pidu: String) {
    return this.http.get<Cuenta>(`${this.url}/cuentas/${idCuenta}?pidu=${pidu}`);
  }

  registrar(cuenta: Cuenta, pidu: String) {    
    return this.http.post(`${this.url}/cuentas?pidu=${pidu}`, cuenta);
  }

  modificar(cuenta: Cuenta, pidu: String) {
    return this.http.put(`${this.url}/cuentas?pidu=${pidu}`, cuenta);
  }

  eliminar(idCuenta: number, pidu: String) {
    return this.http.delete(`${this.url}/cuentas/${idCuenta}?pidu=${pidu}`);
  }
  
}
