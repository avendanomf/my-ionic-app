import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ReporteCHORoutingModule } from './reporte-chorouting.module';
import { ListaChoComponent } from './pages/lista-cho/ListaChoComponent';

@NgModule({
  declarations: [
    ListaChoComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    ReporteCHORoutingModule
  ],
  providers: []
})
export class ReporteCHOModule { }
