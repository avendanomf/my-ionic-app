import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path:'home',
    loadChildren:()=>import('./modules/conteo-cho/conteo-cho.module').then(m => m.ConteoChoModule)
  },
  {
    path:'report',
    loadChildren:()=>import('./modules/reporte-cho/reporte-cho.module').then(m => m.ReporteCHOModule)
  }
  ,
  {
    path:'**',
    redirectTo:'home'
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
