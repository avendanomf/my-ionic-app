export class Comida {
    constructor(
      public comidaNombre: string = "",
      public pesoGramos: number = 0,
      public pesoTabla: number = 0,
      public choTabla: number = 0,
      public gramosCarbohidratos: number = 0
    ) {}
  }
  
  export class GlucometriaTBL {
    constructor(
      public horaRegistro: string = "",
      public nivelGlucosa: number = 0
    ) {}
  }
  
  export class InsulinaTBL {
    constructor(
      public insulinaCho: number = 0,
      public insulinaGlucometria: number = 0,
      public insulinaTotal: number = 0
    ) {}
  }
  
  export class SaveRegistroApi {
    constructor(
      public fecha: string = "",
      public comida: string = "",
      public totalCho: number = 0,
      public tblComida: Comida[] = [],
      public tblGlucometria: GlucometriaTBL[] = [],
      public tblInsulinas: InsulinaTBL[] = []
    ) {}
  }
  