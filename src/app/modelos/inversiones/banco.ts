import { TipoEntidad } from "./tipo-entidad";

export class Banco{
    id_banco:number;
	nombre:string;
	anexo:number;
	contacto:string;		
	direccion:string;	
	telefono:string;	
	nombre_gerente:string;	
	titulo_gerente:string;	
    tipo_Entidad: TipoEntidad;

	public toString = () : string => {
        return this.nombre;
    }
}