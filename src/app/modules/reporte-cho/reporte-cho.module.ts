import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReporteCHORoutingModule } from './reporte-chorouting.module';
import { HttpClientModule } from '@angular/common/http';
import { ListaChoComponent } from './pages/lista-cho/lista-cho.component';



@NgModule({
  declarations: [
    ListaChoComponent
  ],
  imports: [
    CommonModule,
    ReporteCHORoutingModule,
    HttpClientModule
  ]
})
export class ReporteCHOModule { }
