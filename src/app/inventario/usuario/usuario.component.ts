import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Usuario } from 'app/modelos/inventario/usuario';
import { UsuarioService } from 'app/servicios/inventario/usuario.service';

@Component({
  selector: 'elastic-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.scss']
})
export class UsuarioComponent implements OnInit {

  pidu = '10';  
  rows: Usuario[];  
  //False es bienes activos, true es fungibles

  constructor(private usuarioService: UsuarioService,              
              private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.listar();
  }

  listar() {    
    this.usuarioService.listar(this.pidu).subscribe(data =>{
      this.rows = data;
      document.getElementById('table').click();
    })    
  }

  updateUsuarios(){
    this.usuarioService.listarExterno().subscribe(data =>{ // Aca deberia de consumir el micro de usuarios            
      this.usuarioService.modificar(data, this.pidu).subscribe(()=>{
        this.snackBar.open('Registros Actualizados', 'AVISO', {
          duration: 2000
        });   
        this.listar();
      });      
    }); 
  }

}
