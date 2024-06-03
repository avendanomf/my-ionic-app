import { Component, OnInit } from '@angular/core';
import { JsonFileService } from 'src/app/services/save-json.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-lista-cho',
  templateUrl: './lista-cho.component.html',
  styleUrls: ['./lista-cho.component.css'],
  providers: [DatePipe]
})
export class ListaChoComponent implements OnInit {
  dataReporte: any[] = [];
  filteredData: any[] = [];
  tipoConsulta: string = 'Todas';
  tipoComida: string = 'Todas';
  alimento: string = 'Todos';

  constructor(private jsonFileService: JsonFileService) {}

  ngOnInit() {
    this.obtenerData();
  }

  obtenerData() {
    this.jsonFileService.getList().subscribe((res: any) => {
      console.log(res.response);
      this.dataReporte = res.response;
      this.applyFilters();
    }, (error: any) => { // Especificar el tipo del parámetro error
      console.log(error);
    });
  }

  applyFilters() {
    this.filteredData = this.dataReporte;

    if (this.tipoConsulta !== 'Todas') {
      this.filteredData = this.filteredData.filter(item => item.tipoConsulta === this.tipoConsulta);
    }

    if (this.tipoComida !== 'Todas') {
      this.filteredData = this.filteredData.filter(item => item.tipoComida === this.tipoComida);
    }

    if (this.alimento !== 'Todos') {
      this.filteredData = this.filteredData.filter(item => item.alimento === this.alimento);
    }
  }

  onFilterChange() {
    this.applyFilters();
  }

  imprimirReporte() {
    console.log('Imprimir reporte con datos:', this.filteredData);
    // Aquí puedes agregar la lógica para generar el reporte en el formato que necesites (PDF, Excel, etc.)
  }
}
