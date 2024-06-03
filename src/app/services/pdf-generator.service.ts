import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Injectable({
  providedIn: 'root'
})
export class PdfGeneratorService {

  constructor() { }

  generatePDF(data: any[]) {
    const doc = new jsPDF('landscape');  // Cambia a orientación horizontal

    // Add title
    doc.text('Reporte de CHO', 14, 16);

    // Add table
    autoTable(doc, {
      head: [['Fecha', 'Control', 'Peso en gramos', 'Peso en tabla', 'Cho en tabla', 'Gramos carbohidratos', 'Total CHO', 'Comida', 'Insula x CHO', 'Glucometria Pre', 'Insulina x Glucometria', 'Total Insulina']],
      body: data.map(item => [
        item.fecha,
        item.control,
        item.pesoEnGramos,
        item.pesoEnTabla,
        item.choEnTabla,
        item.gramosCarbohidratos,
        item.totalCHO,
        item.comida,
        item.insulaXCHO,
        item.glucometriaPre,
        item.insulinaXGlucometria,
        item.totalInsulina
      ]),
      startY: 20
    });

    // Save the PDF
    doc.save('reporte_CHO.pdf');
  }
}
