import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';


export interface ClienteDTO {
  id?: number;
  nome: string;
  ativo?: boolean;
  cnpj: string;
}

@Injectable({
  providedIn: 'root'
})
export class ClientesService {
  private apiUrl = `${environment.apiUrl}/clientes`;

  private http = inject(HttpClient);
  private readonly API = `${environment.apiUrl}/clientes`;

  getAll(): Observable<ClienteDTO[]> {
    return this.http.get<ClienteDTO[]>(this.API);
  }

  getById(id: number): Observable<ClienteDTO> {
    return this.http.get<ClienteDTO>(`${this.API}/${id}`);
  }

  create(data: ClienteDTO): Observable<ClienteDTO> {
    return this.http.post<ClienteDTO>(this.API, data);
  }

  update(id: number, data: ClienteDTO): Observable<ClienteDTO> {
    return this.http.patch<ClienteDTO>(`${this.API}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`);
  }

  updateClient(id: string, data: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}`, data);
  }
}
