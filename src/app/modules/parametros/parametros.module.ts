import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ParametrosRoutingModule } from './parametros-routing.module';
import { ParametrosComponent } from './pages/parametros/parametros.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [ParametrosComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ParametrosRoutingModule,
    SharedModule
  ]
})
export class ParametrosModule {}
