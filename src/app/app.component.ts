import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    { title: 'Home', url: '/home', icon: 'home' },
    { title: 'Reportes', url: '/report', icon: 'document' },
    { title: 'Tab 3', url: '/tab3', icon: 'information-circle' }
  ];

  constructor() {}
}
