import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { IonicModule } from '@ionic/angular'; // Asegúrate de importar IonicModule
import { ReporteCHORoutingModule } from './reporte-chorouting.module'; // Asegúrate de que el nombre del archivo es correcto
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
    IonicModule, // Asegúrate de importar IonicModule
    ReporteCHORoutingModule,
    SharedModule
  ],
  providers: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA] // Asegúrate de añadir CUSTOM_ELEMENTS_SCHEMA
})
export class ReporteCHOModule { }
