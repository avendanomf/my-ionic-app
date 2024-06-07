import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ReporteCHORoutingModule } from './reporte-chorouting.module';
import { ListaChoComponent } from './pages/lista-cho/ListaChoComponent';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    ListaChoComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    ReporteCHORoutingModule,
    SharedModule
  ],
  providers: []
})
export class ReporteCHOModule { }

