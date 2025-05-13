import { Routes } from '@angular/router';
import { OrdenesLayoutComponent } from '../layouts/ordenes-layout/ordenes-layout.component';
import { OrdenesContainerComponent } from '../containers/ordenes-container/ordenes-container.component';

export const ordenesRoutes: Routes = [
  {
    path: '',
    component: OrdenesLayoutComponent,
    children: [
      {
        path: ':page/:size',
        component: OrdenesContainerComponent,
      },
      {
        path: '',
        redirectTo: '0/5',
        pathMatch: 'full',
      },

    ],
  },
];
