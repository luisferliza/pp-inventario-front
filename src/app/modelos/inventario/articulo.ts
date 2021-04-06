import { Categoria } from "./categoria";
import { Departamento } from "./departamento";
import { Estado } from "./estado";
import { Proveedor } from "./proveedor";
import { TipoArticulo } from "./tipo-articulo";

export class Articulo{
    id_articulo: number;	
	descripcion: string;
	inventario: string;
	fecha_compra: string;
	precio: number;
	marca: string;
	fungible: boolean;	
	categoria: Categoria;
	tipo_articulo: TipoArticulo;
	estado: Estado;	
	proveedor: Proveedor;
	residual: number;
	departamento: Departamento;
	
}