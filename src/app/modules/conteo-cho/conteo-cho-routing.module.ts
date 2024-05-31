import { NgModule } from '@angular/core';
import { CalculoChoComponent } from './pages/calculo-cho/calculo-cho.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: 'inicio', component: CalculoChoComponent },
      { path: '**', redirectTo: 'inicio' }
    ]
  }
]


@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ]
})
export class ConteoChoRoutingModule { }
