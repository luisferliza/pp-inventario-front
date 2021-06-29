import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './core/layout/layout.component';
import { authRoutes } from './pages/auth/auth.routing';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        loadChildren: 'app/pages/dashboard/dashboard-statistics/dashboard-statistics.module#DashboardStatisticsModule',
        pathMatch: 'full'
      },
      //#region Inventario
      //############################## Inventarios ################################      
      {
        path: 'inventario/articulos',
        loadChildren: 'app/inventario/articulo/articulo.module#ArticuloModule'
      },
      {
        path: 'inventario/categorias',
        loadChildren: 'app/inventario/categoria/categoria.module#CategoriaModule'
      },
      {
        path: 'inventario/condiciones',
        loadChildren: 'app/inventario/condicion/condicion.module#CondicionModule'
      },
      {
        path: 'inventario/departamentos',
        loadChildren: 'app/inventario/departamento/departamento.module#DepartamentoModule'
      },
      {
        path: 'inventario/estados',
        loadChildren: 'app/inventario/estado/estado.module#EstadoModule'
      },
      {
        path: 'inventario/proveedores',
        loadChildren: 'app/inventario/proveedor/proveedor.module#ProveedorModule'
      },
      {
        path: 'inventario/tiposarticulo',
        loadChildren: 'app/inventario/tipo-articulo/tipo-articulo.module#TipoArticuloModule'
      },    
      {
        path: 'inventario/tarjetas',
        loadChildren: 'app/inventario/tarjeta-responsabilidad/tarjeta-responsabilidad.module#TarjetaResponsabilidadModule'
      },
      {
        path: 'inventario/usuarios',
        loadChildren: 'app/inventario/usuario/usuario.module#UsuarioModule'
      },
      //#Reportes
      {
        path: 'inventario/reportes/inventarioactivosfijos',
        loadChildren: 'app/inventario/reportes/inventario-activos-fijos/inventario-activos-fijos.module#InventarioActivosFijosModule'
      },
      {
        path: 'inventario/reportes/depreciacionactivosfijos',
        loadChildren: 'app/inventario/reportes/depreciacion-activos-fijos/depreciacion-activos-fijos.module#DepreciacionActivosFijosModule'
      },
      {
        path: 'inventario/reportes/bajasactivosfijos',
        loadChildren: 'app/inventario/reportes/bajas-activos-fijos/bajas-activos-fijos.module#BajasActivosFijosModule'
      },
      {
        path: 'inventario/reportes/subasta',
        loadChildren: 'app/inventario/reportes/subasta-bienes/subasta-bienes.module#SubastaBienesModule'
      },
      {
        path: 'inventario/reportes/compraexterna',
        loadChildren: 'app/inventario/reportes/compra-externa/compra-externa.module#CompraExternaModule'
      },
      {
        path: 'inventario/reportes/donaciones',
        loadChildren: 'app/inventario/reportes/donaciones/donaciones.module#DonacionesModule'
      },
      {
        path: 'inventario/reportes/responsables',
        loadChildren: 'app/inventario/reportes/responsable-activos/responsable-activos.module#ResponsableActivosModule'
      },
      {
        path: 'inventario/reportes/activosporusuario',
        loadChildren: 'app/inventario/reportes/activos-por-usuario/activos-por-usuario.module#ActivosPorUsuarioModule'
      },
      
      
      //###########################################################################
      //#endregion
      //#region Inventario
      //############################## Inversiones ################################      
      {
        path: 'inversiones/bancos',
        loadChildren: 'app/inversiones/banco/banco.module#BancoModule'
      },
      {
        path: 'inversiones/cuentas',
        loadChildren: 'app/inversiones/cuenta/cuenta.module#CuentaModule'
      },
      {
        path: 'inversiones/inversiones',
        loadChildren: 'app/inversiones/inversion/inversion.module#InversionModule'
      },  
      {
        path: 'inversiones/firmantes',
        loadChildren: 'app/inversiones/firmante/firmante.module#FirmanteModule'
      },  
      {
        path: 'inversiones/tiposinversion',
        loadChildren: 'app/inversiones/tipo-inversion/tipo-inversion.module#TipoInversionModule'
      },  
      // Reportes
      {
        path: 'inversiones/reportes/interes-mensual',
        loadChildren: 'app/inversiones/reportes/interes-mensual/interes-mensual.module#InteresMensualModule'
      },
      {
        path: 'inversiones/reportes/integracion-plazo-fijo',
        loadChildren: 'app/inversiones/reportes/integracion-plazo/integracion-plazo.module#IntegracionPlazoModule'
      },
      {
        path: 'inversiones/reportes/control-vencimiento',
        loadChildren: 'app/inversiones/reportes/control-vencimiento/control-vencimiento.module#ControlVencimientoModule'
      },
      {
        path: 'inversiones/reportes/anexo2',
        loadChildren: 'app/inversiones/reportes/anexo4/anexo4.module#Anexo4Module'
      },
      {
        path: 'inversiones/reportes/autorizacion-inversion',
        loadChildren: 'app/inversiones/reportes/autorizacion-inversion/autorizacion-inversion.module#AutorizacionInversionModule'
      },
      {
        path: 'inversiones/reportes/inversiones-emitidas',
        loadChildren: 'app/inversiones/reportes/inversiones-emitidas/inversiones-emitidas.module#InversionesEmitidasModule'
      },
      {
        path: 'inversiones/reportes/inversiones-vencen',
        loadChildren: 'app/inversiones/reportes/inversiones-vencen/inversiones-vencen.module#InversionesVencenModule'
      },
      {
        path: 'inversiones/reportes/tasa-maxima',
        loadChildren: 'app/inversiones/reportes/tasa-maxima/tasa-maxima.module#TasaMaximaModule'
      },
      {
        path: 'inversiones/reportes/tasa-promedio',
        loadChildren: 'app/inversiones/reportes/tasa-promedio/tasa-promedio.module#TasaPromedioModule'
      },            
      //###########################################################################
      //#endregion
      {
        path: 'dashboard/all-in-one',
        loadChildren: 'app/pages/dashboard/dashboard.module#DashboardModule'
      },
      {
        path: 'dashboard/crm',
        loadChildren: 'app/pages/dashboard/dashboard-crm/dashboard-crm.module#DashboardCrmModule'
      },
      {
        path: 'apps/chat',
        loadChildren: 'app/pages/chat/chat.module#ChatModule'
      },
      {
        path: 'components',
        loadChildren: 'app/pages/components/components.module#ComponentsModule'
      },
      {
        path: 'forms',
        loadChildren: 'app/pages/forms/forms.module#FormModule'
      },
      {
        path: 'apps/inbox',
        loadChildren: 'app/pages/inbox/inbox.module#InboxModule'
      },
      {
        path: 'pages/profile',
        loadChildren: 'app/pages/profile/profile.module#ProfileModule'
      },
      {
        path: 'tables/simple-table',
        loadChildren: 'app/pages/tables/simple-table/simple-table.module#SimpleTableModule'
      },
      {
        path: 'tables/table-pagination',
        loadChildren: 'app/pages/tables/table-pagination/table-pagination.module#TablePaginationModule'
      },
      {
        path: 'tables/table-sorting',
        loadChildren: 'app/pages/tables/table-sorting/table-sorting.module#TableSortingModule'
      },
      {
        path: 'tables/table-filtering',
        loadChildren: 'app/pages/tables/table-filtering/table-filtering.module#TableFilteringModule'
      },
      {
        path: 'tables/datatable',
        loadChildren: 'app/pages/tables/datatable/datatable.module#DatatableModule'
      },
      {
        path: 'tables/all-in-one-table',
        loadChildren: 'app/pages/tables/all-in-one-table/all-in-one-table.module#AllInOneTableModule'
      },
      {
        path: 'maps/google-maps',
        loadChildren: 'app/pages/google-maps/google-maps.module#GoogleMapsModule'
      },
      {
        path: 'pages/projects',
        loadChildren: 'app/pages/projects/projects.module#ProjectsModule'
      },
      {
        path: 'pages/project-details',
        loadChildren: 'app/pages/project-details/project-details.module#ProjectDetailsModule'
      },
      {
        path: 'material-icons',
        loadChildren: 'app/pages/icon/icon.module#IconModule'
      },
      {
        path: 'editor',
        loadChildren: 'app/pages/editor/editor.module#EditorModule'
      },
      {
        path: 'drag-and-drop',
        loadChildren: 'app/pages/drag-and-drop/drag-and-drop.module#DragAndDropModule'
      }
    ]
  },
  {
    path: 'auth',
    children: [
      ...authRoutes
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabled',
    preloadingStrategy: PreloadAllModules,
    scrollPositionRestoration: 'top'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
