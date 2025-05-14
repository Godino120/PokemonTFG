import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RegistroService } from '../../services/registro.service'; 
import { Router } from '@angular/router'; // No olvides importar Router
import { exit } from 'node:process';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent {
  nombre:string='';
  email: string = '';
  contrasena: string = '';
  mensajeError:string='';

  constructor(private registroService: RegistroService, private router: Router) {}

  usuarioCreado:boolean=false;

  registrarUsuario() {
    this.registroService.crearUsuario(this.nombre, this.email, this.contrasena).subscribe({
      next: (usuario) => {
        console.log('Usuario creado', usuario);
        this.usuarioCreado = true;
        this.router.navigate(['/login']);
      },
      error: (err) => {
        if (err.status === 400 && err.error?.error) {
          console.error('Correo electrónico ya registrado');
          alert("No se ha podido completar el registro, este usuario ya esta registrado");
          this.mensajeError = err.error.error; 
        } else {
          alert("Error al crear el usuario");
          console.error('Error creando usuario', err);
        }
      }
    });
  }

  irALogin() {
    this.router.navigate(['/login']);
  }
}