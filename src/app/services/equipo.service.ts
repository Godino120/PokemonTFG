import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EquipoService {
  private apiUrl = 'http://localhost:8080/api/equipos';

  constructor(private http: HttpClient, private authService: AuthService) {}

  guardarEquipo(equipo: any[]): Observable<any> {
    const usuarioId = this.authService.obtenerUsuarioId();
    const body = {
      idUsuario: usuarioId,
      pokemones: equipo.map(p => p.id)
    };
    return this.http.post(this.apiUrl + '/guardar', body);
  }

  obtenerEquiposUsuario(): Observable<any[]> {
    const usuarioId = this.authService.obtenerUsuarioId();
    return this.http.get<any[]>(`${this.apiUrl}/usuario/${usuarioId}`);
  }

  borrarEquipo(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
