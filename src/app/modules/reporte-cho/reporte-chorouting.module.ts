import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListaChoComponent } from './pages/lista-cho/lista-cho.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: 'list', component: ListaChoComponent },
      { path: '**', redirectTo: 'list' }
    ]
  }
]


@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ]
})
export class ReporteCHORoutingModule { }
