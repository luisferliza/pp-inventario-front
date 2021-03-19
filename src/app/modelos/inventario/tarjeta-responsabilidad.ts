import { Articulo } from "./articulo";
import { Departamento } from "./departamento";
import { Usuario } from "./usuario";

export class TarjetaResponsabilidad{
    id_interno: number;
    id_tarjeta_responsabilidad: number;    
    receptor: Usuario;
    articulo: Articulo;
    departamento: Departamento;
}