import { Articulo } from "./articulo";
import { Departamento } from "./departamento";
import { TarjetaResponsabilidad } from "./tarjeta-responsabilidad";
import { Usuario } from "./usuario";

export class Traslado{
    id_traslado: number;
    tarjeta: TarjetaResponsabilidad;
    usuario: Usuario;
    seccion: Departamento;
    fecha_inicio: string;
    fecha_fin: string;    
}