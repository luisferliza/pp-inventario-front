import { Banco } from "./banco";
import { Cuenta } from "./cuenta";
import { EstadoInversion } from "./estadoinversion";
import { TipoInversion } from "./tipo-inversion";

export class Inversion{
    id_inversion: number;
	referencia: string;
	monto: number;
	fecha_colocacion: string;	
	no_inversion: string;
	acta_japp: string;
	observacion: string;
	tasa_interes: number;
	plazo: number;
	cuenta: string;
	calculo_especial: boolean;
	fecha_acta: string;
	fecha_pago: string;
	dias_anuales: number;
	periodo_pago: string;
	vencimiento: string;
	tipo_Inversion: TipoInversion;
	estado: EstadoInversion;
	banco: Banco;
	cuenta_inversion: Cuenta;
	cuenta_provision: Cuenta;
	cuenta_interes: Cuenta;	
	diasInteres:number;
	interes:number;
}