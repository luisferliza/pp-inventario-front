import { Component, OnInit } from '@angular/core';
import { SidenavItem } from '../sidenav/sidenav-item/sidenav-item.model';
import * as fromRoot from '../../reducers/index';
import * as fromSidenav from '../sidenav/shared/sidenav.action';
import { SetCurrentlyOpenByRouteAction } from '../sidenav/shared/sidenav.action';
import { Store } from '@ngrx/store';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { SelectLayoutAction, SetCardElevationAction } from '../layout/shared/layout.action';
import { Inversion } from 'app/modelos/inversiones/inversion';

@Component({
  selector: 'elastic-route-handler',
  templateUrl: './route-handler.component.html',
  styleUrls: ['./route-handler.component.scss']
})
export class RouteHandlerComponent implements OnInit {

  constructor(
    private store: Store<fromRoot.State>,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    // Set Sidenav Currently Open on Page load
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.store.dispatch(new SetCurrentlyOpenByRouteAction(event.urlAfterRedirects));
      }
    });

    // You can use ?layout=beta to load the page with Layout Beta as default
    // Same with ?elevation=5 (anything from 0 to 24)
    this.store.dispatch(new SelectLayoutAction('gamma'));

    /*
    this.route.queryParamMap.subscribe((params) => {
      const layout = params.get('layout');

      switch (layout) {
        case 'alpha': {
          this.store.dispatch(new SelectLayoutAction('alpha'));
          break
        }

        case 'beta': {
          this.store.dispatch(new SelectLayoutAction('beta'));
          break
        }

        case 'gamma': {
          this.store.dispatch(new SelectLayoutAction('gamma'));
          break
        }
      }

      const elevation = params.get('elevation');

      if (elevation) {
        this.store.dispatch(new SetCardElevationAction('card-elevation-z' + elevation))
      }
    });
    */

    // Define Menu Items here


    //############################## Inventarios ################################




    //###########################################################################

    // Top Level Item (The item to click on so the dropdown opens)
    const dashboard = new SidenavItem({
      name: 'Dashboard',
      icon: 'dashboard',
      subItems: [ ],
      position: 1
    });

    // Sub Items for the Top Level Item (The items shown when you clicked on the dropdown item)
    // Note: The Top Level Item is added as "parent" in those items, here "dashboard" (variable from above)
    const dashboardSubItems = [
      new SidenavItem({
        name: 'Dashboard',
        route: '/',
        parent: dashboard,
        subItems: [ ],
        position: 1,
        routerLinkActiveOptions: {
          exact: true
        }
      }),
      new SidenavItem({
        name: 'All-In-One Board',
        route: '/dashboard/all-in-one',
        parent: dashboard,
        subItems: [ ],
        position: 1
      }),
      new SidenavItem({
        name: 'CRM Dashboard',
        route: '/dashboard/crm',
        parent: dashboard,
        subItems: [ ],
        position: 1
      }),
    ];

    // Push the just created Sub Items into the Top Level Item
    dashboard.subItems.push(...dashboardSubItems);

    const inbox = new SidenavItem({
      name: 'Inbox',
      icon: 'mail',
      route: '/apps/inbox',
      subItems: [ ],
      position: 1
    });

    const chat = new SidenavItem({
      name: 'Chat',
      icon: 'message',
      route: '/apps/chat',
      subItems: [ ],
      position: 1
    });

    const forms = new SidenavItem({
      name: 'Forms',
      icon: 'assignment',
      route: null,
      subItems: [ ],
      position: 1
    });

    const formsSubItems = [
      new SidenavItem({
        name: 'Form Elements',
        route: '/forms/form-elements',
        parent: forms,
        subItems: [ ],
        position: 1
      }),

      new SidenavItem({
        name: 'Form Wizard',
        route: '/forms/form-wizard',
        parent: forms,
        subItems: [ ],
        position: 1
      })
    ];

    forms.subItems.push(...formsSubItems);

    const pages = new SidenavItem({
      name: 'Pages',
      icon: 'library_books',
      subItems: [ ],
      position: 1
    });

    const pagesSubItems = [
      new SidenavItem({
        name: 'Profile',
        route: '/pages/profile',
        parent: pages,
        subItems: [ ],
        position: 1
      }),
      new SidenavItem({
        name: 'Projects',
        route: '/pages/projects',
        parent: pages,
        subItems: [ ],
        position: 1
      }),
      new SidenavItem({
        name: 'Project Details',
        route: '/pages/project-details',
        parent: pages,
        subItems: [ ],
        position: 1
      }),
    ];

    pages.subItems.push(...pagesSubItems);

    const auth = new SidenavItem({
      name: 'Auth',
      icon: 'person_pin',
      route: null,
      subItems: [ ],
      position: 1
    });

    const authSubItems = [
      new SidenavItem({
        name: 'Login',
        route: '/auth/login',
        parent: auth,
        subItems: [ ],
        position: 1
      }),
      new SidenavItem({
        name: 'Register',
        route: '/auth/register',
        parent: auth,
        subItems: [ ],
        position: 1
      }),
      new SidenavItem({
        name: 'Forgot Password',
        route: '/auth/forgot-password',
        parent: auth,
        subItems: [ ],
        position: 1
      }),
    ];

    auth.subItems.push(...authSubItems);

    const components = new SidenavItem({
      name: 'Components',
      icon: 'layers',
      route: '/components',
      subItems: [ ],
      position: 1
    });

    const tables = new SidenavItem({
      name: 'Tables',
      icon: 'format_line_spacing',
      route: null,
      subItems: [ ],
      position: 1
    });

    const tablesSubItems = [
      new SidenavItem({
        name: 'Simple Table',
        route: '/tables/simple-table',
        parent: tables,
        subItems: [ ],
        position: 1
      }),
      new SidenavItem({
        name: 'Table Pagination',
        route: '/tables/table-pagination',
        parent: tables,
        subItems: [ ],
        position: 1
      }),
      new SidenavItem({
        name: 'Table Sorting',
        route: '/tables/table-sorting',
        parent: tables,
        subItems: [ ],
        position: 1
      }),
      new SidenavItem({
        name: 'Table Filtering',
        route: '/tables/table-filtering',
        parent: tables,
        subItems: [ ],
        position: 1
      }),
      new SidenavItem({
        name: 'Datatable',
        route: '/tables/datatable',
        parent: tables,
        subItems: [ ],
        position: 1
      }),
      new SidenavItem({
        name: 'All-In-One Table',
        route: '/tables/all-in-one-table',
        parent: tables,
        subItems: [ ],
        position: 1
      })
    ];

    tables.subItems.push(...tablesSubItems);

    /*const editor = new SidenavItem({
      name: 'Editor',
      icon: 'format_shapes',
      route: '/editor',
      subItems: [ ],
      position: 1
    });*/

    const dragAndDrop = new SidenavItem({
      name: 'Drag & Drop',
      icon: 'mouse',
      route: '/drag-and-drop',
      subItems: [ ],
      position: 1
    });

    const maps = new SidenavItem({
      name: 'Maps',
      icon: 'map',
      route: '/maps/google-maps',
      subItems: [ ],
      position: 1
    });

    const icons = new SidenavItem({
      name: 'Material Icons',
      icon: 'grade',
      route: '/material-icons',
      subItems: [ ],
      position: 1
    });

    const multiLevelMenu = new SidenavItem({
      name: 'Multi-Level Menu',
      icon: 'menu',
      route: null,
      subItems: [ ],
      position: 1
    });

    const multiLevelMenuLevel1 = new SidenavItem({
      name: 'Level 1',
      route: null,
      parent: multiLevelMenu,
      subItems: [ ],
      position: 1
    });

    const multiLevelMenuLevel2 = new SidenavItem({
      name: 'Level 2',
      route: null,
      parent: multiLevelMenuLevel1,
      subItems: [ ],
      position: 1
    });

    const multiLevelMenuLevel3 = new SidenavItem({
      name: 'Level 3',
      route: null,
      parent: multiLevelMenuLevel2,
      subItems: [ ],
      position: 1
    });

    const multiLevelMenuLevel4 = new SidenavItem({
      name: 'Level 4',
      route: null,
      parent: multiLevelMenuLevel3,
      subItems: [ ],
      position: 1
    });

    const multiLevelMenuLevel5 = new SidenavItem({
      name: 'Level 5',
      route: null,
      parent: multiLevelMenuLevel4,
      subItems: [ ],
      position: 1
    });

    multiLevelMenu.subItems.push(multiLevelMenuLevel1);
    multiLevelMenuLevel1.subItems.push(multiLevelMenuLevel2);
    multiLevelMenuLevel2.subItems.push(multiLevelMenuLevel3);
    multiLevelMenuLevel3.subItems.push(multiLevelMenuLevel4);
    multiLevelMenuLevel4.subItems.push(multiLevelMenuLevel5);

    //#region INVENTARIO
    //############################## INICIO DE INVENTARIO ##########################################
    const inventario = new SidenavItem({
      name: 'Inventarios',
      icon: 'library_books',
      route: null,
      subItems: [ ],
      position: 1
    });

    const gestionDatosInventario = new SidenavItem({
      name: 'Gestión de datos',
      route: null,
      parent: inventario,
      subItems: [ ],
      position: 1
    })

    const gestionDatosInventarioSubItems = [
      new SidenavItem({
        name: 'Artículos',
        route: '/inventario/articulos',
        parent: gestionDatosInventario,
        subItems: [ ],
        position: 1,
        routerLinkActiveOptions: {
          exact: true
        }
      }),
      new SidenavItem({
        name: 'Categorías',
        route: '/inventario/categorias',
        parent: gestionDatosInventario,
        subItems: [ ],
        position: 1
      }),
      new SidenavItem({
        name: 'Departamentos',
        route: '/inventario/departamentos',
        parent: gestionDatosInventario,
        subItems: [ ],
        position: 1
      }),
      new SidenavItem({
        name: 'Estados',
        route: '/inventario/estados',
        parent: gestionDatosInventario,
        subItems: [ ],
        position: 1
      }),
      new SidenavItem({
        name: 'Proveedores',
        route: '/inventario/proveedores',
        parent: gestionDatosInventario,
        subItems: [ ],
        position: 1
      }),
      new SidenavItem({
        name: 'Tipos de artículos',
        route: '/inventario/tiposarticulo',
        parent: gestionDatosInventario,
        subItems: [ ],
        position: 1
      }),
      new SidenavItem({
        name: 'Usuarios',
        route: '/inventario/usuarios',
        parent: gestionDatosInventario,
        subItems: [ ],
        position: 1
      }),
    ];

    const reportesInventario = new SidenavItem({
      name: 'Reportes',
      route: null,
      parent: inventario,
      subItems: [ ],
      position: 1
    })

    //Reportes
    const reportesInventarioSubItems = [      
      new SidenavItem({
        name: 'Tar. de responsabilidad',
        route: '/inventario/tarjetas',
        parent: reportesInventario,
        subItems: [ ],
        position: 1,
        routerLinkActiveOptions: {
          exact: true
        }
      }),
      new SidenavItem({
        name: 'Inventario de Activos Fijos',
        route: '/inventario/reportes/inventarioactivosfijos',
        parent: reportesInventario,
        subItems: [ ],
        position: 1,
        routerLinkActiveOptions: {
          exact: true
        }
      }),
      new SidenavItem({
        name: 'Bajas de Activos Fijos',
        route: '/inventario/reportes/bajasactivosfijos',
        parent: reportesInventario,
        subItems: [ ],
        position: 1,
        routerLinkActiveOptions: {
          exact: true
        }
      }),
      new SidenavItem({
        name: 'Activos Fijos con depreciacion',
        route: '/inventario/reportes/depreciacionactivosfijos',
        parent: reportesInventario,
        subItems: [ ],
        position: 1
      }),
      new SidenavItem({
        name: 'Compra Interna',
        route: '/inventario/reportes/subasta',
        parent: reportesInventario,
        subItems: [ ],
        position: 1
      }),
      new SidenavItem({
        name: 'Compra Externa',
        route: '/inventario/reportes/compraexterna',
        parent: reportesInventario,
        subItems: [ ],
        position: 1
      }),
      new SidenavItem({
        name: 'Control de donaciones',
        route: '/inventario/reportes/donaciones',
        parent: reportesInventario,
        subItems: [ ],
        position: 1
      }),
      new SidenavItem({
        name: 'Control de asignaciones',
        route: '/inventario/reportes/responsables',
        parent: reportesInventario,
        subItems: [ ],
        position: 1
      }),
      new SidenavItem({
        name: 'Asignaciones por usuario',
        route: '/inventario/reportes/activosporusuario',
        parent: reportesInventario,
        subItems: [ ],
        position: 1
      })
    ]
    
    reportesInventario.subItems.push(...reportesInventarioSubItems);
    gestionDatosInventario.subItems.push(...gestionDatosInventarioSubItems);
    inventario.subItems.push(gestionDatosInventario);
    inventario.subItems.push(reportesInventario);
    this.store.dispatch(new fromSidenav.AddSidenavItemAction(inventario));


    //#endregion

    //#region INVERSIONES
    //############################## INICIO DE INVERSIONES ##########################################
    const inversiones = new SidenavItem({
      name: 'Inversiones',
      icon: 'attach_money',
      route: null,
      subItems: [ ],
      position: 1
    });

    const gestionDatosInversiones = new SidenavItem({
      name: 'Gestión de datos',
      route: null,
      parent: inversiones,
      subItems: [ ],
      position: 1
    })

    const gestionDatosInversionesSubItems = [
      new SidenavItem({
        name: 'Inversiones',
        route: '/inversiones/inversiones',
        parent: gestionDatosInversiones,
        subItems: [ ],
        position: 1,
        routerLinkActiveOptions: {
          exact: true
        }
      }),
      new SidenavItem({
        name: 'Bancos',
        route: '/inversiones/bancos',
        parent: gestionDatosInversiones,
        subItems: [ ],
        position: 1,
        routerLinkActiveOptions: {
          exact: true
        }
      }),
      new SidenavItem({
        name: 'Cuentas',
        route: '/inversiones/cuentas',
        parent: gestionDatosInversiones,
        subItems: [ ],
        position: 1,
        routerLinkActiveOptions: {
          exact: true
        }
      })
    ];

    const reportesInversiones = new SidenavItem({
      name: 'Reportes',
      route: null,
      parent: inversiones,
      subItems: [ ],
      position: 1
    })

    //Reportes
    const reportesInversionesSubItems = [      
      new SidenavItem({
        name: 'Control de vencimiento',
        route: '/inversiones/reportes/control-vencimiento',
        parent: reportesInversiones,
        subItems: [ ],
        position: 1,
        routerLinkActiveOptions: {
          exact: true
        }
      }),
      new SidenavItem({
        name: 'Interes mensual',
        route: '/inversiones/reportes/interes-mensual',
        parent: reportesInversiones,
        subItems: [ ],
        position: 1,
        routerLinkActiveOptions: {
          exact: true
        }
      }),
      new SidenavItem({
        name: 'Integración de documento a Plazo Fijo',
        route: '/inversiones/reportes/integracion-plazo-fijo',
        parent: reportesInversiones,
        subItems: [ ],
        position: 1,
        routerLinkActiveOptions: {
          exact: true
        }
      })
    ]

    reportesInversiones.subItems.push(...reportesInversionesSubItems)
    gestionDatosInversiones.subItems.push(...gestionDatosInversionesSubItems)
    inversiones.subItems.push(gestionDatosInversiones);
    inversiones.subItems.push(reportesInversiones);
    this.store.dispatch(new fromSidenav.AddSidenavItemAction(inversiones));


    //#endregion

    // Send the created Menu structure to Redux/ngrx (you only need to send the Top Level Item, all dropdown items will be added automatically)
    this.store.dispatch(new fromSidenav.AddSidenavItemAction(dashboard));
    this.store.dispatch(new fromSidenav.AddSidenavItemAction(inbox));
    this.store.dispatch(new fromSidenav.AddSidenavItemAction(chat));
    this.store.dispatch(new fromSidenav.AddSidenavItemAction(forms));
    this.store.dispatch(new fromSidenav.AddSidenavItemAction(components));
    this.store.dispatch(new fromSidenav.AddSidenavItemAction(tables));
    
    


    this.store.dispatch(new fromSidenav.AddSidenavItemAction(auth));
    this.store.dispatch(new fromSidenav.AddSidenavItemAction(pages));
    this.store.dispatch(new fromSidenav.AddSidenavItemAction(dragAndDrop));
    this.store.dispatch(new fromSidenav.AddSidenavItemAction(maps));
    this.store.dispatch(new fromSidenav.AddSidenavItemAction(icons));
    this.store.dispatch(new fromSidenav.AddSidenavItemAction(multiLevelMenu));
  }

}
