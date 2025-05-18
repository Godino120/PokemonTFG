import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from '../models/usuario';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private autenticadoSubject = new BehaviorSubject<boolean>(this.estaAutenticado());
  autenticado$ = this.autenticadoSubject.asObservable();

  constructor(private router: Router) {}

  guardarUsuario(usuario: Usuario): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('usuario', JSON.stringify(usuario));
      this.autenticadoSubject.next(true);
    }
  }

  obtenerUsuario(): Usuario | null {
    if (typeof window !== 'undefined') {
      const usuarioStr = localStorage.getItem('usuario');
      return usuarioStr ? JSON.parse(usuarioStr) : null;
    }
    return null;
  }

  obtenerUsuarioId(): number | null {
    const usuario = this.obtenerUsuario();
    return usuario ? usuario.id : null;
  }

  cerrarSesion(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('usuario');
      this.autenticadoSubject.next(false);
      this.router.navigate(['/login']);
    }
  }

  estaAutenticado(): boolean {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem('usuario');
    }
    return false;
  }
}