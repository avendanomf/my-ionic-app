import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Alimento } from '../interfaces/alimentos';

@Injectable({
  providedIn: 'root'
})
export class AlimentosService {
  private alimentosUrl = 'assets/data/ListCho.json';

  constructor(private http: HttpClient) { }

  // Método para cargar todos los alimentos
  getAllAlimentos(): Observable<Alimento[]> {
    return this.http.get<Alimento[]>(this.alimentosUrl);
  }
}
