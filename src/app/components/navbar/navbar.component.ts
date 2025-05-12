import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SesionComponent } from '../sesion/sesion.component';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, SesionComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  isSesionModalVisible: boolean = false;

  toggleSesionModal(): void {
    this.isSesionModalVisible = !this.isSesionModalVisible;
  }

  constructor(
    private router: Router
  ) { }

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
}
