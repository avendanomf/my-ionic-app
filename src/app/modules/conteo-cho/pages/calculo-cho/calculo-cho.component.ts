import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbCalendar, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { ParametersService } from '../../../../services/parameters.service';
import { Parameter } from 'src/app/interfaces/parameter';
import { FormRegistro } from 'src/app/interfaces/form-registro';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, NgForm } from '@angular/forms';
import { JsonFileService } from 'src/app/services/save-json.service';
import { Insulinas } from 'src/app/interfaces/insulinas';
import { Glucometrias } from 'src/app/interfaces/glucometrias';
import { Comida, GlucometriaTBL, InsulinaTBL, SaveRegistroApi } from 'src/app/interfaces/save-registro-api';
import { Fila } from 'src/app/interfaces/filas';
import { ResgitroComidasComponent } from 'src/app/components/resgitro-comidas/resgitro-comidas.component';
import { RegistroAlimentosComponent } from 'src/app/components/registro-alimentos/registro-alimentos.component';




@Component({
  selector: 'app-calculo-cho',
  templateUrl: './calculo-cho.component.html',
  styleUrls: ['./calculo-cho.component.css']
})
export class CalculoChoComponent implements OnInit {

  parameter: Parameter;

  model: NgbDateStruct | undefined;
  today = this.calendar.getToday();
  comidaValida = true;

  fechaRegistro: Date = new Date();

  registro: FormRegistro;
  insulinas: Insulinas;
  glucometrias: Glucometrias;
  SaveRegistroApi: SaveRegistroApi;
  @ViewChild(ResgitroComidasComponent) registroAlimentos: RegistroAlimentosComponent | undefined;


  constructor(
    private calendar: NgbCalendar,
    private parameterService: ParametersService,
    private toastr: ToastrService,
    private jsonFileService: JsonFileService,
  ) {
    this.parameter = new Parameter();
    this.registro = new FormRegistro(calendar);
    this.insulinas = new Insulinas();
    this.glucometrias = new Glucometrias();
    this.SaveRegistroApi = new SaveRegistroApi();
  }

  ngOnInit(): void {
    this.parameterService.getAllParameters().subscribe(data => {
      if (data.length > 0) {
        const parameter = data[0];
        //console.log(JSON.stringify(parameter));
        this.parameter.Ratio = parameter.Ratio;
        this.parameter.Sensibilidad = parameter.Sensibilidad;
        this.parameter.gluMax = parameter.gluMax;
        this.parameter.glucoMin = parameter.glucoMin;
        this.parameter.glucoMeta = parameter.glucoMeta;
      }
    });
  }
  actualizarTotalCHO(filas: any) {
    this.registro.totalCHO = filas.reduce((total: number, fila: any) => total + parseFloat(fila.gramosCarbohidratos), 0);
    this.registro.comidas = filas;
    this.calcInsulinaCHO();
    // console.log('desde el hijo: ' + JSON.stringify(this.registro));
    // console.log('padre: ' + JSON.stringify(this.registro));
  }
  calcInsulinaCHO() {
    //console.log('totalcho: '+ this.totalCHO);
    if (this.registro.totalCHO !== undefined && this.parameter.Ratio !== undefined) {
      this.insulinas.insulinaCHO = parseFloat((this.registro.totalCHO / this.parameter.Ratio).toFixed(2));
    } else {
      this.insulinas.insulinaCHO = 0;
    }
    this.insulinaxGluco();
    //console.log(this.insulinaCHO);
  }

  insulinaxGluco() {
    if (this.glucometrias.nivelGlucosa != undefined && this.glucometrias.nivelGlucosa != 0) {
      this.insulinas.insulinaGlucometria = parseFloat(((this.glucometrias.nivelGlucosa - this.parameter.glucoMeta) / this.parameter.Sensibilidad).toFixed(2));
    }
    if (this.insulinas.insulinaCHO != undefined && this.insulinas.insulinaGlucometria != undefined) {
      this.insulinas.insulinaTotal = Math.round(this.insulinas.insulinaCHO + this.insulinas.insulinaGlucometria);
    }
    //console.log(this.totalInsulina);
  }

  validarCamposComidas(): boolean {
    if (this.registro.comidas != undefined) {
      for (const fila of this.registro.comidas) {
        if (!fila.name || !fila.pesoGramos) {
          return false;
        }
      }
      return true;
    }
    return false;
  }

  validarCampos(): string {
    switch (true) {
      case !this.registro.comida:
        return 'false';
      case !this.registro.fecha:
        return 'false';
      case !this.glucometrias.nivelGlucosa:
        return 'false';
      default:
        if (this.registro.comidas != undefined) {
          console.log('ingreso al if');
          if (this.registro.comidas.length > 0) {
            for (const fila of this.registro.comidas) {
              if (!fila.name || !fila.pesoGramos) {
                return 'false';
              }
            }
          }
          else {
            return "warning";
          }
        }
        else {
          return "false";
        }
        return 'true';
    }
  }


  formatDate(date: NgbDateStruct | undefined): string {
    if (date) {
      const year = date.year || 0;
      const month = date.month || 1;
      const day = date.day || 1;

      const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

      return formattedDate;
    }
    return '';
  }

  guardarDatos() {
    switch (this.validarCampos()) {
      case 'true':
        this.saveJSON();

        break;
      case 'false':
        this.toastr.error('Faltan campos por diligenciar', 'error');
        break;
      case 'warning':
        this.toastr.warning('no se diligencio comidas', 'warning');
        break;
      default:

    }
  }

  saveJSON(): boolean {

    const vsaveRegistroApi = new SaveRegistroApi();
    vsaveRegistroApi.comida = this.registro.comida !== undefined ? this.registro.comida : '';
    vsaveRegistroApi.fecha = this.formatDate(this.registro.fecha);
    console.log(this.formatDate(this.registro.fecha));
    vsaveRegistroApi.totalCho = this.registro.totalCHO !== undefined ? this.registro.totalCHO : 0;
    vsaveRegistroApi.tblComida = this.registro.comidas.map((fila: Fila) => {
      const vcomida: Comida = {
        comidaNombre: fila.name,
        pesoGramos: parseFloat(fila.pesoGramos),
        pesoTabla: parseFloat(fila.pesoTabla),
        choTabla: parseFloat(fila.choTabla),
        gramosCarbohidratos: parseFloat(fila.gramosCarbohidratos)
      };
      return vcomida;
    });

    const vglucometria = new GlucometriaTBL();
    vglucometria.horaRegistro = this.glucometrias.horaRegistro !== undefined ? this.glucometrias.horaRegistro : "";
    vglucometria.nivelGlucosa = this.glucometrias.nivelGlucosa !== undefined ? this.glucometrias.nivelGlucosa : 0;

    vsaveRegistroApi.tblGlucometria = [vglucometria];


    const vinsulinaTBL: InsulinaTBL = {
      insulinaCho: this.insulinas.insulinaCHO,
      insulinaGlucometria: this.insulinas.insulinaGlucometria,
      insulinaTotal: this.insulinas.insulinaTotal
    };

    if (Array.isArray(vsaveRegistroApi.tblInsulinas)) {
      vsaveRegistroApi.tblInsulinas.push(vinsulinaTBL);
    } else {
      vsaveRegistroApi.tblInsulinas = [vinsulinaTBL];
    }
    console.log(JSON.stringify(vsaveRegistroApi));

    this.jsonFileService.saveJSONToFile(vsaveRegistroApi).subscribe(res => {
      console.log(res);
      this.toastr.success('Campos guardados correctamente', 'success');
      setTimeout(() => {
        this.limpiarCampos();
      }, 1000);
    },
      error => {
        console.log(error)
        this.toastr.error('Error guardando la informacion: ' + JSON.stringify(error), 'error');
      });
    return true;
  }

  limpiarCampos() {
    debugger;
    this.registro = new FormRegistro(this.calendar);
    this.insulinas = new Insulinas();
    this.glucometrias = new Glucometrias();
    if (this.registroAlimentos) {
      this.registroAlimentos.restaurarCampos();
    }
  }
}
