import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Banco } from 'app/modelos/inversiones/banco';
import { TipoEntidad } from 'app/modelos/inversiones/tipo-entidad';
import { BancoService } from 'app/servicios/inversiones/banco.service';
import { TipoEntidadService } from 'app/servicios/inversiones/tipo-entidad.service';

@Component({
  selector: 'elastic-banco-edicion',
  templateUrl: './banco-edicion.component.html',
  styleUrls: ['./banco-edicion.component.scss']
})
export class BancoEdicionComponent implements OnInit {

  form: FormGroup;
  mode: 'create' | 'update' = 'create';
  pidu = '10';
  tipos: TipoEntidad[];

  
  

  constructor(private dialogRef: MatDialogRef<BancoEdicionComponent>,
    @Inject(MAT_DIALOG_DATA) private defaults: Banco,
    private bancoService: BancoService,
    private tipoEntidadService: TipoEntidadService,
    private fb: FormBuilder) { }


  ngOnInit() {    
    this.updateTiposEntidad();

    if (this.defaults) {
      this.mode = 'update';
    } else {
      this.defaults = {} as Banco;
    }

    this.form = this.fb.group({      
      nombre:  this.defaults.nombre || '',
      contacto: this.defaults.contacto || '',      
      anexo: this.defaults.anexo || 1,      
      direccion: this.defaults.direccion || '',      
      telefono: this.defaults.telefono || '',
      nombre_gerente: this.defaults.nombre_gerente || '',      
      titulo_gerente: this.defaults.titulo_gerente || '',   
      tipo_entidad_id: this.defaults.tipo_Entidad? this.defaults.tipo_Entidad.id_tipo_entidad : null,         
    });
  }



  save() {    
    if (this.mode === 'create') {
      this.create();
    } else if (this.mode === 'update') {      
      this.update();
    }
  }

  create() {
    const banco: Banco = this.form.value;

    banco.tipo_Entidad = new TipoEntidad();
    banco.tipo_Entidad.id_tipo_entidad = this.form.value.tipo_entidad_id;
    
    this.bancoService.registrar(banco, this.pidu).subscribe(()=>{
      this.dialogRef.close(banco);
    })
    
  }

  update() {
    const banco: Banco = this.form.value;
    banco.id_banco = this.defaults.id_banco;

    banco.tipo_Entidad = new TipoEntidad();
    banco.tipo_Entidad.id_tipo_entidad = this.form.value.tipo_entidad_id;        
    this.bancoService.modificar(banco, this.pidu).subscribe(()=>{
      this.dialogRef.close(banco);
    })
  }

  isCreateMode() {
    return this.mode === 'create';
  }

  isUpdateMode() {
    return this.mode === 'update';
  }

  updateTiposEntidad() {
    this.tipoEntidadService.listar(this.pidu).subscribe(data => {      
      this.tipos = data;
    })
  }

}
