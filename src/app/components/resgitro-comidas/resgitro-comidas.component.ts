import { Component, Output, EventEmitter, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { Observable, Subject, debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs';
import { Alimento } from 'src/app/interfaces/alimentos';
import { AlimentosService } from 'src/app/services/alimentos.service';


@Component({
  selector: 'app-resgitro-comidas',
  templateUrl: './resgitro-comidas.component.html',
  styleUrls: ['./resgitro-comidas.component.css']
})
export class ResgitroComidasComponent {
  filas: any[] = [
    { name: '', pesoGramos: '', pesoTabla: '', choTabla: '', gramosCarbohidratos: '' }
  ];
  alimentos: Alimento[] = [];
  keyword = 'name';
  
  totalCHO: number = 0;
  @Output() totalCHOEvent = new EventEmitter<any[]>();
  @ViewChild('pesoGramosInput', { static: false }) pesoGramosInput: ElementRef;


  selectedItem: Alimento | undefined;

  constructor(private alimentosService: AlimentosService, private renderer: Renderer2) {
    this.cargarListcomidas();
    this.pesoGramosInput = new ElementRef(null);
  }
  cargarListcomidas(){
    this.alimentosService.getAllAlimentos().subscribe(data => {
      this.alimentos = data;
    });
  }

  agregarFila() {
    this.filas.push({ name: '', pesoGramos: '', pesoTabla: '', choTabla: '', gramosCarbohidratos: '' });
  }

  quitarFila(index: number) {
    this.filas.splice(index, 1);
    this.calcularTotalCHO();
  }

  selectEvent(fila: any, item: any) {
    fila.name = item.name;
    fila.pesoTabla = item.peso;
    fila.choTabla = item.gramos;
    const pesoGramosInput = fila.pesoGramosInput;

    if (pesoGramosInput) {
      this.renderer.selectRootElement(pesoGramosInput.nativeElement).focus();
    }
  }
  calcularCHO(fila: any) {
    fila.gramosCarbohidratos = ((fila.pesoGramos * fila.choTabla) / fila.pesoTabla).toFixed(2);
    this.calcularTotalCHO();
  }
  calcularTotalCHO() {
    const totalCHO = this.filas.reduce((total, fila) => total + parseFloat(fila.gramosCarbohidratos.replace(',', '.')) || 0, 0).toFixed(2);
    this.totalCHOEvent.emit(this.filas);
    // console.log('Total CHO calculado:', totalCHO);
  }

  restaurarCampos()
  {
    this.cargarListcomidas();
    this.filas  = [
      { name: '', pesoGramos: '', pesoTabla: '', choTabla: '', gramosCarbohidratos: '' }
    ];
    this.alimentos = [];
  }

}

