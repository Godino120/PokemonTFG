import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  autenticado: boolean = false;
  private sub?: Subscription;

  constructor(private router: Router, private authService: AuthService) { 
    this.authService = authService;
  }

  ngOnInit() {
    this.autenticado = this.authService.estaAutenticado();
    this.sub = this.authService.autenticado$.subscribe(
      estado => this.autenticado = estado
    );
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  estaAutenticado() {
    return this.autenticado;
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
    this.router.navigate(['/login']);
  }

  cerrarSesion(): void {
    this.authService.cerrarSesion();
    this.router.navigate(['/login']);
  }
}
