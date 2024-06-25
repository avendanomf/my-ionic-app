import { Component, OnInit, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { groupBy } from 'lodash';
import { User } from 'src/app/interfaces/user';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { FormRegistro } from 'src/app/interfaces/form-registro';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-reporte-cho',
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

    reportes: FormRegistro[] = [];
    groupedReportes: { [key: string]: FormRegistro[] } = {};
    filteredGroupedReportes: { [key: string]: FormRegistro[] } = {};

    fechaInicio: Date;
    fechaFin: Date;

    constructor() { }

    firebaseSvc = inject(FirebaseService);
    utilsSvc = inject(UtilsService);
    user(): User {
        return this.utilsSvc.getFromLocalStorage('user');
    }

    ionViewWillEnter() {
        this.getReport();
        this.setDefaultDates();
    }

    setDefaultDates() {
        const today = new Date();
        this.fechaFin = today;
        this.fechaInicio = new Date(today.getFullYear(), today.getMonth(), 1);
    }

    getReport() {
        let path = `users/${this.user().uid}/registroCho`;
        let sub = this.firebaseSvc.getCollectionData(path).subscribe({
            next: (res: any) => {
                this.reportes = res;
                // Group data by fecha after receiving data
                this.groupedReportes = this.groupAndSortReportes(this.reportes);
                this.aplicarFiltro();
                sub.unsubscribe();
            }
        })
    }

    groupAndSortReportes(reportes: FormRegistro[]): { [key: string]: FormRegistro[] } {
        // Group by date
        const grouped = groupBy(reportes, (registro) => registro.fecha?.toString());
        // Sort and round within each date group
        Object.keys(grouped).forEach(date => {
            grouped[date] = grouped[date].map(registro => {
                // Redondear valores numéricos
                registro.totalCho = Math.round(registro.totalCho);
                registro.tblGlucometria.forEach(glucometria => {
                    glucometria.nivelGlucosa = Math.round(glucometria.nivelGlucosa);
                });
                registro.tblInsulinas.forEach(insulina => {
                    insulina.insulinaCho = Math.round(insulina.insulinaCho);
                    insulina.insulinaTotal = Math.round(insulina.insulinaTotal);
                    insulina.insulinaGlucometria = Math.round(insulina.insulinaGlucometria);
                });
                return registro;
            }).sort((a, b) => {
                const order = ["Desayuno", "Almuerzo", "Comida"];
                return order.indexOf(a.comida) - order.indexOf(b.comida);
            });
        });
        return grouped;
    }

    aplicarFiltro() {
        const fechaInicioStr = this.fechaInicio.toISOString().split('T')[0];
        const fechaFinStr = this.fechaFin.toISOString().split('T')[0];

        this.filteredGroupedReportes = Object.keys(this.groupedReportes)
            .filter(date => date >= fechaInicioStr && date <= fechaFinStr)
            .reduce((obj, key) => {
                obj[key] = this.groupedReportes[key];
                return obj;
            }, {});
    }

    onFechaInicioChange(event: any) {
        this.fechaInicio = new Date(event.detail.value);
    }

    onFechaFinChange(event: any) {
        this.fechaFin = new Date(event.detail.value);
    }

    parseDate(dateString: string): NgbDateStruct {
        const parts = dateString.split('-');
        return {
            year: parseInt(parts[0], 10),
            month: parseInt(parts[1], 10),
            day: parseInt(parts[2], 10),
        };
    }

    formatDate(date: NgbDateStruct): string {
        const day = date.day < 10 ? '0' + date.day : date.day;
        const month = date.month < 10 ? '0' + date.month : date.month;
        return `${day}/${month}/${date.year}`;
    }

    ngOnInit() {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Setear la hora a 00:00:00.000
        this.fechaInicio = today;
        this.fechaFin = today;
      }

}
