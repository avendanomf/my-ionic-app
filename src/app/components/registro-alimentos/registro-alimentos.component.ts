import { Component, OnInit, Output, EventEmitter, ViewChild, Renderer2 } from '@angular/core';
import { Alimento } from 'src/app/interfaces/alimentos';
import { AlimentosService } from 'src/app/services/alimentos.service';

@Component({
  selector: 'app-registro-alimentos',
  templateUrl: './registro-alimentos.component.html',
  styleUrls: ['./registro-alimentos.component.scss'],
})
export class RegistroAlimentosComponent implements OnInit {
  filas: any[] = [];
  newFila: any = { name: '', pesoGramos: '', pesoTabla: '', choTabla: '', gramosCarbohidratos: '' };
  alimentos: Alimento[] = [];
  keyword = 'name';

  totalCHO: number = 0;
  isModalOpen: boolean = false;
  showResults: boolean = false;
  searchQuery: string = '';
  @Output() totalCHOEvent = new EventEmitter<any[]>();

  @ViewChild('itemTemplate', { static: true }) itemTemplate: any;
  @ViewChild('notFoundTemplate', { static: true }) notFoundTemplate: any;

  selectedItem: Alimento | undefined;

  constructor(private alimentosService: AlimentosService, private renderer: Renderer2) {
    this.cargarListcomidas();
  }

  ngOnInit() {}

  cargarListcomidas() {
    this.alimentosService.getAllAlimentos().subscribe(data => {
      this.alimentos = data;
      this.results = [...this.alimentos];
    });
  }

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.newFila.name = "";
    this.newFila.pesoTabla = "";
    this.newFila.choTabla = "";
    this.searchQuery = "";

    this.isModalOpen = false;
  }

  addFila() {
    if (this.newFila.name && this.newFila.pesoGramos) {
      this.calcularCHO(this.newFila);
      this.filas.push({ ...this.newFila });
      this.newFila = { name: '', pesoGramos: '', pesoTabla: '', choTabla: '', gramosCarbohidratos: '' };
      this.searchQuery = ''; // Clear the search query when adding a row
      this.calcularTotalCHO();
      this.closeModal();
    }
  }

  quitarFila(index: number) {
    this.filas.splice(index, 1);
    this.calcularTotalCHO();
  }

  selectResult(item: Alimento) {
    this.newFila.name = item.name;
    this.newFila.pesoTabla = item.peso;
    this.newFila.choTabla = item.gramos;
    this.searchQuery = item.name; // Set the search query to the selected item's name
    this.showResults = false;
  }

  calcularCHO(fila: any) {
    if (fila.pesoGramos && fila.choTabla && fila.pesoTabla) {
      fila.gramosCarbohidratos = ((fila.pesoGramos * fila.choTabla) / fila.pesoTabla).toFixed(2);
    } else {
      fila.gramosCarbohidratos = '0.00';
    }
    this.calcularTotalCHO();
  }

  calcularTotalCHO() {
    const totalCHO = this.filas.reduce((total, fila) => total + (parseFloat(fila.gramosCarbohidratos.replace(',', '.')) || 0), 0).toFixed(2);
    this.totalCHOEvent.emit(this.filas);
  }

  restaurarCampos() {
    this.filas = [];
    this.alimentos = [];
  }

  public results: Alimento[] = [];

  handleInput(event: any) {
    const query = event.target.value.toLowerCase();
    this.results = this.alimentos.filter(d => d.name.toLowerCase().includes(query));
    this.showResults = this.results.length > 0;
  }
}
