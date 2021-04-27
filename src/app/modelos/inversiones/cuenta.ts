import { TipoCuenta } from "./tipo-cuenta";

export class Cuenta{
    //Cuenta no terminada
    id_cuenta: number;
	numero: string;
	nombre: string;
    activa: Boolean;
    tipo_cuenta: TipoCuenta;
} 