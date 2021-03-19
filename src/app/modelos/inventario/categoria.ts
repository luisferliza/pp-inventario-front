export class Categoria {
    id_categoria: number;
    nombre: string;
    depreciacion: number;

    constructor(categoria?: Categoria) {
        if (categoria) {
            this.id_categoria = categoria.id_categoria;
            this.nombre = categoria.nombre;
            this.depreciacion = categoria.depreciacion;
        } else {
            this.id_categoria = -1;
            this.nombre = '';
            this.depreciacion = 0;
        }
    }

}