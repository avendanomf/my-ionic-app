import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class JsonFileService {

  private apiUrl = 'https://localhost:7068/api/RegistroCHO/';

  constructor(private http: HttpClient) { }

  saveJSONToFile(data: any) {
    const json = JSON.stringify(data);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.post(this.apiUrl + 'Save', json, { headers });
  }

  getListAll() {
    return this.http.get(this.apiUrl + 'getListAll');
  }
  getList() {
    return this.http.get(this.apiUrl + 'getList');
  }
}
