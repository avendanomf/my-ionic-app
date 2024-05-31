import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Parameter } from '../interfaces/parameter';

@Injectable({
  providedIn: 'root'
})
export class ParametersService {
  private parametersUrl = 'assets/data/parameters.json';
  constructor(private http: HttpClient) { }
  getAllParameters(): Observable<Parameter[]> {
    return this.http.get<Parameter[]>(this.parametersUrl);
  }
}

