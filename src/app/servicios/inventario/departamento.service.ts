
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Departamento } from '../../modelos/inventario/departamento';
import { INVENTARIO_HOST } from '../../inventario/shared/var.constants';

@Injectable({
  providedIn: 'root'
})
export class DepartamentoService {  
  
  message = new Subject<string>();
  
  url: string = INVENTARIO_HOST;
  
  constructor(private http: HttpClient) { }

  listar(pidu: String) {
    return this.http.get<Departamento[]>(`${this.url}/departamentos?pidu=${pidu}`);
  }

  listarPorId(idDepartamento: number, pidu: String) {
    return this.http.get<Departamento>(`${this.url}/departamentos/${idDepartamento}?pidu=${pidu}`);
  }

  registrar(idDepartamento: Departamento, pidu: String) {
    return this.http.post(`${this.url}/departamentos?pidu=${pidu}`, idDepartamento);
  }

  modificar(idDepartamento: Departamento, pidu: String) {
    return this.http.put(`${this.url}/departamentos?pidu=${pidu}`, idDepartamento);
  }

  eliminar(idDepartamento: number, pidu: String) {
    return this.http.delete(`${this.url}/departamentos/${idDepartamento}?pidu=${pidu}`);
  }
}
