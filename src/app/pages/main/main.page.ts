import { Component, Input, OnInit, inject } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {


  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);


  public appPages = [
    { title: 'Home', url: '/main/conteo-cho', icon: 'home' },
    { title: 'Reportes', url: '/main/report', icon: 'document' }
  ];
  constructor() { }

  ngOnInit() {
  }

  signOut(){
    this.firebaseSvc.signOut();
  }


}
