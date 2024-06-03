import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'report',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./modules/conteo-cho/conteo-cho.module').then(m => m.ConteoChoModule)
  },
  {
    path: 'report',
    loadChildren: () => import('./modules/reporte-cho/reporte-cho.module').then(m => m.ReporteCHOModule)
  },
  {
    path: 'tab3',
    loadChildren: () => import('./tab3/tab3.module').then(m => m.Tab3PageModule)
  },
  {
    path: '**',
    redirectTo: 'report'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
