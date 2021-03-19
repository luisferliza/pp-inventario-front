
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Proveedor } from '../../modelos/inventario/proveedor';
import { INVENTARIO_HOST } from '../../inventario/shared/var.constants';


@Injectable({
  providedIn: 'root'
})
export class ProveedorService {

  
  message = new Subject<string>();
  
  url: string = INVENTARIO_HOST;
  
  constructor(private http: HttpClient) { }

  listar(pidu: String) {
    return this.http.get<Proveedor[]>(`${this.url}/proveedores?pidu=${pidu}`);
  }

  listarPorId(idProveedor: number, pidu: String) {
    return this.http.get<Proveedor>(`${this.url}/proveedores/${idProveedor}?pidu=${pidu}`);
  }

  registrar(idProveedor: Proveedor, pidu: String) {
    return this.http.post(`${this.url}/proveedores?pidu=${pidu}`, idProveedor);
  }

  modificar(idProveedor: Proveedor, pidu: String) {
    return this.http.put(`${this.url}/proveedores?pidu=${pidu}`, idProveedor);
  }

  eliminar(idProveedor: number, pidu: String) {
    return this.http.delete(`${this.url}/proveedores/${idProveedor}?pidu=${pidu}`);
  }
}
