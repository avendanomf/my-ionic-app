import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainPage } from './main.page';

const routes: Routes = [
  {
    path: '',
    component: MainPage,
    children: [
      {
        path: 'profile',
        loadChildren: () => import('./profile/profile.module').then(m => m.ProfilePageModule)
      },
      {
        path: 'report',
        loadChildren: () => import('../../modules/reporte-cho/reporte-cho.module').then(m => m.ReporteCHOModule)
      },
      {
        path: 'conteo-cho',
        loadChildren: () => import('../../modules/conteo-cho/conteo-cho.module').then(m => m.ConteoChoModule)
      },
      {
        path: 'parametros',
        loadChildren: () => import('../../modules/parametros/parametros.module').then(m => m.ParametrosModule)
        
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainPageRoutingModule { }
