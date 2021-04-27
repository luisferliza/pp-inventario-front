import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { INVERSIONES_HOST } from 'app/inventario/shared/var.constants';
import { TipoCuenta } from 'app/modelos/inversiones/tipo-cuenta';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TipoCuentaService {

  message = new Subject<string>();
  
  url: string = INVERSIONES_HOST;
  
  constructor(private http: HttpClient) { }

  listar(pidu: String) {
    return this.http.get<TipoCuenta[]>(`${this.url}/tiposcuenta?pidu=${pidu}`);
  }

  listarPorId(idTipoCuenta: number, pidu: String) {
    return this.http.get<TipoCuenta>(`${this.url}/tiposcuenta/${idTipoCuenta}?pidu=${pidu}`);
  }
}
