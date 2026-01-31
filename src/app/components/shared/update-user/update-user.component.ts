import { Component, Input, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/interfaces/user';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
    selector: 'app-update-user',
    templateUrl: './update-user.component.html',
    styleUrls: ['./update-user.component.scss'],
})
export class UpdateUserComponent implements OnInit {

    @Input() user!: User;

    firebaseSvc = inject(FirebaseService);
    utilsSvc = inject(UtilsService);

    form = new FormGroup({
        uid: new FormControl(''),
        name: new FormControl('', [Validators.required, Validators.minLength(4)]),
        ratio: new FormControl(0, [Validators.required]),
        sensibilidad: new FormControl(0, [Validators.required]),
    })

    ngOnInit() {
        this.form.setValue({
            uid: this.user.uid,
            name: this.user.name,
            ratio: this.user.ratio,
            sensibilidad: this.user.sensibilidad
        })
    }

    async submit() {
        if (this.form.valid) {

            const loading = await this.utilsSvc.loading();
            await loading.present();

            let path = `users/${this.user.uid}`;

            delete this.form.value.uid;

            this.firebaseSvc.updateDocument(path, this.form.value).then(async res => {

                this.user.name = this.form.value.name;
                this.user.ratio = this.form.value.ratio;
                this.user.sensibilidad = this.form.value.sensibilidad;

                this.utilsSvc.saveInLocalStorage('user', this.user);
                this.utilsSvc.dismissModal({ success: true });

                this.utilsSvc.presentToast({
                    message: 'Perfil actualizado exitosamente',
                    duration: 1500,
                    color: 'success',
                    position: 'middle',
                    icon: 'checkmark-circle-outline'
                })

            }).catch(error => {
                console.log(error);

                this.utilsSvc.presentToast({
                    message: error.message,
                    duration: 2500,
                    color: 'primary',
                    position: 'middle',
                    icon: 'alert-circle-outline'
                })

            }).finally(() => {
                loading.dismiss();
            })
        }
    }

}
