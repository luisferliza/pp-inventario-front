export class TipoInversion{
    id_tipo_inversion:number;
    nombre:string;
    siglas:string;

    public getNombre(){
        this.siglas == ""? this.nombre : `${this.nombre} (${this.siglas})`
    }
}