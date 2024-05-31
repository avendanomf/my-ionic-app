import { Component, OnInit } from '@angular/core';
import { JsonFileService } from 'src/app/services/save-json.service';
import { DatePipe } from '@angular/common'; 
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-lista-cho',
  templateUrl: './lista-cho.component.html',
  styleUrls: ['./lista-cho.component.css'],
  providers: [DatePipe] 
})
export class ListaChoComponent {

  dataReporte: any;
  constructor(private jsonFileService: JsonFileService) {
  }

  ngOnInit() {
    this.obtenerData();
  }

  obtenerData() {
    this.jsonFileService.getList().subscribe((res: any) => {
      console.log(res.response);
      this.dataReporte = res.response;
    },
      error => {
        console.log(error)
      });
  }
}
