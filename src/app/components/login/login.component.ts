import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Usuario } from '../../models/usuario';
import { Router } from '@angular/router';  // Importa Router
import { AuthService } from '../../services/auth.service'; // Importa AuthService

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email: String = '';
  contrasena: String = '';
  errorMessage: String = '';


  constructor(private authService:AuthService, private http: HttpClient, private router: Router) {}

  onSubmit() {
    const loginData = { correo: this.email, contrasena: this.contrasena };

    this.http.post<Usuario>('http://localhost:8080/api/usuario/login', loginData)
      .subscribe({
        next: (usuario) => {
          if (usuario) {
            this.authService.guardarUsuario(usuario);
            this.authService.estaAutenticado();
            this.router.navigate(['/landing-page']);
          } else {
            this.errorMessage = 'Credenciales incorrectas';
          }
        },
        error: (error) => {
          console.error(error);
          this.errorMessage = 'Error al conectar con el servidor.';
        }
      });
  }

  irARegistro() {
    this.router.navigate(['/registro']);
  }

}