import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sesion',
  templateUrl: './sesion.component.html',
  styleUrls: ['./sesion.component.css'],
  imports: [FormsModule, CommonModule]
})
export class SesionComponent {
  isLoginMode: boolean = true; // Modo por defecto: iniciar sesión

  toggleMode(): void {
    this.isLoginMode = !this.isLoginMode; // Cambiar entre iniciar sesión y registrarse
  }

  onSubmit(form: any): void {
    if (this.isLoginMode) {
      console.log('Iniciar sesión con:', form.value);
      // Aquí puedes agregar la lógica para iniciar sesión
    } else {
      console.log('Registrarse con:', form.value);
      // Aquí puedes agregar la lógica para registrarse
    }
  }
}
