import { Component } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-parametros',
  templateUrl: './parametros.component.html',
  styleUrls: ['./parametros.component.scss']
})
export class ParametrosComponent {
  estatura: number;
  peso: number;
  ratio: number;
  sensibilidad: number;
  glucometriaMin: number;
  glucometriaMax: number;

  constructor(private toastController: ToastController) {}

  async onSubmit() {
    // Lógica para guardar los parámetros
    localStorage.setItem('parametros', JSON.stringify({
      estatura: this.estatura,
      peso: this.peso,
      ratio: this.ratio,
      sensibilidad: this.sensibilidad,
      glucometriaMin: this.glucometriaMin,
      glucometriaMax: this.glucometriaMax
    }));

    const toast = await this.toastController.create({
      message: 'Información guardada con éxito',
      duration: 2000,
      position: 'top'
    });
    await toast.present();
  }
}
