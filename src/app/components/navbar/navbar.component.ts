import { CommonModule } from '@angular/common';
import { Component, computed, Signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  
  estaAutenticado: Signal<boolean> = computed(() => this.authService.estaAutenticado());

  constructor(private router: Router, private authService: AuthService) { 
    this.authService = authService;
  }

  navegarALandingPage(): void {
    this.router.navigate(['/landing-page']);
  }

  navegarAPokedex(): void {
    this.router.navigate(['/pokedex']);
  }

  navegarACrearEquipo(): void {
    this.router.navigate(['/crear-equipo']);
  }

  navegarAMisEquipos(): void {
    this.router.navigate(['/mis-equipos']);
  }

  navegarASesion(): void {
    if(this.authService.estaAutenticado()){
      this.router.navigate(['/perfil']);
    } else {
      this.router.navigate(['/login']);
    }
  }
}
