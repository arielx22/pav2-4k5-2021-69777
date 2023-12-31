import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import { of } from 'rxjs';
import { environment } from '../../environments/environment';
import { Equipo } from '../models/equipo';

@Injectable({
  providedIn: 'root',
})
export class EquiposService {
  resourceUrl: string;
  constructor(private httpClient: HttpClient) {
    //this.resourceUrl = environment.ConexionWebApiProxy + 'Articulos/';
    //this.resourceUrl = 'https://localhost:44349/api/Articulos/';
    this.resourceUrl = 'https://pav2.azurewebsites.net/api/Equipos/';
  }

  /*get(Titulo: string, Activo: boolean) {
    let params = new HttpParams();
    if (Titulo != null) {
      params = params.append('Titulo', Titulo);
    }
    if (Activo != null) {
      params = params.append('Activo', Activo.toString());
    }
    //params = params.append('Pagina', Pagina.toString());

    return this.httpClient.get(this.resourceUrl, { params: params });
  }*/
  get() {
    return this.httpClient.get(this.resourceUrl);
  }

  getById(Id: number) {
    return this.httpClient.get(this.resourceUrl + Id);
  }

  post(obj: Equipo) {
    return this.httpClient.post(this.resourceUrl, obj);
  }

  put(Id: number, obj: Equipo) {
    return this.httpClient.put(this.resourceUrl + Id, obj);
  }

  delete(Id) {
    return this.httpClient.delete(this.resourceUrl + Id);
  }
}