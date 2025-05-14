import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

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

  navegarASesion(): void {
    this.router.navigate(['/sesion']);
  }
}
