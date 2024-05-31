import { NgbCalendar, NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";
import { Fila } from './filas';
import { Glucometrias } from "./glucometrias";
import { Insulinas } from "./insulinas";

export class FormRegistro {
    fecha: NgbDateStruct | undefined;
    comida: string | undefined;
    totalCHO: number | undefined;
    // comidas?: Fila []= [];
    glucometria?:Glucometrias[]= [];
    insulinas?:Insulinas[]= [];

    constructor(private calendar: NgbCalendar, public comidas: Fila []= []) {
        this.fecha = this.calendar.getToday();
        this.comida = '';        
    }
}


