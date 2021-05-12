import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Firmante } from 'app/modelos/inversiones/firmante';
import { FirmanteService } from 'app/servicios/inversiones/firmante.service';

@Component({
  selector: 'elastic-firmante-edicion',
  templateUrl: './firmante-edicion.component.html',
  styleUrls: ['./firmante-edicion.component.scss']
})
export class FirmanteEdicionComponent implements OnInit {

  form: FormGroup;  
  pidu = '10'; 
  puesto ='';
  

  constructor(private dialogRef: MatDialogRef<FirmanteEdicionComponent>,
    @Inject(MAT_DIALOG_DATA) private defaults: Firmante,
    private firmanteService: FirmanteService,    
    private fb: FormBuilder) { }


  ngOnInit() {       
    this.puesto = this.defaults.puesto;    

    this.form = this.fb.group({      
      nombre:  this.defaults.nombre || '',
      despliegue: this.defaults.despliegue || ''      
    });
  }
  


  update() {
    const firmante: Firmante = this.form.value;
    firmante.id_firmante = this.defaults.id_firmante;
    firmante.puesto = this.defaults.puesto;    
    
    this.firmanteService.modificar(firmante, this.pidu).subscribe(()=>{
      this.dialogRef.close(firmante);
    })
  }


}
