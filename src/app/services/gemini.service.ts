import { Injectable } from '@angular/core';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class GeminiService {

    private genAI = new GoogleGenerativeAI(environment.geminiKey);

    constructor() { }

    async analyzeFoodImage(imageUri: string, foodNames: string[]) {
        // Lista expandida para cubrir modelos 2.0 y posibles remanentes estables de 1.5
        const modelsToTry = [
            "gemini-2.0-flash",
            "gemini-2.0-flash-lite",
            "gemini-1.5-flash",
            "gemini-1.5-pro"
        ];

        let lastError: any;

        for (let attempt = 1; attempt <= 4; attempt++) {
            let attemptSuccessful = false;
            for (const modelName of modelsToTry) {
                try {
                    console.log(`Intento ${attempt} con modelo ${modelName}...`);
                    const model = this.genAI.getGenerativeModel({ model: modelName });

                    const base64Data = imageUri.split(',')[1];
                    const prompt = `
            Eres un experto en nutrición y reconocimiento de alimentos para personas con diabetes.
            Analiza esta imagen y compárala con esta lista de alimentos conocidos:
            [${foodNames.join(', ')}]

            INSTRUCCIONES:
            1. Identifica los alimentos presentes. Si están en LA LISTA, usa el nombre EXACTO.
            2. Si un alimento NO está en la lista (ej: paquete de papas, Gansito, marca específica):
               - Identifícalo por su nombre comercial o común.
               - Estima sus Carbohidratos (CHO) y Calorías para la porción visible (basado en etiquetas si son visibles o conocimiento estándar).
               - Marca estos alimentos como "isNew": true.
            3. Estima el peso REAL en gramos de la porción usando objetos de referencia.
            4. Responde ÚNICAMENTE un array JSON válido.

            FORMATO DE RESPUESTA:
            [
              {
                "name": "Nombre", 
                "pesoGramos": número, 
                "isNew": boolean,
                "cho": número (solo si isNew: true, representa CHO totales en esa porción),
                "calorias": número (solo si isNew: true, representa Calorías totales en esa porción)
              }
            ]

            Si no hay comida, responde: []
          `;

                    const result = await model.generateContent([
                        prompt,
                        {
                            inlineData: {
                                data: base64Data,
                                mimeType: "image/jpeg"
                            }
                        }
                    ]);

                    const response = await result.response;
                    let text = response.text().trim();

                    const jsonMatch = text.match(/\[.*\]/s);
                    if (jsonMatch) {
                        text = jsonMatch[0];
                    }

                    attemptSuccessful = true;
                    return JSON.parse(text);
                } catch (error: any) {
                    lastError = error;
                    const msg = error.message || '';
                    console.warn(`Falló con modelo ${modelName}:`, msg);

                    // Si es 404 (no encontrado), probar el siguiente modelo
                    if (msg.includes('404')) continue;

                    // Si es 429 (quota), intentar el siguiente modelo de una vez
                    // (a veces un modelo tiene cuota y el otro no)
                    if (msg.includes('429')) continue;
                }
            }

            // Si probamos todos los modelos y fallaron, esperamos para el próximo intento general
            if (!attemptSuccessful && attempt < 4) {
                const delay = Math.pow(2, attempt) * 1000;
                console.log(`Todos los modelos sin cuota. Reintentando en ${delay}ms...`);
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }

        throw lastError;
    }

}
