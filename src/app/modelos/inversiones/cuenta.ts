import { TipoCuenta } from "./tipo-cuenta";
import { Banco } from "./banco";

export class Cuenta{
    //Cuenta no terminada
    id_cuenta: number;
	numero: string;
	nombre: string;
    activa: Boolean;
    tipoCuenta: TipoCuenta;
    banco: Banco;
} 