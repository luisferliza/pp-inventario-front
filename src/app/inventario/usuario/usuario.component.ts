import { Component, OnInit, ViewChild, Input, OnDestroy } from '@angular/core';
import { MatSnackBar, MatDialog, MatSort, MatPaginator } from '@angular/material';
import { Usuario } from 'app/modelos/inventario/usuario';
import { UsuarioService } from 'app/servicios/inventario/usuario.service';
import { ListColumn } from 'app/core/list/list-column.model';
import { ListDataSource } from 'app/core/list/list-datasource';
import { ListDatabase } from 'app/core/list/list-database';
import { ReplaySubject, Observable } from 'rxjs';
import { List } from 'app/core/list/list.interface';
import { takeUntil, filter } from 'rxjs/operators';
import { componentDestroyed } from 'app/core/utils/component-destroyed';
import { DeleteDialogComponent } from 'app/servicios/common/delete-dialog/delete-dialog.component';
import { UsuarioEdicionComponent } from './usuario-edicion/usuario-edicion.component';
import { ROUTE_TRANSITION } from 'app/app.animation';

@Component({
  selector: 'elastic-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.scss'],
  animations: [...ROUTE_TRANSITION],
  host: { '[@routeTransition]': '' }
})
export class UsuarioComponent implements List<Usuario>, OnInit, OnDestroy {

  subject$: ReplaySubject<Usuario[]> = new ReplaySubject<Usuario[]>(1);
  data$: Observable<Usuario[]>;
  categorias: Usuario[];

  @Input()
  columns: ListColumn[] = [
    { name: 'Registro Personal', property: 'idUsuario', visible: true, isModelProperty: true },
    { name: 'Nombre', property: 'nombrepp', visible: true, isModelProperty: true },
    { name: 'Puesto', property: 'puesto', visible: true, isModelProperty: true },
    { name: 'Actions', property: 'actions', visible: true },
  ] as ListColumn[];


  pageSize = 10;
  resultsLength: number;
  dataSource: ListDataSource<Usuario> | null;
  database: ListDatabase<Usuario>;
  pidu = '10';

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private snackBar: MatSnackBar, 
              private dialog: MatDialog,
              private usuarioService: UsuarioService) { }

  get visibleColumns() {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }

  ngOnInit(): void {
    this.listar();
    this.usuarioService.mensajeCambio.subscribe(data => {
      this.snackBar.open(data, 'AVISO', {
        duration: 2000
      });
    });
  }

  
  listar() {
    this.usuarioService.listar(this.pidu).subscribe(data => {
      this.categorias = data;
      this.subject$.next(data);
      this.data$ = this.subject$.asObservable();
      this.database = new ListDatabase<Usuario>();
      this.data$.pipe(
        takeUntil(componentDestroyed(this)),
        filter(Boolean)
      ).subscribe((categorias: Usuario[]) => {
        this.categorias = categorias;
        this.database.dataChange.next(categorias);
        this.resultsLength = categorias.length;
      });

      this.dataSource = new ListDataSource<Usuario>(this.database, this.sort, this.paginator, this.columns);
      document.getElementById('table').click();

    });
  }



  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  create() {
    this.dialog.open(UsuarioEdicionComponent).afterClosed().subscribe((usuario: Usuario) => {
      if (usuario) {
        this.listar();
        this.usuarioService.mensajeCambio.next('Registro creado correctamente.');
      }
    });
  }

  modify(estado) {
    this.dialog.open(UsuarioEdicionComponent, {
      data: estado
    }).afterClosed().subscribe(resp => {
      if (resp) {
        this.listar();
        this.usuarioService.mensajeCambio.next('Registro modificado correctamente.');
      }
    });
  }

  delete(usuario: Usuario) {
    this.dialog.open(DeleteDialogComponent).afterClosed().subscribe(resp => {
      if (resp) {
        let idEstado = usuario.idUsuario;
        this.usuarioService.eliminar(idEstado, this.pidu).subscribe(() => {
          this.listar();
          this.usuarioService.mensajeCambio.next('Registro eliminado correctamente.');
        });
      }
    });
  }


  onFilterChange(value) {
    if (!this.dataSource) {
      return;
    }
    this.dataSource.filter = value;
  }

  ngOnDestroy(): void {
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
