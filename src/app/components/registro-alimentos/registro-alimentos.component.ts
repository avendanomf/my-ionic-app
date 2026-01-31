import { Component, OnInit, Output, EventEmitter, ViewChild, Renderer2 } from '@angular/core';
import { Alimento } from 'src/app/interfaces/alimentos';
import { AlimentosService } from 'src/app/services/alimentos.service';
import { GeminiService } from 'src/app/services/gemini.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-registro-alimentos',
  templateUrl: './registro-alimentos.component.html',
  styleUrls: ['./registro-alimentos.component.scss'],
})

export class RegistroAlimentosComponent implements OnInit {
  // Declaración de variables
  filas: any[] = [];
  newFila: any = { name: '', pesoGramos: '', pesoTabla: '', choTabla: '', gramosCarbohidratos: '' };
  alimentos: Alimento[] = [];
  keyword = 'name';

  totalCHO: number = 0;
  isModalOpen: boolean = false;
  showResults: boolean = false;
  searchQuery: string = '';
  selectedOption: string = 'buscar'; // Inicializar opción seleccionada
  imageAI: string = '';
  aiResults: any[] = [];
  loadingAI: boolean = false;

  @Output() totalCHOEvent = new EventEmitter<any[]>();
  @Output() totalCaloriasEvent = new EventEmitter<number>();

  @ViewChild('itemTemplate', { static: true }) itemTemplate: any;
  @ViewChild('notFoundTemplate', { static: true }) notFoundTemplate: any;

  selectedItem: Alimento | undefined;

  public results: Alimento[] = [];

  constructor(
    private alimentosService: AlimentosService,
    private renderer: Renderer2,
    private geminiSvc: GeminiService,
    private utilsSvc: UtilsService
  ) {
    this.cargarListcomidas();
  }

  ngOnInit() { }

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
    this.newFila = { name: '', pesoGramos: '', pesoTabla: '', choTabla: '', gramosCarbohidratos: '' };
    this.searchQuery = '';
    this.isModalOpen = false;
  }

  addFila() {
    if (this.selectedOption === 'buscar' && this.newFila.name && this.newFila.pesoGramos) {
      this.calcularCHO(this.newFila);
    }

    if (this.selectedOption === 'manual' && this.newFila.name && this.newFila.gramosCarbohidratos) {
      // Si no se ingresan calorías, calcularlas a partir del CHO
      if (!this.newFila.caloriasPorcion || this.newFila.caloriasPorcion === '') {
        this.newFila.caloriasPorcion = (parseFloat(this.newFila.gramosCarbohidratos) * 4).toFixed(2);
      }
    }

    this.filas.push({ ...this.newFila });
    this.newFila = { name: '', pesoGramos: '', pesoTabla: '', choTabla: '', gramosCarbohidratos: '', caloriasPorcion: '' };
    this.searchQuery = '';
    this.calcularTotalCHO();
    this.closeModal();
  }

  quitarFila(index: number) {
    this.filas.splice(index, 1);
    this.calcularTotalCHO();
  }

  selectResult(item: Alimento) {
    this.newFila.name = item.name;
    this.newFila.pesoTabla = item.peso;
    this.newFila.choTabla = item.gramos;
    this.newFila.caloriasTabla = item.calorias; // Nuevo campo
    this.searchQuery = item.name;
    this.showResults = false;
  }

  calcularCHO(fila: any) {
    if (fila.pesoGramos && fila.choTabla && fila.pesoTabla) {
      fila.gramosCarbohidratos = ((fila.pesoGramos * fila.choTabla) / fila.pesoTabla).toFixed(2);
    } else {
      fila.gramosCarbohidratos = '0.00';
    }
    this.calcularCalorias(fila); // <-- Agrega esta línea
    this.calcularTotalCHO();
  }

  calcularCalorias(fila: any) {
    if (fila.pesoGramos && fila.caloriasTabla && fila.pesoTabla) {
      fila.caloriasPorcion = ((fila.pesoGramos * fila.caloriasTabla) / fila.pesoTabla).toFixed(2);
    } else {
      fila.caloriasPorcion = '0.00';
    }
  }

  calcularTotalCHO() {
    const totalCHO = this.filas.reduce((total, fila) => {
      const cho = typeof fila.gramosCarbohidratos === 'string'
        ? parseFloat(fila.gramosCarbohidratos.replace(',', '.'))
        : Number(fila.gramosCarbohidratos) || 0;
      return total + cho;
    }, 0).toFixed(2);

    const totalCalorias = this.filas.reduce((total, fila) => total + (parseFloat(fila.caloriasPorcion) || 0), 0);
    this.totalCHOEvent.emit(this.filas);
    this.totalCaloriasEvent.emit(totalCalorias);
  }

  restaurarCampos() {
    this.filas = [];
    this.alimentos = [];
  }

  handleInput(event: any) {
    const normalize = (str: string) =>
      str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

    const query = normalize(event.target.value);
    this.results = this.alimentos.filter(d =>
      normalize(d.name).includes(query)
    );
    this.showResults = this.results.length > 0;
  }

  async takeImageAI() {
    try {
      this.isModalOpen = false;
      const photo = await this.utilsSvc.takePicture('Imagen de Alimento', false);
      this.isModalOpen = true;

      if (photo && photo.dataUrl) {
        this.imageAI = photo.dataUrl;
        this.analyzeWithAI();
      }
    } catch (error) {
      this.isModalOpen = true;
      console.log('Cámara cancelada o error:', error);
    }
  }

  async analyzeWithAI() {
    this.loadingAI = true;
    this.aiResults = [];

    try {
      const foodNames = this.alimentos.map(a => a.name);
      const results = await this.geminiSvc.analyzeFoodImage(this.imageAI, foodNames);

      this.aiResults = results.map((res: any) => {
        const alimentoFull = this.alimentos.find(a => a.name === res.name);

        if (alimentoFull) {
          return {
            ...alimentoFull,
            pesoGramos: res.pesoGramos,
            seleccionado: true,
            isNew: false
          };
        } else {
          // El alimento no está en la base de datos local
          return {
            name: res.name,
            pesoGramos: res.pesoGramos,
            gramos: res.cho || 0, // CHO estimado por la IA
            calorias: res.calorias || 0, // Calorías estimadas por la IA
            peso: res.pesoGramos, // Lo usamos como base para escala si editan el peso
            tamanio: 'Detectado por IA',
            seleccionado: true,
            isNew: true
          };
        }
      });

    } catch (error) {
      console.error(error);
      this.utilsSvc.presentToast({
        message: 'Error analizando la imagen',
        duration: 2500,
        color: 'danger',
        position: 'middle'
      });
    } finally {
      this.loadingAI = false;
    }
  }

  addAIItems() {
    const itemsToAdd = this.aiResults.filter(r => r.seleccionado);

    for (let item of itemsToAdd) {
      let fila = {
        name: item.name,
        pesoGramos: item.pesoGramos,
        pesoTabla: item.peso,
        choTabla: item.gramos,
        caloriasTabla: item.calorias,
        gramosCarbohidratos: 0,
        caloriasPorcion: 0
      };

      this.calcularCHO(fila);
      this.filas.push(fila);
    }

    this.calcularTotalCHO();
    this.closeModal();
    this.imageAI = '';
    this.aiResults = [];
  }
}
